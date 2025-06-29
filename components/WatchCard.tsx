'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Crown, Info, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import type { Watch } from '../contexts/CartContext';

interface WatchCardProps {
  watch: Watch;
}

export default function WatchCard({ watch }: WatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(watch);
    toast.success(`Added ${watch.name} to your collection of dreams!`, {
      icon: '👑',
      duration: 3000,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(`Added ${watch.name} to your wishful thinking!`, {
        icon: '💭',
      });
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] border border-slate-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
          <Crown className="w-2 h-2 sm:w-3 sm:h-3" />
          <span>LUXURY</span>
        </div>
      </div>

      {/* Image Container - Responsive Height */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
        <Image
          src={watch.image}
          alt={watch.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Overlay on hover */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
        />
        
        {/* Action buttons overlay */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col space-y-2">
          {/* Like button */}
          <button
            onClick={handleLike}
            className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110 border border-slate-200"
          >
            <Heart 
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                isLiked ? 'text-red-500 fill-current' : 'text-slate-600'
              }`} 
            />
          </button>

          {/* Info toggle button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110 border border-slate-200"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Content - Mobile Responsive Padding */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-slate-50">
        <div className="mb-3 sm:mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-playfair">
            {watch.name}
          </h3>
          <p className="text-slate-600 text-sm italic leading-relaxed mb-3">
            {watch.tagline}
          </p>

          {/* Description - Always visible now */}
          {watch.description && (
            <p className="text-slate-700 text-sm leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {watch.description}
            </p>
          )}

          {/* Features Section - Expandable */}
          <AnimatePresence>
            {watch.features && watch.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: showDetails ? 1 : 0, 
                  height: showDetails ? 'auto' : 0 
                }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-4 bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Premium Features
                  </h4>
                  <ul className="space-y-2">
                    {watch.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-amber-700">
                        <span className="text-amber-500 mr-2 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features preview when collapsed */}
          {!showDetails && watch.features && watch.features.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 italic">
                {watch.features.length} premium features available
                <button 
                  onClick={() => setShowDetails(true)}
                  className="text-amber-600 hover:text-amber-700 ml-1 underline"
                >
                  View details
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-playfair">
              {formatPrice(watch.price)}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              *Price subject to market delusions
            </p>
          </div>
        </div>

        {/* Action Button - Mobile Responsive */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-700 text-sm sm:text-base"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add to Collection</span>
        </motion.button>
        
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs text-slate-500">
            Free shipping to your dreams ✨
          </p>
        </div>

        {/* Product Stats */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Product ID: #{watch.id}</span>
            <span>Luxury Rating: ⭐⭐⭐⭐⭐</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}