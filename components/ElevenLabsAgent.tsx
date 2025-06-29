'use client';

import { useState, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Zap, 
  Heart, 
  Crown, 
  Shield, 
  Sparkles, 
  Key, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useProductDisplayTool, RecommendedProduct } from '../utils/productDisplayTool';
import ThreeJSAnimation from './ThreeJSAnimation';

// Agent configuration with proper icon handling
const AGENTS = {
  HYDE: {
    id: 'agent_01jybb45c6fcwapkfyh35etnqa',
    name: 'Hyde',
    title: 'Luxury Sales Demon',
    description: 'Aggressive, persuasive, and slightly unhinged',
    icon: Zap,
    colors: {
      primary: 'from-red-600 to-red-500',
      secondary: 'from-red-900 via-red-800 to-red-900',
      accent: 'text-red-400',
      button: 'bg-red-600 hover:bg-red-500',
      border: 'border-red-600',
      glow: 'shadow-red-500/25'
    }
  },
  JEKYLL: {
    id: 'agent_01jynk52vgepatyn037bfcv2ee',
    name: 'Jekyll',
    title: 'Refined Watch Curator',
    description: 'Sophisticated, gentle, and genuinely helpful',
    icon: Heart,
    colors: {
      primary: 'from-emerald-600 to-emerald-500',
      secondary: 'from-emerald-900 via-emerald-800 to-emerald-900',
      accent: 'text-emerald-400',
      button: 'bg-emerald-600 hover:bg-emerald-500',
      border: 'border-emerald-600',
      glow: 'shadow-emerald-500/25'
    }
  }
};

type AgentMode = 'HYDE' | 'JEKYLL';

interface ElevenLabsAgentProps {
  agentId: string;
  apiKey: string;
  onShowProductCard?: (productData: { productId: number | string; name?: string; price?: string; image?: string; description?: string }) => void;
  onCloseProductCard?: (productId?: number | string) => void;
  currentProduct?: RecommendedProduct | null;
  onRemoveProduct?: (productId: number) => void;
}

