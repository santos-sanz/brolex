'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { 
  ShoppingCart, 
  Heart, 
  Crown, 
  Star, 
  Shield, 
  Award, 
  Gem, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import type { Watch } from '../contexts/CartContext';

interface WatchCardProps {
  watch: Watch;
}

export default function WatchCard({ watch }: WatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
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
      className="group relative bg-gradient-to-br from-white via-slate-50 to-amber-50/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden transform hover:scale-[1.03] border border-amber-200/50 hover:border-amber-300/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.1), 0 0 30px rgba(212, 175, 55, 0.15)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(212, 175, 55, 0.05)'
      }}
    >
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-transparent to-amber-600"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.1),transparent_50%)]"></div>
      </div>

      {/* Premium Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-xl border border-amber-300">
          <Crown className="w-3 h-3" />
          <span>LUXURY</span>
        </div>
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-xl border border-purple-300">
          <Gem className="w-3 h-3" />
          <span>PREMIUM</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-red-200"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-300 ${
              isLiked ? 'text-red-500 fill-current' : 'text-slate-600'
            }`} 
          />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-amber-200"
        >
          <Shield className="w-5 h-5 text-slate-600" />
        </motion.button>
      </div>

      {/* Image Container with Luxury Frame */}
      <div className="relative h-80 sm:h-96 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-amber-50">
        {/* Luxury Frame Effect */}
        <div className="absolute inset-2 border-2 border-gradient-to-br from-amber-300 via-amber-200 to-amber-300 rounded-2xl opacity-30"></div>
        <div className="absolute inset-4 border border-amber-200 rounded-xl opacity-50"></div>
        
        <Image
          src={watch.image}
          alt={watch.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 p-4"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5" />
        
        {/* Hover Overlay with Shimmer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent"
        />
        
        {/* Shimmer Effect */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />

        {/* Luxury Rating Stars */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
          ))}
          <span className="text-white text-xs font-semibold ml-1">5.0</span>
        </div>
      </div>

      {/* Content Section with Luxury Styling */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white via-slate-50/50 to-amber-50/30">
        {/* Luxury Divider */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full"></div>
        
        <div className="mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 font-playfair bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text">
            {watch.name}
          </h3>
          <p className="text-amber-700 text-base italic leading-relaxed mb-4 font-medium">
            {watch.tagline}
          </p>

          {/* Description with Luxury Styling */}
          {watch.description && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl border border-amber-200/50 shadow-inner">
              <p className="text-slate-700 text-sm leading-relaxed">
                {watch.description}
              </p>
            </div>
          )}
        </div>

        {/* Premium Features Section */}
        {watch.features && watch.features.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-400"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-base">Premium Features ({watch.features.length})</span>
              </div>
              {showFeatures ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {showFeatures && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-5 bg-gradient-to-br from-amber-50 via-white to-purple-50 rounded-xl border border-amber-200 shadow-inner">
                    <div className="grid grid-cols-1 gap-3">
                      {watch.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg border border-amber-100 hover:border-amber-200 transition-colors"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-slate-700 text-sm font-medium leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Price Section with Luxury Styling */}
        <div className="mb-6 p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl text-white shadow-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-bold font-playfair bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                {formatPrice(watch.price)}
              </span>
              <p className="text-slate-400 text-xs mt-1">
                *Price subject to market delusions & cosmic inflation
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-semibold">Certified Luxury</span>
              </div>
              <p className="text-slate-400 text-xs">Investment Grade*</p>
            </div>
          </div>
        </div>

        {/* Luxury Action Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 border border-amber-400 text-lg relative overflow-hidden group"
        >
          {/* Button Shimmer Effect */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
          
          <Crown className="w-6 h-6 relative z-10" />
          <span className="relative z-10">Add to Royal Collection</span>
          <Sparkles className="w-5 h-5 relative z-10" />
        </motion.button>
        
        {/* Luxury Guarantee */}
        <div className="mt-4 text-center space-y-2">
          <p className="text-amber-700 text-sm font-medium">
            ✨ Free shipping to your dreams ✨
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Lifetime Warranty*</span>
            </span>
            <span className="flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Authenticity Guaranteed*</span>
            </span>
          </div>
        </div>

        {/* Product Stats with Luxury Design */}
        <div className="mt-6 pt-5 border-t border-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-xs text-slate-600 font-medium">Product ID: #{watch.id}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-600">Luxury Rating:</span>
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-500 fill-current" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Luxury Certificates */}
          <div className="mt-3 flex justify-center space-x-4 text-xs text-slate-500">
            <span className="bg-amber-50 px-2 py-1 rounded-full border border-amber-200">Swiss Inspired*</span>
            <span className="bg-purple-50 px-2 py-1 rounded-full border border-purple-200">Handcrafted*</span>
            <span className="bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">Limited Edition*</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}