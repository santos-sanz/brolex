'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart } from 'lucide-react';
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
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={watch.image}
          alt={watch.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 p-8"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-200 ${
              isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
            }`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {watch.name}
          </h3>
          <p className="text-gray-500 text-sm">
            {watch.tagline}
          </p>
        </div>

        {/* Description */}
        {watch.description && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {watch.description}
          </p>
        )}

        {/* Features */}
        {watch.features && watch.features.length > 0 && (
          <div className="mb-6">
            <ul className="space-y-1">
              {watch.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-amber-500 mr-2 mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-semibold text-gray-900">
            {formatPrice(watch.price)}
          </span>
        </div>

        {/* Action Button - Now using primary amber/gold color */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Bag</span>
        </button>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Free delivery
          </p>
        </div>
      </div>
    </motion.div>
  );
}