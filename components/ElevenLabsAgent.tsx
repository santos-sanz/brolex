'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState, useEffect } from 'react';
import { Mic, Loader2, AlertCircle, Crown, Sparkles, Key, Eye, EyeOff, Play, Square, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeJSAnimation from './ThreeJSAnimation';
import type { RecommendedProduct } from '../utils/productDisplayTool';

interface ElevenLabsError extends Error {
  code?: number;
  message: string;
}

interface ElevenLabsAgentProps {
  agentId: string;
  apiKey: string;
  onShowProductCard?: (parameters: { productId: number | string; name?: string; price?: string; image?: string; description?: string }) => void;
  currentProduct?: RecommendedProduct | null;
  onRemoveProduct?: (productId: number) => void;
}

const ElevenLabsAgent: React.FC<ElevenLabsAgentProps> = ({ 
  agentId, 
  apiKey: envApiKey, 
  onShowProductCard,
  currentProduct,
  onRemoveProduct
}) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState(envApiKey);
  const [error, setError] = useState<string | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs agent');
      setConversationStarted(false);
    },
    onMessage: (message) => {
      console.log('Agent message:', message);
    },
    onError: (error: unknown) => {
      console.error('ElevenLabs agent error:', error);
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

  // API Key Input Screen
  if (showApiKeyInput) {
    return (
      <div className="h-full min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Key className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Connect Your API Key</h3>
              <p className="text-amber-100 text-sm">Enter your ElevenLabs API key to start chatting</p>
            </div>
          </div>
        </div>

        {/* API Key Input Form */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <Key className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-amber-500 opacity-20 blur-2xl rounded-full"></div>
              </div>
              
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Ready to Chat?</h4>
                <p className="text-slate-600 text-sm">
                  Connect your ElevenLabs API key to start a voice conversation with our luxury timepiece consultant.
                </p>
              </div>
            </div>

            <form onSubmit={handleApiKeySubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="sk_..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!inputApiKey.trim() || !inputApiKey.startsWith('sk_')}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Conversation</span>
              </button>
            </form>

            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <h5 className="text-amber-600 font-semibold text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>How to get your API key</span>
              </h5>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                <li>Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">elevenlabs.io</a> and create an account</li>
                <li>Navigate to your profile settings</li>
                <li>Find and copy your API key (starts with "sk_")</li>
                <li>Paste it above to start chatting</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !conversationStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-red-50 to-white">
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
    <div className="h-full min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Brolex AI Concierge</h3>
              <p className="text-amber-100 text-sm">
                {conversation.status === 'connected' ? 'Connected and ready' : 
                 conversation.status === 'connecting' ? 'Connecting...' : 'Ready to connect'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                conversation.status === 'connected' ? 'bg-green-400' : 
                conversation.status === 'connecting' ? 'bg-yellow-400' : 'bg-slate-400'
              } ${conversation.status === 'connecting' ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm capitalize">{conversation.status}</span>
            </div>
            
            <button
              onClick={resetApiKey}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Change API Key"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex bg-gradient-to-br from-slate-50 to-white">
        {/* Left Side - Agent Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {conversation.status === 'connecting' && (
            <div className="space-y-6 text-center">
              <ThreeJSAnimation 
                isConnecting={true}
                size={200}
              />
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-slate-700 font-medium">Connecting to your luxury AI concierge...</p>
            </div>
          )}

          {conversation.status === 'disconnected' && !conversationStarted && (
            <div className="space-y-8 max-w-lg text-center">
              {/* Three.js ElevenLabs-style animation */}
              <div className="relative">
                <ThreeJSAnimation 
                  isConnecting={false}
                  isListening={false}
                  isSpeaking={false}
                  size={240}
                />
                
                {/* Overlay button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={startConversation}
                    className="bg-white/90 backdrop-blur-sm text-slate-600 font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-slate-200"
                  >
                    Talk to interrupt
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-slate-900">Welcome to Brolex Concierge</h4>
                <p className="text-slate-600">
                  Your personal luxury timepiece consultant is ready to help you find the perfect watch that almost tells time.
                </p>
              </div>
              
              <div className="text-center text-sm text-slate-500">
                <p>In-development calls are 50% off.</p>
                <a href="#" className="text-amber-600 hover:underline">Learn more.</a>
              </div>
            </div>
          )}

          {conversation.status === 'connected' && (
            <div className="space-y-8 w-full max-w-md text-center">
              {/* Three.js listening/speaking animation */}
              <div className="relative">
                <ThreeJSAnimation 
                  isListening={!conversation.isSpeaking}
                  isSpeaking={conversation.isSpeaking}
                  isConnecting={false}
                  size={240}
                />
                
                {/* Status overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm text-slate-600 font-medium py-1 px-4 rounded-full shadow-lg border border-slate-200">
                    {conversation.isSpeaking ? 'AI Speaking...' : 'Listening...'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
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
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                >
                  <Square className="w-5 h-5" />
                  <span>End Conversation</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Product Display */}
        <AnimatePresence>
          {currentProduct && currentProduct.displayData && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-white border-l border-slate-200 flex flex-col"
            >
              {/* Product Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="font-semibold">Recommended</span>
                  </div>
                  <button
                    onClick={() => onRemoveProduct?.(currentProduct.productId)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Content */}
              <div className="flex-1 p-6 space-y-6">
                {/* Product Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={currentProduct.displayData.image}
                    alt={currentProduct.displayData.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-playfair">
                      {currentProduct.displayData.name}
                    </h3>
                    <p className="text-amber-600 text-sm italic mt-1">
                      {currentProduct.displayData.tagline}
                    </p>
                  </div>

                  <div className="text-2xl font-bold text-slate-900 font-playfair">
                    {formatPrice(currentProduct.displayData.price)}
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {currentProduct.displayData.description}
                  </p>

                  {/* Features */}
                  {currentProduct.displayData.features && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 text-sm">Features:</h4>
                      <ul className="space-y-1">
                        {currentProduct.displayData.features.map((feature, index) => (
                          <li key={index} className="text-xs text-slate-600 flex items-start space-x-2">
                            <div className="w-1 h-1 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Collection</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-xs text-slate-500">
          Powered by ElevenLabs • Luxury advice not guaranteed to be accurate
        </p>
      </div>
    </div>
  );
};

export default ElevenLabsAgent;