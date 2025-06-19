'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import type { Watch } from '../contexts/CartContext';

interface WatchCardProps {
  watch: Watch;
}

export default function WatchCard({ watch }: WatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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
      className="group bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02] border border-slate-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
          <Crown className="w-3 h-3" />
          <span>LUXURY</span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
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
        
        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110 border border-slate-200"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-200 ${
              isLiked ? 'text-red-500 fill-current' : 'text-slate-600'
            }`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 bg-gradient-to-b from-white to-slate-50">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 font-playfair">
            {watch.name}
          </h3>
          <p className="text-slate-600 text-sm italic leading-relaxed">
            {watch.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-3xl font-bold text-slate-900 font-playfair">
              {formatPrice(watch.price)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-700"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Collection</span>
        </motion.button>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Free shipping to your dreams ✨
          </p>
        </div>
      </div>
    </motion.div>
  );
}