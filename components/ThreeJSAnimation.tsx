'use client';

import { useEffect, useRef, useState } from 'react';
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
  const geometryRef = useRef<THREE.ConeGeometry>();
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

    // Create cone geometry (similar to the ElevenLabs shape)
    const geometry = new THREE.ConeGeometry(0.8, 1.6, 32, 1, true);
    geometryRef.current = geometry;

    // Custom shader material for the gradient effect
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
          // Create radial gradient based on angle
          float angle = atan(vPosition.x, vPosition.z) + time * 0.5;
          float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);
          
          // Create segments like in the ElevenLabs design
          float segments = 8.0;
          float segmentAngle = floor(normalizedAngle * segments) / segments;
          
          // Animate the segments
          float animatedSegment = segmentAngle + time * 0.2;
          
          // Create color transitions
          vec3 color1 = mix(colorA, colorB, sin(animatedSegment * 6.28) * 0.5 + 0.5);
          vec3 color2 = mix(colorB, colorC, cos(animatedSegment * 6.28) * 0.5 + 0.5);
          vec3 finalColor = mix(color1, color2, vUv.y);
          
          // Add listening state (green tint)
          if (isListening > 0.5) {
            finalColor = mix(finalColor, vec3(0.059, 0.725, 0.506), 0.6); // emerald-500
          }
          
          // Add speaking state (more vibrant animation)
          if (isSpeaking > 0.5) {
            float pulse = sin(time * 8.0) * 0.3 + 0.7;
            finalColor *= pulse;
          }
          
          // Add connecting state (subtle pulse)
          if (isConnecting > 0.5) {
            float connectPulse = sin(time * 2.0) * 0.2 + 0.8;
            finalColor *= connectPulse;
          }
          
          // Add some rim lighting
          float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
          rim = pow(rim, 2.0);
          finalColor += rim * 0.3;
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    materialRef.current = material;

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2; // Rotate to match the ElevenLabs orientation
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
      
      // Rotate the mesh for the spinning effect
      if (mesh) {
        mesh.rotation.z += 0.01;
        
        // Add some wobble when speaking
        if (isSpeaking) {
          mesh.rotation.y = Math.sin(Date.now() * 0.005) * 0.1;
          mesh.scale.setScalar(1 + Math.sin(Date.now() * 0.008) * 0.05);
        } else {
          mesh.rotation.y = 0;
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