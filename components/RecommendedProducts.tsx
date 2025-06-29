import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, Tag, Crown } from 'lucide-react';
import { RecommendedProduct } from '../utils/productDisplayTool';

interface RecommendedProductsProps {
  products: RecommendedProduct[];
  onRemove: (productId: number) => void;
  onClearAll: () => void;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ 
  products, 
  onRemove,
  onClearAll
}) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-amber-100 overflow-hidden shadow-lg"
    >
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3" />
            <h3 className="text-white font-bold text-base sm:text-lg font-playfair">AI Recommended Products</h3>
          </div>
          <button 
            onClick={onClearAll}
            className="text-amber-100 hover:text-white transition-colors text-xs sm:text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {products.map((product) => (
          product.displayData ? (
            <motion.div 
              key={product.productId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <button
                onClick={() => onRemove(product.productId)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white shadow-lg"
                aria-label="Remove product"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
              </button>
              
              {/* Premium Badge */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                  <Crown className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span>AI PICK</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row">
                {/* Image Section - Responsive */}
                <div className="w-full sm:w-48 h-48 relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
                  <Image
                    src={product.displayData.image}
                    alt={product.displayData.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
                
                {/* Content Section - Responsive */}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="mb-3 sm:mb-4">
                    <h4 className="font-bold text-lg sm:text-xl text-slate-900 mb-2 font-playfair">
                      {product.displayData.name}
                    </h4>
                    <p className="text-sm text-amber-600 italic mb-2 sm:mb-3 leading-relaxed">
                      {product.displayData.tagline}
                    </p>
                    
                    {/* Description - Hidden on mobile for space */}
                    {product.displayData.description && (
                      <p className="hidden sm:block text-sm text-slate-600 mb-4 leading-relaxed">
                        {product.displayData.description}
                      </p>
                    )}
                    
                    {/* Features - Simplified on mobile */}
                    {product.displayData.features && product.displayData.features.length > 0 && (
                      <div className="mb-3 sm:mb-4">
                        <h5 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                          Key Features
                        </h5>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {product.displayData.features.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 ? 2 : 3).map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-amber-500 mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 font-playfair">
                        {formatPrice(product.displayData.price)}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Free shipping to your dreams ✨
                      </p>
                    </div>
                    
                    <Link 
                      href="/" 
                      className="inline-flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm w-full sm:w-auto"
                    >
                      <ShoppingCart className="h-3 h-3 sm:h-4 sm:w-4 mr-2" />
                      Add to Collection
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div key={product.productId} className="bg-slate-50 rounded-lg border border-slate-200 p-4 sm:p-6 flex items-center justify-center">
              <p className="text-sm text-slate-500">Product not found</p>
            </div>
          )
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendedProducts;