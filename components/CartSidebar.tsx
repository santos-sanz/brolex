'use client';

import { useCart } from '../contexts/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, Crown, Sparkles, Shield } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CartSidebar() {
  const { state, removeItem, updateQuantity, closeCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCheckout = () => {
    toast.error('Checkout? In this economy? 💸', {
      icon: '🤡',
      duration: 4000,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared! Your wallet thanks you. 🙏', {
      icon: '💰',
    });
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 text-white">
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <ShoppingBag className="w-6 h-6" />
                    <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-playfair">Luxury Cart</h2>
                    <p className="text-amber-100 text-sm">
                      {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full">
              {state.items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <Crown className="w-16 h-16 text-amber-500 mx-auto transform -rotate-12" />
                      <div className="absolute inset-0 bg-amber-500 opacity-20 blur-xl rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 font-playfair">
                      Your Cart Awaits Greatness
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Add some questionable luxury to your collection
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {state.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                          className={`rounded-xl p-4 border transition-colors duration-300 ${
                            item.isInsurance 
                              ? 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 border-emerald-600 hover:border-emerald-500' 
                              : 'bg-slate-800 border-slate-700 hover:border-amber-500'
                          }`}
                        >
                          {/* Insurance Badge */}
                          {item.isInsurance && (
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2 bg-emerald-700 px-3 py-1 rounded-full">
                                <Shield className="w-3 h-3 text-emerald-300" />
                                <span className="text-emerald-100 text-xs font-semibold">PROTECTION PLAN</span>
                              </div>
                              <div className="text-emerald-300 text-xs">
                                ✨ AI Recommended
                              </div>
                            </div>
                          )}
                          
                          <div className="flex space-x-4">
                            <div className={`relative w-16 h-16 rounded-lg overflow-hidden ${
                              item.isInsurance ? 'bg-emerald-700' : 'bg-slate-700'
                            }`}>
                              {item.isInsurance ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Shield className="w-8 h-8 text-emerald-300" />
                                </div>
                              ) : (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white text-sm font-playfair truncate">
                                {item.name}
                              </h4>
                              <p className={`text-xs mt-1 line-clamp-2 ${
                                item.isInsurance ? 'text-emerald-300' : 'text-slate-400'
                              }`}>
                                {item.tagline}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <span className={`font-bold text-sm ${
                                  item.isInsurance ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                  {formatPrice(item.price)}
                                </span>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-2">
                                  {!item.isInsurance && (
                                    <>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors duration-200"
                                      >
                                        <Minus className="w-3 h-3 text-white" />
                                      </button>
                                      
                                      <span className="text-white font-medium text-sm w-8 text-center">
                                        {item.quantity}
                                      </span>
                                      
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors duration-200"
                                      >
                                        <Plus className="w-3 h-3 text-white" />
                                      </button>
                                    </>
                                  )}
                                  
                                  {item.isInsurance && (
                                    <span className="text-emerald-300 font-medium text-sm px-3">
                                      Coverage: 1 Plan
                                    </span>
                                  )}
                                  
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors duration-200 ml-2"
                                  >
                                    <Trash2 className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-700 bg-slate-800 p-6 space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">Subtotal</span>
                      <span className="text-2xl font-bold text-amber-400 font-playfair">
                        {formatPrice(state.total)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-slate-500 text-center">
                      *Prices subject to market delusions and cosmic inflation
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Crown className="w-5 h-5" />
                        <span>Proceed to Fantasy</span>
                      </button>
                      
                      <button
                        onClick={handleClearCart}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-full transition-colors duration-200 text-sm"
                      >
                        Clear Cart
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-slate-500">
                        Free shipping to your dreams ✨
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}