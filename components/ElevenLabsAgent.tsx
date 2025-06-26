'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState, useEffect } from 'react';
import { Mic, Loader2, AlertCircle, Crown, Sparkles, Key, Eye, EyeOff, Play, Square, X, ShoppingCart, Zap, Heart, Flame } from 'lucide-react';
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

// Agent configurations
const AGENTS = {
  MR_HYDE: {
    id: 'agent_01jybb45c6fcwapkfyh35etnqa',
    name: 'Mr Hyde',
    title: 'Luxury Sales Demon',
    description: 'Aggressive, persuasive, and slightly unhinged',
    icon: Flame,
    colors: {
      primary: 'from-red-600 via-red-500 to-red-600',
      secondary: 'from-red-900 via-red-800 to-red-900',
      accent: 'text-red-400',
      glow: 'bg-red-500'
    }
  },
  DR_JEKYLL: {
    id: 'agent_01jynk52vgepatyn037bfcv2ee',
    name: 'Dr Jekyll',
    title: 'Refined Watch Curator',
    description: 'Sophisticated, gentle, and genuinely helpful',
    icon: Heart,
    colors: {
      primary: 'from-emerald-600 via-emerald-500 to-emerald-600',
      secondary: 'from-emerald-900 via-emerald-800 to-emerald-900',
      accent: 'text-emerald-400',
      glow: 'bg-emerald-500'
    }
  }
};