export default function ElevenLabsAgent({ 
  agentId, 
  apiKey: initialApiKey, 
  onShowProductCard, 
  onCloseProductCard,
  currentProduct,
  onRemoveProduct 
}: ElevenLabsAgentProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [agentMode, setAgentMode] = useState<AgentMode>('HYDE');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // API Key management - prioritize environment variable
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const { 
    state, 
    addItem, 
    addInsurance, 
    removeItem, 
    updateQuantity, 
    openCart, 
    closeCart 
  } = useCart();
  
  const { 
    recommendedProducts, 
    handleProductDisplay, 
    handleCloseProductCard, 
    removeProduct, 
    clearProducts 
  } = useProductDisplayTool();

  // Get current agent configuration
  const currentAgent = AGENTS[agentMode];
  const currentAgentId = currentAgent.id;

  // Load products data
  const [productsData, setProductsData] = useState<any[]>([]);
  
  useEffect(() => {
    // Load products data
    import('../data/products.json').then((data) => {
      setProductsData(data.default || data);
    });
  }, []);

  // Load API key from environment variables and localStorage on mount
  useEffect(() => {
    // First priority: environment variable
    const envApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    
    if (envApiKey && envApiKey.trim()) {
      console.log('✅ Using API key from environment variables');
      setApiKey(envApiKey.trim());
      setShowApiKeyInput(false);
      return;
    }

    // Second priority: passed prop
    if (initialApiKey && initialApiKey.trim()) {
      console.log('✅ Using API key from props');
      setApiKey(initialApiKey.trim());
      setShowApiKeyInput(false);
      return;
    }

    // Third priority: localStorage
    const savedApiKey = localStorage.getItem('elevenlabs-api-key');
    if (savedApiKey && savedApiKey.trim()) {
      console.log('✅ Using API key from localStorage');
      setApiKey(savedApiKey.trim());
      setShowApiKeyInput(false);
      return;
    }

    // No API key found
    console.log('❌ No API key found, showing input');
    setShowApiKeyInput(true);
  }, [initialApiKey]);

  // Handle API key submission
  const handleApiKeySubmit = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      setShowApiKeyInput(false);
      localStorage.setItem('elevenlabs-api-key', tempApiKey.trim());
      setConnectionError(null);
      toast.success('API Key saved successfully! 🔑', {
        icon: '✅',
      });
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  // Handle agent mode switching
  const handleAgentSwitch = (newMode: AgentMode) => {
    if (conversation.status === 'connected') {
      toast.error('Please disconnect before switching agents', {
        icon: '⚠️',
      });
      return;
    }
    
    setAgentMode(newMode);
    setConnectionError(null);
    const newAgent = AGENTS[newMode];
    
    if (newMode === 'HYDE') {
      toast.success('🔥 Hyde activated! Prepare for aggressive luxury sales!', {
        icon: '⚡',
        style: {
          background: '#dc2626',
          color: '#ffffff',
        },
      });
    } else {
      toast.success('💚 Jekyll activated! Refined curation at your service.', {
        icon: '💚',
        style: {
          background: '#059669',
          color: '#ffffff',
        },
      });
    }
  };

  // ElevenLabs tool handlers with personality-based responses
  const handleAddProductToCart = (productData: { product_id: string }) => {
    console.log('🛒 Add product to cart:', productData);
    
    try {
      const productId = parseInt(productData.product_id, 10);
      
      // Find product in our data
      const product = productsData.find((p: any) => p.id === productId);
      
      if (product) {
        addItem(product);
        
        // Agent-specific responses
        if (agentMode === 'HYDE') {
          toast.success(`BOOM! ${product.name} SMASHED into your collection! 💥`, {
            icon: '⚡',
            duration: 4000,
            style: {
              background: '#dc2626',
              color: '#ffffff',
            },
          });
        } else {
          toast.success(`Added ${product.name} to your collection with care 🌟`, {
            icon: '💚',
            duration: 3000,
            style: {
              background: '#059669',
              color: '#ffffff',
            },
          });
        }
      } else {
        console.error('Product not found:', productId);
        toast.error('Product not found in our collection');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleRemoveProductFromCart = (productData: { product_id: string }) => {
    console.log('🗑️ Remove product from cart:', productData);
    
    try {
      const productId = parseInt(productData.product_id, 10);
      const cartItem = state.items.find(item => item.id === productId);
      const productName = cartItem ? cartItem.name : 'Product';
      
      removeItem(productId);
      
      // Agent-specific responses
      if (agentMode === 'HYDE') {
        toast.success(`DESTROYED! ${productName} BANISHED from your collection! 💀`, {
          icon: '💥',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.success(`${productName} gently removed from your collection 🌸`, {
          icon: '🗑️',
          style: {
            background: '#059669',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
      toast.error('Failed to remove product from cart');
    }
  };

  const handleUpdateCartQuantity = (productData: { product_id: string; quantity: number }) => {
    console.log('📊 Update cart quantity:', productData);
    
    try {
      const productId = parseInt(productData.product_id, 10);
      const quantity = Math.max(0, Number(productData.quantity)); // Ensure non-negative quantity
      
      // Find the product in cart to get its name for the toast
      const cartItem = state.items.find(item => item.id === productId);
      const productName = cartItem ? cartItem.name : 'Product';
      
      updateQuantity(productId, quantity);
      
      // Agent-specific responses
      if (agentMode === 'HYDE') {
        if (quantity === 0) {
          toast.success(`OBLITERATED! ${productName} quantity set to ZERO! 💥`, {
            icon: '💀',
            style: {
              background: '#dc2626',
              color: '#ffffff',
            },
          });
        } else {
          toast.success(`QUANTITY SMASHED to ${quantity} for ${productName}! ⚡`, {
            icon: '🔥',
            style: {
              background: '#dc2626',
              color: '#ffffff',
            },
          });
        }
      } else {
        if (quantity === 0) {
          toast.success(`${productName} thoughtfully removed from cart 🌺`, {
            icon: '✨',
            style: {
              background: '#059669',
              color: '#ffffff',
            },
          });
        } else {
          toast.success(`${productName} quantity updated to ${quantity} with care 💚`, {
            icon: '📊',
            style: {
              background: '#059669',
              color: '#ffffff',
            },
          });
        }
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update cart quantity');
    }
  };

  const handleShowCart = () => {
    console.log('👁️ Show cart');
    openCart();
    
    // Agent-specific responses
    if (agentMode === 'HYDE') {
      toast.success('CART UNLEASHED! Behold your items of DESTRUCTION! 💀', {
        icon: '🛒',
        style: {
          background: '#dc2626',
          color: '#ffffff',
        },
      });
    } else {
      toast.success('Cart gracefully opened for your review 🌺', {
        icon: '🛒',
        style: {
          background: '#059669',
          color: '#ffffff',
        },
      });
    }
  };

  const handleHideCart = () => {
    console.log('🙈 Hide cart');
    closeCart();
    
    // Agent-specific responses
    if (agentMode === 'HYDE') {
      toast.success('Cart BANISHED to the shadow realm! 👻', {
        icon: '🌑',
        style: {
          background: '#dc2626',
          color: '#ffffff',
        },
      });
    } else {
      toast.success('Cart gently tucked away 🌙', {
        icon: '💤',
        style: {
          background: '#059669',
          color: '#ffffff',
        },
      });
    }
  };

  const handleOfferWatchInsurance = () => {
    console.log('🛡️ Offer watch insurance');
    
    // Check if insurance already exists
    const hasInsurance = state.items.some(item => item.isInsurance);
    
    if (hasInsurance) {
      // Agent-specific responses for existing insurance
      if (agentMode === 'HYDE') {
        toast.error('INSURANCE ALREADY DEPLOYED! Your watches are IMMORTAL! 🔥⚡', {
          icon: '🛡️',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.info('Premium Protection Plan already active for your collection 🛡️✨', {
          icon: '💚',
          style: {
            background: '#059669',
            color: '#ffffff',
          },
        });
      }
      return 'Insurance already added to cart';
    }
    
    addInsurance();
    
    // Agent-specific responses
    if (agentMode === 'HYDE') {
      toast.success('ULTIMATE PROTECTION UNLEASHED! Your watches are now IMMORTAL! 🔥⚡', {
        icon: '🛡️',
        duration: 5000,
        style: {
          background: '#dc2626',
          color: '#ffffff',
        },
      });
    } else {
      toast.success('Premium Protection Plan added! Your watches are now insured against reality! 🛡️✨', {
        icon: '💚',
        duration: 4000,
        style: {
          background: '#059669',
          color: '#ffffff',
        },
      });
    }
    
    return 'Insurance added to cart successfully';
  };

  const handleRemoveWatchInsurance = () => {
    console.log('🚫 Remove watch insurance');
    
    // Find and remove insurance item
    const insuranceItem = state.items.find(item => item.isInsurance);
    
    if (insuranceItem) {
      removeItem(insuranceItem.id);
      
      // Agent-specific responses
      if (agentMode === 'HYDE') {
        toast.success('INSURANCE OBLITERATED! Your watches are now VULNERABLE! 💀⚡', {
          icon: '💥',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.success('Protection Plan gracefully removed from your collection 🌸', {
          icon: '🗑️',
          style: {
            background: '#059669',
            color: '#ffffff',
          },
        });
      }
      return 'Insurance removed successfully';
    } else {
      // Agent-specific responses for no insurance
      if (agentMode === 'HYDE') {
        toast.error('NO INSURANCE TO DESTROY! Your watches remain UNPROTECTED! 😈', {
          icon: '⚠️',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.info('No protection plan found in your collection 💭', {
          icon: '🔍',
          style: {
            background: '#059669',
            color: '#ffffff',
          },
        });
      }
      return 'No insurance found to remove';
    }
  };

  const handleShowProductCard = (parameters: { 
    name: string; 
    description?: string; 
    image?: string; 
    tagline?: string; 
    product_id: string; 
    price?: string; 
  }) => {
    console.log('🎯 Show product card:', parameters);
    
    try {
      const productId = parseInt(parameters.product_id, 10);
      
      // Find product in our data first
      const existingProduct = productsData.find((p: any) => p.id === productId);
      
      if (existingProduct) {
        console.log('✅ Found existing product:', existingProduct.name);
        // Use existing product data and display it
        handleProductDisplay({
          productId: existingProduct.id,
          name: existingProduct.name,
          price: existingProduct.price.toString(),
          image: existingProduct.image,
          description: existingProduct.description
        });
      } else {
        console.log('⚠️ Product not found in data, creating from parameters');
        // Create product from agent parameters
        const productData = {
          productId: productId,
          name: parameters.name,
          price: parameters.price || '0',
          image: parameters.image || '/favicon.ico',
          description: parameters.description || parameters.tagline || ''
        };
        
        handleProductDisplay(productData);
      }
      
      // Show success toast
      if (agentMode === 'HYDE') {
        toast.success(`PRODUCT CARD UNLEASHED! Behold ${parameters.name}! 💥`, {
          icon: '🎯',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.success(`Product card displayed: ${parameters.name} 🌟`, {
          icon: '🎯',
          style: {
            background: '#059669',
            color: '#ffffff',
          },
        });
      }
      
      return 'Product card displayed successfully';
    } catch (error) {
      console.error('Error showing product card:', error);
      return 'Failed to display product card';
    }
  };

  // Define client tools for ElevenLabs SDK with exact parameter matching
  const clientTools = {
    addProductToCart: async (parameters: { product_id: string }) => {
      console.log('🔧 addProductToCart called with:', parameters);
      handleAddProductToCart(parameters);
      return 'Product added to cart successfully';
    },
    removeProductFromCart: async (parameters: { product_id: string }) => {
      console.log('🔧 removeProductFromCart called with:', parameters);
      handleRemoveProductFromCart(parameters);
      return 'Product removed from cart successfully';
    },
    updateCartQuantity: async (parameters: { product_id: string; quantity: number }) => {
      console.log('🔧 updateCartQuantity called with:', parameters);
      handleUpdateCartQuantity(parameters);
      return 'Cart quantity updated successfully';
    },
    showCart: async () => {
      console.log('🔧 showCart called');
      handleShowCart();
      return 'Cart displayed successfully';
    },
    hideCart: async () => {
      console.log('🔧 hideCart called');
      handleHideCart();
      return 'Cart hidden successfully';
    },
    offerWatchInsurance: async () => {
      console.log('🔧 offerWatchInsurance called');
      return handleOfferWatchInsurance();
    },
    removeWatchInsurance: async () => {
      console.log('🔧 removeWatchInsurance called');
      return handleRemoveWatchInsurance();
    },
    showProductCard: async (parameters: { 
      name: string; 
      description?: string; 
      image?: string; 
      tagline?: string; 
      product_id: string; 
      price?: string; 
    }) => {
      console.log('🔧 showProductCard called with:', parameters);
      return handleShowProductCard(parameters);
    },
    productDisplay: async (parameters: any) => {
      console.log('🔧 productDisplay called with:', parameters);
      if (onShowProductCard) {
        onShowProductCard(parameters);
      } else {
        handleProductDisplay(parameters);
      }
      return 'Product displayed successfully';
    },
    closeProductCard: async (parameters?: { productId?: number | string }) => {
      console.log('🔧 closeProductCard called with:', parameters);
      if (onCloseProductCard) {
        onCloseProductCard(parameters?.productId);
      } else {
        handleCloseProductCard(parameters?.productId);
      }
      return 'Product card closed successfully';
    }
  };

  // Initialize the useConversation hook
  const conversation = useConversation({
    clientTools,
    onConnect: () => {
      console.log('🔗 Connected to ElevenLabs');
      setIsConnecting(false);
      setConnectionError(null);
      
      // Agent-specific connection messages
      if (agentMode === 'HYDE') {
        toast.success('🔥 Hyde is ONLINE! Ready to DOMINATE luxury sales!', {
          icon: '⚡',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.success('💚 Jekyll connected gracefully. How may I assist you today?', {
          icon: '🌟',
          style: {
            background: '#059669',
            color: '#ffffff',
          },
        });
      }
    },
    onDisconnect: () => {
      console.log('🔌 Disconnected from ElevenLabs');
      setIsListening(false);
      setIsSpeaking(false);
      setIsConnecting(false);
      
      // Agent-specific disconnection messages
      if (agentMode === 'HYDE') {
        toast.error('💀 Hyde has VANISHED into the shadows!', {
          icon: '👻',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.info('🌙 Jekyll has retired for the evening. Thank you!', {
          icon: '💤',
          style: {
            background: '#059669',
            color: '#ffffff',
          },
        });
      }
    },
    onError: (error: any) => {
      console.error('❌ ElevenLabs error:', error);
      setIsConnecting(false);
      
      let errorMessage = 'Connection failed';
      
      // More specific error handling
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized') || error?.message?.includes('API key')) {
        errorMessage = 'Invalid API key';
        setShowApiKeyInput(true);
        toast.error('Invalid API key. Please check your credentials.');
      } else if (error?.message?.includes('404') || error?.message?.includes('agent')) {
        errorMessage = 'Agent not found';
        toast.error('Agent not found. Please check the agent ID.');
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        errorMessage = 'Network error';
        toast.error('Network error. Please check your connection.');
      } else if (error?.message?.includes('CORS')) {
        errorMessage = 'CORS error - API access blocked';
        toast.error('API access blocked. Please check your domain settings.');
      } else {
        errorMessage = error?.message || 'Unknown error';
        toast.error(`Connection failed: ${errorMessage}`);
      }
      
      setConnectionError(errorMessage);
    },
    onMessage: (message: any) => {
      console.log('💬 Message received:', message);
      
      // Update listening/speaking states based on message type
      if (message.type === 'user_transcript') {
        setIsListening(true);
        setIsSpeaking(false);
      } else if (message.type === 'agent_response') {
        setIsListening(false);
        setIsSpeaking(true);
      }
    }
  });

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your ElevenLabs API key first');
      setShowApiKeyInput(true);
      return;
    }
    
    console.log('🔗 Attempting to connect with agent ID:', currentAgentId);
    console.log('🔑 Using API key:', apiKey.substring(0, 10) + '...');
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // For public agents, try direct connection first
      console.log('🎯 Attempting direct connection to public agent...');
      await conversation.startSession({ agentId: currentAgentId });
      
    } catch (directError) {
      console.log('❌ Direct connection failed, trying signed URL approach...');
      
      try {
        // Generate signed URL for the agent
        const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${currentAgentId}`, {
          method: 'GET',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Signed URL response:', response.status, errorText);
          
          if (response.status === 401) {
            throw new Error('Invalid API key');
          } else if (response.status === 404) {
            throw new Error('Agent not found');
          } else {
            throw new Error(`API request failed: ${response.status}`);
          }
        }
        
        const data = await response.json();
        const signedUrl = data.signed_url;
        
        console.log('✅ Got signed URL, starting session...');
        
        // Start the conversation session
        await conversation.startSession({ url: signedUrl });
        
      } catch (signedUrlError) {
        console.error('Signed URL connection error:', signedUrlError);
        throw signedUrlError;
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  // Handle clicking the circle to connect/disconnect
  const handleCircleClick = () => {
    if (conversation.status === 'connected') {
      handleDisconnect();
    } else {
      handleConnect();
    }
  };

  // API Key Input Component
  if (showApiKeyInput && !apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-white p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2 font-playfair">ElevenLabs API Key</h3>
            <p className="text-slate-600 text-sm">Enter your API key to activate the AI concierge</p>
            <p className="text-slate-500 text-xs mt-2">
              Or add NEXT_PUBLIC_ELEVENLABS_API_KEY to your .env file
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your ElevenLabs API key..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-12 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <button
              onClick={handleApiKeySubmit}
              disabled={!tempApiKey.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              <Key className="w-5 h-5" />
              <span>Save API Key</span>
            </button>
            
            <div className="text-center">
              <a 
                href="https://elevenlabs.io/app/speech-synthesis/text-to-speech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 text-sm underline"
              >
                Get your API key from ElevenLabs →
              </a>
            </div>
            
            {apiKey && (
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="w-full text-slate-600 hover:text-slate-800 text-sm py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white">
      {/* Agent Mode Switch - Mobile Responsive */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-center sm:justify-start">
            {/* Hyde Option */}
            <button
              onClick={() => handleAgentSwitch('HYDE')}
              disabled={conversation.status === 'connected'}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base ${
                agentMode === 'HYDE'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${conversation.status === 'connected' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Hyde</span>
            </button>

            {/* Toggle Visual */}
            <div className="relative">
              <div className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-300 ${
                agentMode === 'HYDE' ? 'bg-red-500' : 'bg-emerald-500'
              }`}>
                <div className={`absolute top-0.5 sm:top-1 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-300 ${
                  agentMode === 'HYDE' ? 'left-0.5 sm:left-1' : 'left-6 sm:left-7'
                }`} />
              </div>
            </div>

            {/* Jekyll Option */}
            <button
              onClick={() => handleAgentSwitch('JEKYLL')}
              disabled={conversation.status === 'connected'}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base ${
                agentMode === 'JEKYLL'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${conversation.status === 'connected' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">Jekyll</span>
            </button>
          </div>
          
          {/* API Key Management */}
          <div className="flex items-center space-x-2">
            {/* API Key Status Indicator */}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-slate-600">
                {apiKey ? 'API Key Set' : 'No API Key'}
              </span>
            </div>
            
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
            >
              <Key className="w-4 h-4" />
              <span>API Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* Agent Header - Mobile Responsive */}
      <div className={`bg-gradient-to-r ${currentAgent.colors.primary} p-4 sm:p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative text-center">
          <div className="flex items-center justify-center mb-2 sm:mb-3">
            <currentAgent.icon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-playfair">{currentAgent.name}</h2>
              <p className="text-xs sm:text-sm opacity-90">{currentAgent.title}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm opacity-80 px-4">{currentAgent.description}</p>
        </div>
      </div>

      {/* Main Agent Interface */}
      <div className="flex-1 flex flex-col">
        {/* Visualization - Centered and Mobile Responsive with Click to Connect */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="text-center">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div 
                onClick={handleCircleClick}
                className="cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <ThreeJSAnimation 
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isConnecting={isConnecting}
                  size={typeof window !== 'undefined' && window.innerWidth < 640 ? 150 : 200}
                  mode={agentMode}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-lg sm:text-xl font-semibold ${currentAgent.colors.accent} font-playfair`}>
                {currentAgent.name} AI Concierge
              </h3>
              <p className="text-slate-600 text-sm max-w-md px-4">
                {conversation.status === 'connected'
                  ? `${currentAgent.name} is ready to assist with your luxury watch needs`
                  : isConnecting
                  ? 'Connecting...'
                  : `Click the circle to start your conversation with ${currentAgent.name}`
                }
              </p>
              
              {/* Connection Status */}
              {conversation.status === 'connected' && (
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 sm:p-3 rounded-full transition-colors duration-200 ${
                      isMuted 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : `bg-slate-100 text-slate-600 hover:bg-slate-200`
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  
                  <div className="text-center">
                    <div className={`text-sm font-medium ${currentAgent.colors.accent}`}>
                      {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Connected'}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Connection Error */}
              {connectionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4 max-w-md mx-auto">
                  <p className="text-red-600 text-sm">
                    <strong>Connection Error:</strong> {connectionError}
                  </p>
                  <p className="text-red-500 text-xs mt-1">
                    Please check your API key and try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}