'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJSAnimationProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  isConnecting?: boolean;
  size?: number;
}

const ThreeJSAnimation: React.FC<ThreeJSAnimationProps> = ({ 
  isListening = false, 
  isSpeaking = false, 
  isConnecting = false,
  size = 200 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const geometryRef = useRef<THREE.RingGeometry>();
  const materialRef = useRef<THREE.ShaderMaterial>();
  const meshRef = useRef<THREE.Mesh>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Create ring geometry for circular shape
    const geometry = new THREE.RingGeometry(0.3, 0.8, 64, 8);
    geometryRef.current = geometry;

    // Custom shader material for the animated circular gradient
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color('#f59e0b') }, // amber-500
        colorB: { value: new THREE.Color('#d97706') }, // amber-600
        colorC: { value: new THREE.Color('#92400e') }, // amber-800
        opacity: { value: 0.9 },
        isListening: { value: isListening ? 1.0 : 0.0 },
        isSpeaking: { value: isSpeaking ? 1.0 : 0.0 },
        isConnecting: { value: isConnecting ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform vec3 colorC;
        uniform float opacity;
        uniform float isListening;
        uniform float isSpeaking;
        uniform float isConnecting;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Calculate angle from center
          vec2 center = vec2(0.0, 0.0);
          vec2 pos = vPosition.xy;
          float angle = atan(pos.y - center.y, pos.x - center.x);
          
          // Normalize angle to 0-1 range
          float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);
          
          // Create animated segments
          float segments = 12.0;
          float segmentIndex = floor(normalizedAngle * segments);
          float segmentProgress = fract(normalizedAngle * segments);
          
          // Base rotation animation
          float rotationSpeed = isSpeaking > 0.5 ? 2.0 : 0.5;
          float animatedAngle = normalizedAngle + time * rotationSpeed;
          
          // Create pulsing segments when speaking
          float pulse = 1.0;
          if (isSpeaking > 0.5) {
            // Create multiple frequency pulses for speaking animation
            float freq1 = sin(time * 8.0 + segmentIndex * 0.5) * 0.3 + 0.7;
            float freq2 = sin(time * 12.0 + segmentIndex * 0.8) * 0.2 + 0.8;
            float freq3 = sin(time * 6.0 + segmentIndex * 1.2) * 0.25 + 0.75;
            pulse = (freq1 + freq2 + freq3) / 3.0;
            
            // Add some randomness to segments
            pulse *= (sin(segmentIndex * 2.5 + time * 4.0) * 0.2 + 0.8);
          } else if (isConnecting > 0.5) {
            // Gentle pulse when connecting
            pulse = sin(time * 2.0) * 0.2 + 0.8;
          }
          
          // Create color based on angle and animation
          vec3 color1 = mix(colorA, colorB, sin(animatedAngle * 6.28 * 2.0) * 0.5 + 0.5);
          vec3 color2 = mix(colorB, colorC, cos(animatedAngle * 6.28 * 3.0) * 0.5 + 0.5);
          vec3 baseColor = mix(color1, color2, segmentProgress);
          
          // Apply listening state (green tint)
          if (isListening > 0.5) {
            baseColor = mix(baseColor, vec3(0.059, 0.725, 0.506), 0.4); // emerald-500
          }
          
          // Apply pulse effect
          vec3 finalColor = baseColor * pulse;
          
          // Add radial gradient for depth
          float distanceFromCenter = length(pos);
          float radialGradient = smoothstep(0.3, 0.8, distanceFromCenter);
          finalColor *= (0.7 + radialGradient * 0.3);
          
          // Add some shimmer effect
          float shimmer = sin(animatedAngle * 20.0 + time * 3.0) * 0.1 + 0.9;
          finalColor *= shimmer;
          
          gl_FragColor = vec4(finalColor, opacity * pulse);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    materialRef.current = material;

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Add the renderer to the DOM
    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (material.uniforms) {
        material.uniforms.time.value += 0.016; // ~60fps
        material.uniforms.isListening.value = isListening ? 1.0 : 0.0;
        material.uniforms.isSpeaking.value = isSpeaking ? 1.0 : 0.0;
        material.uniforms.isConnecting.value = isConnecting ? 1.0 : 0.0;
      }
      
      // Gentle rotation
      if (mesh) {
        mesh.rotation.z += isSpeaking ? 0.02 : 0.005;
        
        // Subtle scale animation when speaking
        if (isSpeaking) {
          const scaleVariation = 1 + Math.sin(Date.now() * 0.008) * 0.03;
          mesh.scale.setScalar(scaleVariation);
        } else {
          mesh.scale.setScalar(1);
        }
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size]);

  // Update uniforms when props change
  useEffect(() => {
    if (materialRef.current?.uniforms) {
      materialRef.current.uniforms.isListening.value = isListening ? 1.0 : 0.0;
      materialRef.current.uniforms.isSpeaking.value = isSpeaking ? 1.0 : 0.0;
      materialRef.current.uniforms.isConnecting.value = isConnecting ? 1.0 : 0.0;
    }
  }, [isListening, isSpeaking, isConnecting]);

  return (
    <div 
      ref={mountRef} 
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    />
  );
};

export default ThreeJSAnimation;