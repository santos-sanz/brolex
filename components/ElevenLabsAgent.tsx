'use client';

import { useState, useEffect, useRef } from 'react';
import { ElevenLabsConversationalAI } from '@elevenlabs/react';
import { Mic, MicOff, Volume2, VolumeX, Zap, Heart, Crown, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useProductDisplayTool, RecommendedProduct } from '../utils/productDisplayTool';
import RecommendedProducts from './RecommendedProducts';
import ThreeJSAnimation from './ThreeJSAnimation';

// Agent configuration
const AGENTS = {
  MR_HYDE: {
    id: 'agent_01jybb45c6fcwapkfyh35etnqa',
    name: 'Mr Hyde',
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
  DR_JEKYLL: {
    id: 'agent_01jynk52vgepatyn037bfcv2ee',
    name: 'Dr Jekyll',
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

type AgentMode = 'MR_HYDE' | 'DR_JEKYLL';

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
  apiKey, 
  onShowProductCard, 
  onCloseProductCard,
  currentProduct,
  onRemoveProduct 
}: ElevenLabsAgentProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [agentMode, setAgentMode] = useState<AgentMode>('MR_HYDE');
  const [isConnecting, setIsConnecting] = useState(false);
  
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

  // Handle agent mode switching
  const handleAgentSwitch = (newMode: AgentMode) => {
    if (isConnected) {
      toast.error('Please disconnect before switching agents', {
        icon: '⚠️',
      });
      return;
    }
    
    setAgentMode(newMode);
    const newAgent = AGENTS[newMode];
    
    if (newMode === 'MR_HYDE') {
      toast.success('🔥 Mr Hyde activated! Prepare for aggressive luxury sales!', {
        icon: '⚡',
        style: {
          background: '#dc2626',
          color: '#ffffff',
        },
      });
    } else {
      toast.success('💚 Dr Jekyll activated! Refined curation at your service.', {
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
      const productsJson = require('../data/products.json');
      const product = productsJson.find((p: any) => p.id === productId);
      
      if (product) {
        addItem(product);
        
        // Agent-specific responses
        if (agentMode === 'MR_HYDE') {
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
      removeItem(productId);
      
      // Agent-specific responses
      if (agentMode === 'MR_HYDE') {
        toast.success('DESTROYED! Item BANISHED from your collection! 💀', {
          icon: '💥',
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      } else {
        toast.success('Item gently removed from your collection 🌸', {
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
      const quantity = Math.max(0, productData.quantity); // Ensure non-negative quantity
      
      // Find the product in cart to get its name for the toast
      const cartItem = state.items.find(item => item.id === productId);
      const productName = cartItem ? cartItem.name : 'Product';
      
      updateQuantity(productId, quantity);
      
      // Agent-specific responses
      if (agentMode === 'MR_HYDE') {
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
    if (agentMode === 'MR_HYDE') {
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
    if (agentMode === 'MR_HYDE') {
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
      if (agentMode === 'MR_HYDE') {
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
    if (agentMode === 'MR_HYDE') {
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
      if (agentMode === 'MR_HYDE') {
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
    } else {
      // Agent-specific responses for no insurance
      if (agentMode === 'MR_HYDE') {
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
    }
  };

  // ElevenLabs conversation configuration
  const conversationConfig = {
    onConnect: () => {
      console.log('🔗 Connected to ElevenLabs');
      setIsConnected(true);
      setIsConnecting(false);
    },
    onDisconnect: () => {
      console.log('🔌 Disconnected from ElevenLabs');
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
      setIsConnecting(false);
    },
    onError: (error: any) => {
      console.error('❌ ElevenLabs error:', error);
      setIsConnecting(false);
      toast.error('Connection failed. Please try again.');
    },
    onModeChange: (mode: any) => {
      console.log('🎤 Mode changed:', mode);
      setIsListening(mode?.mode === 'listening');
      setIsSpeaking(mode?.mode === 'speaking');
    },
    onMessage: (message: any) => {
      console.log('💬 Message received:', message);
    },
    onToolCall: (toolCall: any) => {
      console.log('🔧 Tool called:', toolCall);
      
      try {
        const { name, parameters } = toolCall;
        
        switch (name) {
          case 'addProductToCart':
            handleAddProductToCart(parameters);
            break;
          case 'removeProductFromCart':
            handleRemoveProductFromCart(parameters);
            break;
          case 'updateCartQuantity':
            handleUpdateCartQuantity(parameters);
            break;
          case 'showCart':
            handleShowCart();
            break;
          case 'hideCart':
            handleHideCart();
            break;
          case 'offerWatchInsurance':
            return handleOfferWatchInsurance();
          case 'removeWatchInsurance':
            handleRemoveWatchInsurance();
            break;
          case 'productDisplay':
            if (onShowProductCard) {
              onShowProductCard(parameters);
            } else {
              handleProductDisplay(parameters);
            }
            break;
          case 'closeProductCard':
            if (onCloseProductCard) {
              onCloseProductCard(parameters?.productId);
            } else {
              handleCloseProductCard(parameters?.productId);
            }
            break;
          default:
            console.warn('Unknown tool:', name);
        }
      } catch (error) {
        console.error('Error handling tool call:', error);
        toast.error('Tool execution failed');
      }
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
  };

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-white">
        <div className="text-center p-8">
          <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">API Key Required</h3>
          <p className="text-slate-600">Please add your ElevenLabs API key to use the AI concierge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white">
      {/* Agent Mode Switch */}
      <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-3">
            {/* Mr Hyde Option */}
            <button
              onClick={() => handleAgentSwitch('MR_HYDE')}
              disabled={isConnected}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                agentMode === 'MR_HYDE'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Zap className="w-4 h-4" />
              <span className="font-medium">Mr Hyde</span>
            </button>

            {/* Toggle Visual */}
            <div className="relative">
              <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                agentMode === 'MR_HYDE' ? 'bg-red-500' : 'bg-emerald-500'
              }`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  agentMode === 'MR_HYDE' ? 'left-1' : 'left-7'
                }`} />
              </div>
            </div>

            {/* Dr Jekyll Option */}
            <button
              onClick={() => handleAgentSwitch('DR_JEKYLL')}
              disabled={isConnected}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                agentMode === 'DR_JEKYLL'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Heart className="w-4 h-4" />
              <span className="font-medium">Dr Jekyll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Agent Header */}
      <div className={`bg-gradient-to-r ${currentAgent.colors.primary} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative text-center">
          <div className="flex items-center justify-center mb-3">
            <currentAgent.icon className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold font-playfair">{currentAgent.name}</h2>
              <p className="text-sm opacity-90">{currentAgent.title}</p>
            </div>
          </div>
          <p className="text-sm opacity-80">{currentAgent.description}</p>
        </div>
      </div>

      {/* Main Agent Interface */}
      <div className="flex-1 flex flex-col">
        {/* Connection Status & Controls */}
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="flex items-center justify-center space-x-4">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${currentAgent.colors.primary} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <currentAgent.icon className="w-5 h-5" />
                <span>{isConnecting ? 'Connecting...' : `Connect to ${currentAgent.name}`}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors duration-200 ${
                    isMuted 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : `bg-slate-100 text-slate-600 hover:bg-slate-200`
                  }`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <div className="text-center">
                  <div className={`text-sm font-medium ${currentAgent.colors.accent}`}>
                    {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Connected'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visualization */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-6">
              <ThreeJSAnimation 
                isListening={isListening}
                isSpeaking={isSpeaking}
                isConnecting={isConnecting}
                size={200}
                mode={agentMode}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-xl font-semibold ${currentAgent.colors.accent} font-playfair`}>
                {currentAgent.name} AI Concierge
              </h3>
              <p className="text-slate-600 text-sm max-w-md">
                {isConnected 
                  ? `${currentAgent.name} is ready to assist with your luxury watch needs`
                  : `Connect to start your conversation with ${currentAgent.name}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        {recommendedProducts.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="mb-3">
              <h4 className={`font-semibold ${currentAgent.colors.accent} flex items-center`}>
                <Sparkles className="w-4 h-4 mr-2" />
                Recommended by {currentAgent.name}
              </h4>
            </div>
            <RecommendedProducts 
              products={recommendedProducts}
              onRemove={removeProduct}
              onClearAll={clearProducts}
            />
          </div>
        )}
      </div>

      {/* ElevenLabs Widget */}
      {isConnected && (
        <div className="absolute inset-0 pointer-events-none">
          <ElevenLabsConversationalAI
            agentId={currentAgentId}
            apiKey={apiKey}
            {...conversationConfig}
          />
        </div>
      )}
    </div>
  );
}