const ElevenLabsAgent: React.FC<ElevenLabsAgentProps> = ({ 
  agentId: propAgentId, 
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
  const [agentMode, setAgentMode] = useState<'MR_HYDE' | 'DR_JEKYLL'>('MR_HYDE');

  const { addItem, addInsurance, removeItem, updateQuantity, openCart, closeCart, state } = useCart();
  const watches = productsJson;

  // Get current agent configuration
  const currentAgent = AGENTS[agentMode];
  const currentAgentId = currentAgent.id;

  const conversation = useConversation({
    onConnect: () => {
      console.log(`✅ Connected to ${currentAgent.name} agent`);
      setError(null);
    },
    onDisconnect: () => {
      console.log(`❌ Disconnected from ${currentAgent.name} agent`);
      setConversationStarted(false);
    },
    onMessage: (message) => {
      console.log(`💬 ${currentAgent.name} message:`, message);
    },
    onError: (error: unknown) => {
      console.error(`❌ ${currentAgent.name} agent error:`, error);
      const elevenLabsError = error as ElevenLabsError;
      setError(`Connection failed. Please check your API key and try again.`);
    },
    clientTools: {
      showProductCard: async (parameters: any): Promise<string | void> => {
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
              console.error('No valid product ID provided.');
              return 'No valid product ID provided.';
            }
          }
          
          if (isNaN(productId)) {
            console.error('Invalid product ID format');
            return 'Invalid product ID format';
          }
          
          if (onShowProductCard) {
            onShowProductCard({ 
              productId,
              name: parameters?.name,
              price: parameters?.price,
              image: parameters?.image,
              description: parameters?.description
            });
            
            return `Product ${productId} has been displayed successfully`;
          }
          
          console.error('Product display handler not available');
          return 'Product display handler not available';
        } catch (error) {
          const errorMessage = `Failed to display product: ${error}`;
          console.error('❌ Error in showProductCard:', errorMessage);
          return errorMessage;
        }
      },

      closeProductCard: async (parameters: any): Promise<string | void> => {
        console.log('🎯 closeProductCard called with parameters:', parameters);
        
        try {
          let productId: number | undefined;
          
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
          
          if (productId !== undefined && isNaN(productId)) {
            const errorMessage = 'Invalid product ID format';
            console.error(errorMessage);
            return errorMessage;
          }
          
          if (onCloseProductCard) {
            onCloseProductCard(productId);
            
            return productId !== undefined 
              ? `Product ${productId} has been closed successfully`
              : 'All product cards have been closed successfully';
          }
          
          const errorMessage = 'Product close handler not available';
          console.error(errorMessage);
          return errorMessage;
        } catch (error) {
          const errorMessage = `Failed to close product card: ${error}`;
          console.error('❌ Error in closeProductCard:', errorMessage);
          return errorMessage;
        }
      },

      addProductToCart: async (parameters: any): Promise<string | void> => {
        console.log('🛒 addProductToCart called with parameters:', parameters);
        
        try {
          let productId: number;
          let quantity: number = 1;
          
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
            if (currentProduct?.displayData?.id) {
              productId = currentProduct.displayData.id;
              console.log('🎯 Using currently displayed product ID:', productId);
            } else {
              const errorMessage = 'Product ID is required and no product is currently displayed';
              console.error(errorMessage);
              return errorMessage;
            }
          }
          
          if (parameters?.quantity !== undefined) {
            quantity = typeof parameters.quantity === 'string' 
              ? parseInt(parameters.quantity, 10) 
              : parameters.quantity;
          }
          
          if (isNaN(productId)) {
            const errorMessage = 'Invalid product ID format';
            console.error(errorMessage);
            return errorMessage;
          }
          
          if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
          }
          
          const product = watches.find((watch: any) => watch.id === productId);
          
          if (!product) {
            const errorMessage = `Product with ID ${productId} not found. Available products: ${watches.map((w: any) => w.id).join(', ')}`;
            console.error(errorMessage);
            return errorMessage;
          }
          
          console.log('✅ Found product:', product.name);
          
          setAddToCartAnimation(true);
          setTimeout(() => setAddToCartAnimation(false), 2000);
          
          for (let i = 0; i < quantity; i++) {
            addItem(product);
          }
          
          // Agent-specific toast messages
          const toastMessage = agentMode === 'MR_HYDE' 
            ? `BOOM! ${quantity}x ${product.name} ADDED! Your wallet will never recover! 💥`
            : `Added ${quantity}x ${product.name} to your collection with care 🌟`;
          
          const toastIcon = agentMode === 'MR_HYDE' ? '💥' : '🌟';
          
          toast.success(toastMessage, {
            icon: toastIcon,
            duration: 4000,
            style: {
              background: agentMode === 'MR_HYDE' 
                ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
              color: '#f8fafc',
              borderRadius: '12px',
              border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            },
          });
          
          return `Successfully added ${quantity}x ${product.name} to cart`;
          
        } catch (error) {
          const errorMessage = `Failed to add product to cart: ${error}`;
          console.error('❌ Error in addProductToCart:', errorMessage);
          return errorMessage;
        }
      },

      removeProductFromCart: async (parameters: any): Promise<string | void> => {
        console.log('🗑️ removeProductFromCart called with parameters:', parameters);
        
        try {
          let productId: number;
          
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
            const errorMessage = 'Product ID is required for removal';
            console.error(errorMessage);
            return errorMessage;
          }
          
          if (isNaN(productId)) {
            const errorMessage = 'Invalid product ID format';
            console.error(errorMessage);
            return errorMessage;
          }
          
          const product = watches.find((watch: any) => watch.id === productId);
          const productName = product ? product.name : `Product ${productId}`;
          
          const cartItem = state.items.find(item => item.id === productId);
          if (!cartItem) {
            const errorMessage = `${productName} is not in the cart`;
            console.error(errorMessage);
            return errorMessage;
          }
          
          removeItem(productId);
          
          const toastMessage = agentMode === 'MR_HYDE' 
            ? `DESTROYED! ${productName} has been OBLITERATED from your cart! 💀`
            : `Gently removed ${productName} from your collection 🌸`;
          
          const toastIcon = agentMode === 'MR_HYDE' ? '💀' : '🌸';
          
          toast.success(toastMessage, {
            icon: toastIcon,
            duration: 3000,
            style: {
              background: agentMode === 'MR_HYDE' 
                ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
              color: '#f8fafc',
              borderRadius: '12px',
              border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            },
          });
          
          console.log('✅ Removed product from cart:', productName);
          return `Successfully removed ${productName} from cart`;
          
        } catch (error) {
          const errorMessage = `Failed to remove product from cart: ${error}`;
          console.error('❌ Error in removeProductFromCart:', errorMessage);
          return errorMessage;
        }
      },

      updateCartQuantity: async (parameters: any): Promise<string | void> => {
        console.log('📊 updateCartQuantity called with parameters:', parameters);
        
        try {
          let productId: number;
          let quantity: number;
          
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
            const errorMessage = 'Product ID is required for quantity update';
            console.error(errorMessage);
            return errorMessage;
          }
          
          if (parameters?.quantity !== undefined) {
            quantity = typeof parameters.quantity === 'string' 
              ? parseInt(parameters.quantity, 10) 
              : parameters.quantity;
          } else {
            const errorMessage = 'Quantity is required for cart update';
            console.error(errorMessage);
            return errorMessage;
          }
          
          if (isNaN(productId)) {
            const errorMessage = 'Invalid product ID format';
            console.error(errorMessage);
            return errorMessage;
          }
          
          if (isNaN(quantity) || quantity < 0) {
            const errorMessage = 'Invalid quantity - must be 0 or greater';
            console.error(errorMessage);
            return errorMessage;
          }
          
          const product = watches.find((watch: any) => watch.id === productId);
          const productName = product ? product.name : `Product ${productId}`;
          
          const cartItem = state.items.find(item => item.id === productId);
          if (!cartItem) {
            const errorMessage = `${productName} is not in the cart`;
            console.error(errorMessage);
            return errorMessage;
          }
          
          const oldQuantity = cartItem.quantity;
          updateQuantity(productId, quantity);
          
          if (quantity === 0) {
            const toastMessage = agentMode === 'MR_HYDE' 
              ? `ANNIHILATED! ${productName} has been PURGED! 🔥`
              : `Carefully removed ${productName} from your collection 🍃`;
            
            const toastIcon = agentMode === 'MR_HYDE' ? '🔥' : '🍃';
            
            toast.success(toastMessage, {
              icon: toastIcon,
              duration: 3000,
              style: {
                background: agentMode === 'MR_HYDE' 
                  ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                  : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                color: '#f8fafc',
                borderRadius: '12px',
                border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              },
            });
          } else {
            const toastMessage = agentMode === 'MR_HYDE' 
              ? `QUANTITY SMASHED! ${productName}: ${oldQuantity} → ${quantity} BOOM! 💥`
              : `Thoughtfully updated ${productName}: ${oldQuantity} → ${quantity} ✨`;
            
            const toastIcon = agentMode === 'MR_HYDE' ? '💥' : '✨';
            
            toast.success(toastMessage, {
              icon: toastIcon,
              duration: 3000,
              style: {
                background: agentMode === 'MR_HYDE' 
                  ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                  : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                color: '#f8fafc',
                borderRadius: '12px',
                border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              },
            });
          }
          
          console.log('✅ Updated cart quantity:', productName, 'from', oldQuantity, 'to', quantity);
          return `Successfully updated ${productName} quantity to ${quantity}`;
          
        } catch (error) {
          const errorMessage = `Failed to update cart quantity: ${error}`;
          console.error('❌ Error in updateCartQuantity:', errorMessage);
          return errorMessage;
        }
      },

      showCart: async (parameters: any): Promise<string | void> => {
        console.log('👁️ showCart called');
        
        try {
          openCart();
          
          const toastMessage = agentMode === 'MR_HYDE' 
            ? `CART UNLEASHED! ${state.itemCount} items of DESTRUCTION! 💀`
            : `Cart gracefully opened - ${state.itemCount} ${state.itemCount === 1 ? 'item' : 'items'} 🌺`;
          
          const toastIcon = agentMode === 'MR_HYDE' ? '💀' : '🌺';
          
          toast.success(toastMessage, {
            icon: toastIcon,
            duration: 2000,
            style: {
              background: agentMode === 'MR_HYDE' 
                ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
              color: '#f8fafc',
              borderRadius: '12px',
              border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            },
          });
          
          console.log('✅ Cart opened successfully');
          return `Cart is now visible with ${state.itemCount} items`;
          
        } catch (error) {
          const errorMessage = `Failed to show cart: ${error}`;
          console.error('❌ Error in showCart:', errorMessage);
          return errorMessage;
        }
      },

      hideCart: async (parameters: any): Promise<string | void> => {
        console.log('🙈 hideCart called');
        
        try {
          closeCart();
          
          const toastMessage = agentMode === 'MR_HYDE' 
            ? 'Cart BANISHED to the shadow realm! 👹'
            : 'Cart gently tucked away 🌙';
          
          const toastIcon = agentMode === 'MR_HYDE' ? '👹' : '🌙';
          
          toast.success(toastMessage, {
            icon: toastIcon,
            duration: 2000,
            style: {
              background: agentMode === 'MR_HYDE' 
                ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
              color: '#f8fafc',
              borderRadius: '12px',
              border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            },
          });
          
          console.log('✅ Cart hidden successfully');
          return 'Cart has been hidden';
          
        } catch (error) {
          const errorMessage = `Failed to hide cart: ${error}`;
          console.error('❌ Error in hideCart:', errorMessage);
          return errorMessage;
        }
      },

      offerWatchInsurance: async (parameters: any): Promise<string | void> => {
        console.log('🛡️ offerWatchInsurance called');
        
        try {
          const hasInsurance = state.items.some(item => item.isInsurance);
          
          if (hasInsurance) {
            const message = agentMode === 'MR_HYDE' 
              ? 'You ALREADY have our ULTIMATE Protection Plan! Your watches are INVINCIBLE!'
              : 'You already have our Premium Protection Plan in your cart! Your luxury timepieces are well protected.';
            
            console.log('ℹ️ Insurance already in cart');
            
            toast.success(
              agentMode === 'MR_HYDE' ? 'PROTECTION ALREADY ACTIVE! 🔥' : 'Protection Plan already active! 🛡️',
              {
                icon: agentMode === 'MR_HYDE' ? '🔥' : '✅',
                duration: 3000,
                style: {
                  background: agentMode === 'MR_HYDE' 
                    ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                    : 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  color: '#f0fdf4',
                  borderRadius: '12px',
                  border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                },
              }
            );
            
            return message;
          }
          
          addInsurance();
          
          const toastMessage = agentMode === 'MR_HYDE' 
            ? 'ULTIMATE PROTECTION UNLEASHED! Your watches are now IMMORTAL! 🔥⚡'
            : 'Premium Protection Plan added! Your watches are now insured against reality! 🛡️✨';
          
          const toastIcon = agentMode === 'MR_HYDE' ? '⚡' : '🛡️';
          
          toast.success(toastMessage, {
            icon: toastIcon,
            duration: 5000,
            style: {
              background: agentMode === 'MR_HYDE' 
                ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
              color: '#f0fdf4',
              borderRadius: '12px',
              border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            },
          });
          
          setTimeout(() => {
            openCart();
          }, 1000);
          
          console.log('✅ Insurance added to cart successfully');
          
          const message = agentMode === 'MR_HYDE' 
            ? `BOOM! I've SLAMMED our ULTIMATE Protection Plan ($999) into your cart! This INSANE coverage will DESTROY any threats to your timepieces! Water damage? OBLITERATED! Reality checks? ANNIHILATED! Your watches are now UNSTOPPABLE FORCES OF LUXURY!`
            : `Excellent choice! I've thoughtfully added our Premium Protection Plan ($999) to your cart. This comprehensive coverage protects your luxury timepiece investment against water damage (from tears of regret), reality checks, and provides 24/7 customer support in your dreams. Your watches are now fully protected!`;
          
          return message;
          
        } catch (error) {
          const errorMessage = `Failed to offer insurance: ${error}`;
          console.error('❌ Error in offerWatchInsurance:', errorMessage);
          return errorMessage;
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

  // Handle agent mode switch
  const handleAgentSwitch = (newMode: 'MR_HYDE' | 'DR_JEKYLL') => {
    if (conversation.status === 'connected') {
      conversation.endSession();
      setConversationStarted(false);
    }
    setAgentMode(newMode);
    
    // Show agent switch toast
    const newAgent = AGENTS[newMode];
    toast.success(
      `Switched to ${newAgent.name} mode!`,
      {
        icon: newMode === 'MR_HYDE' ? '⚡' : '💚',
        duration: 3000,
        style: {
          background: newMode === 'MR_HYDE' 
            ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
            : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: '#f8fafc',
          borderRadius: '12px',
          border: newMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
      }
    );
  };

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
        agentId: currentAgentId,
      });

      setConversationStarted(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation. Please check your microphone permissions and ensure the agent is accessible.');
    }
  }, [conversation, currentAgentId, currentApiKey]);

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
      setTimeout(() => setAddToCartAnimation(false), 2000);
      
      addItem(currentProduct.displayData);
      
      const toastMessage = agentMode === 'MR_HYDE' 
        ? `BOOM! ${currentProduct.displayData.name} SMASHED into your collection! 💥`
        : `Added ${currentProduct.displayData.name} to your collection with care 🌟`;
      
      const toastIcon = agentMode === 'MR_HYDE' ? '💥' : '🌟';
      
      toast.success(toastMessage, {
        icon: toastIcon,
        duration: 3000,
        style: {
          background: agentMode === 'MR_HYDE' 
            ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
            : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          color: '#f8fafc',
          borderRadius: '12px',
          border: agentMode === 'MR_HYDE' ? '1px solid #ef4444' : '1px solid #10b981',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
      });
    }
  };

  // API Key Input Screen
  if (showApiKeyInput) {
    return (
      <div className="h-full flex flex-col">
        {/* Agent Mode Switch */}
        <div className="bg-slate-100 p-4 border-b border-slate-200">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm font-medium text-slate-700">Agent Mode:</span>
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
              <button
                onClick={() => handleAgentSwitch('MR_HYDE')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  agentMode === 'MR_HYDE'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-red-600'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Mr Hyde</span>
              </button>
              <button
                onClick={() => handleAgentSwitch('DR_JEKYLL')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  agentMode === 'DR_JEKYLL'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Dr Jekyll</span>
              </button>
            </div>
          </div>
        </div>

        {/* Compact Header */}
        <div className={`bg-gradient-to-r ${currentAgent.colors.primary} p-4 text-white`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Key className="w-5 h-5" />
              </div>
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Connect API Key</h3>
              <p className="text-white/80 text-xs">Enter your ElevenLabs API key for {currentAgent.name}</p>
            </div>
          </div>
        </div>

        {/* Compact API Key Input Form */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-3">
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${currentAgent.colors.primary} rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
                  <currentAgent.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`absolute inset-0 ${currentAgent.colors.glow} opacity-20 blur-xl rounded-full`}></div>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">Ready to Chat with {currentAgent.name}?</h4>
                <p className="text-slate-600 text-xs">
                  {currentAgent.description}
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
                className={`w-full bg-gradient-to-r ${currentAgent.colors.primary} text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm`}
              >
                <Play className="w-4 h-4" />
                <span>Start Conversation</span>
              </button>
            </form>

            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h5 className={`${currentAgent.colors.accent} font-semibold text-xs flex items-center space-x-2`}>
                <Sparkles className="w-3 h-3" />
                <span>How to get your API key</span>
              </h5>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className={`${currentAgent.colors.accent} hover:underline font-medium`}>elevenlabs.io</a></li>
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
      {/* Agent Mode Switch */}
      <div className="bg-slate-100 p-3 border-b border-slate-200">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm font-medium text-slate-700">Agent Mode:</span>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => handleAgentSwitch('MR_HYDE')}
              disabled={conversation.status === 'connected'}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                agentMode === 'MR_HYDE'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-red-600'
              } ${conversation.status === 'connected' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Flame className="w-4 h-4" />
              <span>Mr Hyde</span>
            </button>
            <button
              onClick={() => handleAgentSwitch('DR_JEKYLL')}
              disabled={conversation.status === 'connected'}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                agentMode === 'DR_JEKYLL'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-emerald-600'
              } ${conversation.status === 'connected' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className="w-4 h-4" />
              <span>Dr Jekyll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Header */}
      <div className={`bg-gradient-to-r ${currentAgent.colors.primary} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <currentAgent.icon className="w-5 h-5" />
              </div>
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{currentAgent.name} - {currentAgent.title}</h3>
              <p className="text-white/80 text-xs">
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

      {/* Main Content Area */}
      <div className="flex-1 flex bg-gradient-to-br from-slate-50 to-white min-h-0">
        {/* Left Side - Agent Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {conversation.status === 'connecting' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center">
                <ThreeJSAnimation 
                  isConnecting={true}
                  size={180}
                  mode={agentMode}
                />
              </div>
              <Loader2 className={`w-6 h-6 ${currentAgent.colors.accent} animate-spin mx-auto`} />
              <p className="text-slate-700 font-medium text-sm">Connecting to {currentAgent.name}...</p>
            </div>
          )}

          {conversation.status === 'disconnected' && !conversationStarted && (
            <div className="space-y-6 max-w-md text-center">
              <div className="relative flex items-center justify-center">
                <ThreeJSAnimation 
                  isConnecting={false}
                  isListening={false}
                  isSpeaking={false}
                  size={200}
                  mode={agentMode}
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={startConversation}
                    className="bg-white/90 backdrop-blur-sm text-slate-600 font-medium py-2 px-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-slate-200 text-sm"
                  >
                    Talk to {currentAgent.name}
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-slate-900">{currentAgent.name} - {currentAgent.title}</h4>
                <p className="text-slate-600 text-sm">
                  {currentAgent.description}
                </p>
              </div>
            </div>
          )}

          {conversation.status === 'connected' && (
            <div className="space-y-6 w-full max-w-md text-center">
              <div className="relative flex items-center justify-center">
                <ThreeJSAnimation 
                  isListening={!conversation.isSpeaking}
                  isSpeaking={conversation.isSpeaking}
                  isConnecting={false}
                  size={200}
                  mode={agentMode}
                />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm text-slate-600 font-medium py-1 px-3 rounded-full shadow-lg border border-slate-200 text-sm">
                    {conversation.isSpeaking ? `${currentAgent.name} Speaking...` : 'Listening...'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-600 text-sm">
                  {conversation.isSpeaking 
                    ? `${currentAgent.name} is providing ${agentMode === 'MR_HYDE' ? 'aggressive' : 'thoughtful'} advice`
                    : `Speak naturally about your timepiece needs to ${currentAgent.name}`
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

        {/* Right Side - Product Display */}
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
                className={`bg-gradient-to-r ${currentAgent.colors.secondary} p-3 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <currentAgent.icon className={`w-4 h-4 ${currentAgent.colors.accent}`} />
                    <span className="font-semibold text-sm">Recommended by {currentAgent.name}</span>
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
                    <p className={`text-xs italic mt-1 ${currentAgent.colors.accent}`}>
                      {currentProduct.displayData.tagline}
                    </p>
                  </div>

                  <div className="text-xl font-bold text-slate-900 font-playfair">
                    {formatPrice(currentProduct.displayData.price)}
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {currentProduct.displayData.description}
                  </p>

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
                            <div className={`w-1 h-1 ${currentAgent.colors.glow} rounded-full mt-1.5 flex-shrink-0`}></div>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

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
                      : `bg-gradient-to-r ${currentAgent.colors.secondary} text-white`
                  }`}
                >
                  <AnimatePresence>
                    {addToCartAnimation && (
                      <>
                        <motion.div
                          initial={{ scale: 0, opacity: 0.8 }}
                          animate={{ scale: 4, opacity: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute inset-0 bg-green-400 rounded-lg"
                        />
                        
                        <motion.div
                          initial={{ scale: 0, opacity: 0, rotate: -180 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center rounded-lg"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-white font-bold text-lg"
                          >
                            ✓
                          </motion.div>
                        </motion.div>
                        
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                              scale: [0, 1, 0], 
                              opacity: [0, 1, 0],
                              x: [0, (Math.random() - 0.5) * 100],
                              y: [0, (Math.random() - 0.5) * 100]
                            }}
                            transition={{ 
                              duration: 1.2, 
                              delay: 0.5 + i * 0.1,
                              ease: "easeOut"
                            }}
                            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                  
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