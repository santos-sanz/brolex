'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState, useEffect } from 'react';
import { Mic, Loader2, AlertCircle, Crown, Sparkles, Key, Eye, EyeOff, Play, Square, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeJSAnimation from './ThreeJSAnimation';
import type { RecommendedProduct } from '../utils/productDisplayTool';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import productsJson from '../data/products.json';

interface ElevenLabsError extends Error {
  code?: number;
  message: string;
}

interface ElevenLabsAgentProps {
  agentId: string;
  apiKey: string;
  onShowProductCard?: (parameters: { productId: number | string; name?: string; price?: string; image?: string; description?: string }) => void;
  onCloseProductCard?: (productId?: number | string) => void;
  currentProduct?: RecommendedProduct | null;
  onRemoveProduct?: (productId: number) => void;
}

const ElevenLabsAgent: React.FC<ElevenLabsAgentProps> = ({ 
  agentId, 
  apiKey: envApiKey, 
  onShowProductCard,
  onCloseProductCard,
  currentProduct,
  onRemoveProduct
}) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState(envApiKey);
  const [error, setError] = useState<string | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [addToCartAnimation, setAddToCartAnimation] = useState(false);

  const { addItem, openCart } = useCart();
  const watches = productsJson;

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ Connected to ElevenLabs agent');
      setError(null);
    },
    onDisconnect: () => {
      console.log('❌ Disconnected from ElevenLabs agent');
      setConversationStarted(false);
    },
    onMessage: (message) => {
      console.log('💬 Agent message:', message);
    },
    onError: (error: unknown) => {
      console.error('❌ ElevenLabs agent error:', error);
      const elevenLabsError = error as ElevenLabsError;
      setError(`Connection failed. Please check your API key and try again.`);
    },
    clientTools: {
      showProductCard: async (parameters: any) => {
        console.log('🎯 showProductCard called with parameters:', parameters);
        
        try {
          let productId: number;
          
          if (parameters?.productId !== undefined) {
            productId = typeof parameters.productId === 'string' 
              ? parseInt(parameters.productId, 10) 
              : parameters.productId;
          } else if (parameters?.product_id !== undefined) {
            productId = typeof parameters.product_id === 'string' 
              ? parseInt(parameters.product_id, 10) 
              : parameters.product_id;
          } else if (parameters?.id !== undefined) {
            productId = typeof parameters.id === 'string' 
              ? parseInt(parameters.id, 10) 
              : parameters.id;
          } else if (typeof parameters === 'string') {
            productId = parseInt(parameters, 10);
          } else if (typeof parameters === 'number') {
            productId = parameters;
          } else {
            const paramStr = JSON.stringify(parameters);
            const numberMatch = paramStr.match(/\d+/);
            if (numberMatch) {
              productId = parseInt(numberMatch[0], 10);
            } else {
              return { success: false, error: 'No valid product ID provided.' };
            }
          }
          
          if (isNaN(productId)) {
            return { success: false, error: 'Invalid product ID format' };
          }
          
          if (onShowProductCard) {
            onShowProductCard({ 
              productId,
              name: parameters?.name,
              price: parameters?.price,
              image: parameters?.image,
              description: parameters?.description
            });
            
            return {
              success: true,
              message: `Product ${productId} has been displayed successfully`
            };
          }
          
          return { success: false, error: 'Product display handler not available' };
        } catch (error) {
          console.error('❌ Error in showProductCard:', error);
          return { success: false, error: `Failed to display product: ${error}` };
        }
      },

      closeProductCard: async (parameters: any) => {
        console.log('🎯 closeProductCard called with parameters:', parameters);
        
        try {
          let productId: number | undefined;
          
          // Handle different parameter formats
          if (parameters?.product_id !== undefined) {
            productId = typeof parameters.product_id === 'string' 
              ? parseInt(parameters.product_id, 10) 
              : parameters.product_id;
          } else if (parameters?.productId !== undefined) {
            productId = typeof parameters.productId === 'string' 
              ? parseInt(parameters.productId, 10) 
              : parameters.productId;
          } else if (parameters?.id !== undefined) {
            productId = typeof parameters.id === 'string' 
              ? parseInt(parameters.id, 10) 
              : parameters.id;
          } else if (typeof parameters === 'string' && parameters.trim() !== '') {
            productId = parseInt(parameters, 10);
          } else if (typeof parameters === 'number') {
            productId = parameters;
          }
          
          // If productId is provided but invalid, return error
          if (productId !== undefined && isNaN(productId)) {
            return { success: false, error: 'Invalid product ID format' };
          }
          
          if (onCloseProductCard) {
            onCloseProductCard(productId);
            
            const message = productId !== undefined 
              ? `Product ${productId} has been closed successfully`
              : 'All product cards have been closed successfully';
            
            return {
              success: true,
              message
            };
          }
          
          return { success: false, error: 'Product close handler not available' };
        } catch (error) {
          console.error('❌ Error in closeProductCard:', error);
          return { success: false, error: `Failed to close product card: ${error}` };
        }
      },

      addProductToCart: async (parameters: any) => {
        console.log('🛒 addProductToCart called with parameters:', parameters);
        
        try {
          let productId: number;
          let quantity: number = 1;
          
          // Extract product_id with multiple fallback formats
          if (parameters?.product_id !== undefined) {
            productId = typeof parameters.product_id === 'string' 
              ? parseInt(parameters.product_id, 10) 
              : parameters.product_id;
          } else if (parameters?.productId !== undefined) {
            productId = typeof parameters.productId === 'string' 
              ? parseInt(parameters.productId, 10) 
              : parameters.productId;
          } else if (parameters?.id !== undefined) {
            productId = typeof parameters.id === 'string' 
              ? parseInt(parameters.id, 10) 
              : parameters.id;
          } else if (typeof parameters === 'string') {
            productId = parseInt(parameters, 10);
          } else if (typeof parameters === 'number') {
            productId = parameters;
          } else {
            // Try to extract from currently displayed product
            if (currentProduct?.displayData?.id) {
              productId = currentProduct.displayData.id;
              console.log('🎯 Using currently displayed product ID:', productId);
            } else {
              return { success: false, error: 'Product ID is required and no product is currently displayed' };
            }
          }
          
          // Extract quantity (optional)
          if (parameters?.quantity !== undefined) {
            quantity = typeof parameters.quantity === 'string' 
              ? parseInt(parameters.quantity, 10) 
              : parameters.quantity;
          }
          
          // Validate inputs
          if (isNaN(productId)) {
            return { success: false, error: 'Invalid product ID format' };
          }
          
          if (isNaN(quantity) || quantity < 1) {
            quantity = 1; // Default to 1 if invalid
          }
          
          // Find the product in our data
          const product = watches.find((watch: any) => watch.id === productId);
          
          if (!product) {
            return { 
              success: false, 
              error: `Product with ID ${productId} not found. Available products: ${watches.map((w: any) => w.id).join(', ')}` 
            };
          }
          
          console.log('✅ Found product:', product.name);
          
          // Trigger add to cart animation
          setAddToCartAnimation(true);
          setTimeout(() => setAddToCartAnimation(false), 1500);
          
          // Add to cart multiple times if quantity > 1
          for (let i = 0; i < quantity; i++) {
            addItem(product);
          }
          
          // Show success toast with animation
          toast.success(
            `Added ${quantity}x ${product.name} to your collection! 👑`,
            {
              icon: '🛒',
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                color: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f59e0b',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              },
            }
          );
          
          // Auto-open cart after a short delay
          setTimeout(() => {
            openCart();
          }, 800);
          
          return {
            success: true,
            message: `Successfully added ${quantity}x ${product.name} to cart`,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: quantity
            }
          };
          
        } catch (error) {
          console.error('❌ Error in addProductToCart:', error);
          return { success: false, error: `Failed to add product to cart: ${error}` };
        }
      }
    }
  });

  useEffect(() => {
    if (envApiKey && envApiKey.startsWith('sk_')) {
      setCurrentApiKey(envApiKey);
      setShowApiKeyInput(false);
    } else {
      setShowApiKeyInput(true);
    }
  }, [envApiKey]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputApiKey.trim() && inputApiKey.startsWith('sk_')) {
      setCurrentApiKey(inputApiKey.trim());
      setShowApiKeyInput(false);
      setError(null);
    } else {
      setError('Please enter a valid ElevenLabs API key (starts with "sk_")');
    }
  };

  const startConversation = useCallback(async () => {
    if (!currentApiKey || !currentApiKey.startsWith('sk_')) {
      setError('Please provide a valid API key');
      return;
    }

    try {
      setError(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: agentId,
      });

      setConversationStarted(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation. Please check your microphone permissions and ensure the agent is accessible.');
    }
  }, [conversation, agentId, currentApiKey]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setConversationStarted(false);
  }, [conversation]);

  const resetApiKey = () => {
    setCurrentApiKey('');
    setInputApiKey('');
    setShowApiKeyInput(true);
    setConversationStarted(false);
    setError(null);
    if (conversation.status === 'connected') {
      conversation.endSession();
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleAddToCart = () => {
    if (currentProduct?.displayData) {
      setAddToCartAnimation(true);
      setTimeout(() => setAddToCartAnimation(false), 1500);
      
      addItem(currentProduct.displayData);
      toast.success(`Added ${currentProduct.displayData.name} to your collection of dreams!`, {
        icon: '👑',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #f59e0b',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
      });
      
      // Auto-open cart after a short delay
      setTimeout(() => {
        openCart();
      }, 800);
    }
  };

  // API Key Input Screen
  if (showApiKeyInput) {
    return (
      <div className="h-full flex flex-col">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Key className="w-5 h-5" />
              </div>
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Connect API Key</h3>
              <p className="text-amber-100 text-xs">Enter your ElevenLabs API key</p>
            </div>
          </div>
        </div>

        {/* Compact API Key Input Form */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-amber-500 opacity-20 blur-xl rounded-full"></div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">Ready to Chat?</h4>
                <p className="text-slate-600 text-xs">
                  Connect your ElevenLabs API key to start chatting
                </p>
              </div>
            </div>

            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="sk_..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-10 transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-700 text-xs">{error}</p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!inputApiKey.trim() || !inputApiKey.startsWith('sk_')}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
              >
                <Play className="w-4 h-4" />
                <span>Start Conversation</span>
              </button>
            </form>

            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h5 className="text-amber-600 font-semibold text-xs flex items-center space-x-2">
                <Sparkles className="w-3 h-3" />
                <span>How to get your API key</span>
              </h5>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">elevenlabs.io</a></li>
                <li>Navigate to your profile settings</li>
                <li>Find and copy your API key (starts with "sk_")</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !conversationStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-white">
        <div className="text-center max-w-md space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Connection Failed</h3>
            <p className="text-slate-600">{error}</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetApiKey}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              Try Different API Key
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-5 h-5" />
              </div>
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Brolex AI Concierge</h3>
              <p className="text-amber-100 text-xs">
                {conversation.status === 'connected' ? 'Connected and ready' : 
                 conversation.status === 'connecting' ? 'Connecting...' : 'Ready to connect'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                conversation.status === 'connected' ? 'bg-green-400' : 
                conversation.status === 'connecting' ? 'bg-yellow-400' : 'bg-slate-400'
              } ${conversation.status === 'connecting' ? 'animate-pulse' : ''}`}></div>
              <span className="text-xs capitalize">{conversation.status}</span>
            </div>
            
            <button
              onClick={resetApiKey}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Change API Key"
            >
              <Key className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Reduced height and centered */}
      <div className="flex-1 flex bg-gradient-to-br from-slate-50 to-white min-h-0">
        {/* Left Side - Agent Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {conversation.status === 'connecting' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center">
                <ThreeJSAnimation 
                  isConnecting={true}
                  size={180}
                />
              </div>
              <Loader2 className="w-6 h-6 text-amber-600 animate-spin mx-auto" />
              <p className="text-slate-700 font-medium text-sm">Connecting...</p>
            </div>
          )}

          {conversation.status === 'disconnected' && !conversationStarted && (
            <div className="space-y-6 max-w-md text-center">
              {/* Three.js circular animation - centered */}
              <div className="relative flex items-center justify-center">
                <ThreeJSAnimation 
                  isConnecting={false}
                  isListening={false}
                  isSpeaking={false}
                  size={200}
                />
                
                {/* Overlay button - centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={startConversation}
                    className="bg-white/90 backdrop-blur-sm text-slate-600 font-medium py-2 px-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-slate-200 text-sm"
                  >
                    Talk to interrupt
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-slate-900">Welcome to Brolex Concierge</h4>
                <p className="text-slate-600 text-sm">
                  Your personal luxury timepiece consultant is ready to help you find the perfect watch.
                </p>
              </div>
            </div>
          )}

          {conversation.status === 'connected' && (
            <div className="space-y-6 w-full max-w-md text-center">
              {/* Three.js listening/speaking animation - centered */}
              <div className="relative flex items-center justify-center">
                <ThreeJSAnimation 
                  isListening={!conversation.isSpeaking}
                  isSpeaking={conversation.isSpeaking}
                  isConnecting={false}
                  size={200}
                />
                
                {/* Status overlay - centered */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm text-slate-600 font-medium py-1 px-3 rounded-full shadow-lg border border-slate-200 text-sm">
                    {conversation.isSpeaking ? 'AI Speaking...' : 'Listening...'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-600 text-sm">
                  {conversation.isSpeaking 
                    ? 'The AI concierge is providing luxury advice'
                    : 'Speak naturally about your timepiece needs'
                  }
                </p>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={stopConversation}
                  disabled={conversation.status !== 'connected'}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium text-sm"
                >
                  <Square className="w-4 h-4" />
                  <span>End Conversation</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Product Display with Smooth Animation */}
        <AnimatePresence mode="wait">
          {currentProduct && currentProduct.displayData && (
            <motion.div
              key={currentProduct.productId}
              initial={{ x: '100%', opacity: 0, scale: 0.95 }}
              animate={{ 
                x: 0, 
                opacity: 1, 
                scale: 1,
                transition: {
                  type: 'spring',
                  damping: 30,
                  stiffness: 300,
                  mass: 0.8,
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4, delay: 0.1 }
                }
              }}
              exit={{ 
                x: '100%', 
                opacity: 0, 
                scale: 0.95,
                transition: {
                  type: 'spring',
                  damping: 25,
                  stiffness: 200,
                  duration: 0.3
                }
              }}
              className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-xl"
            >
              {/* Product Header */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.2, duration: 0.3 }
                }}
                className="bg-gradient-to-r from-slate-800 to-slate-900 p-3 text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm">Recommended</span>
                  </div>
                  <button
                    onClick={() => onRemoveProduct?.(currentProduct.productId)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>

              {/* Product Content */}
              <div className="flex-1 p-4 space-y-4">
                {/* Product Image */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: { delay: 0.3, duration: 0.4, type: 'spring', damping: 20 }
                  }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-slate-100"
                >
                  <Image
                    src={currentProduct.displayData.image}
                    alt={currentProduct.displayData.name}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                </motion.div>

                {/* Product Info */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    transition: { delay: 0.4, duration: 0.3 }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-playfair">
                      {currentProduct.displayData.name}
                    </h3>
                    <p className="text-amber-600 text-xs italic mt-1">
                      {currentProduct.displayData.tagline}
                    </p>
                  </div>

                  <div className="text-xl font-bold text-slate-900 font-playfair">
                    {formatPrice(currentProduct.displayData.price)}
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {currentProduct.displayData.description}
                  </p>

                  {/* Features */}
                  {currentProduct.displayData.features && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 text-xs">Features:</h4>
                      <ul className="space-y-1">
                        {currentProduct.displayData.features.slice(0, 3).map((feature, index) => (
                          <motion.li 
                            key={index}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ 
                              x: 0, 
                              opacity: 1,
                              transition: { delay: 0.5 + index * 0.1, duration: 0.3 }
                            }}
                            className="text-xs text-slate-600 flex items-start space-x-2"
                          >
                            <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Add to Cart Button with Enhanced Animation */}
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.3 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`w-full font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 text-sm relative overflow-hidden ${
                    addToCartAnimation 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-105' 
                      : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white'
                  }`}
                >
                  {/* Enhanced Animation overlay */}
                  <AnimatePresence>
                    {addToCartAnimation && (
                      <>
                        {/* Ripple effect */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0.8 }}
                          animate={{ scale: 4, opacity: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="absolute inset-0 bg-green-400 rounded-lg"
                        />
                        
                        {/* Success checkmark */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0, rotate: -180 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center rounded-lg"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-white font-bold"
                          >
                            ✓
                          </motion.div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                  
                  {/* Button content */}
                  <motion.div
                    animate={{ 
                      opacity: addToCartAnimation ? 0 : 1,
                      scale: addToCartAnimation ? 0.8 : 1
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Collection</span>
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ElevenLabsAgent;