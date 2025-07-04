import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, Crown } from 'lucide-react';
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
    <div className="space-y-4">
      {products.map((product) => (
        product.displayData ? (
          <motion.div 
            key={product.productId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-white via-slate-50 to-white rounded-xl border border-slate-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <button
              onClick={() => onRemove(product.productId)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white shadow-lg"
              aria-label="Remove product"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
            
            {/* Premium Badge */}
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                <Crown className="w-3 h-3" />
                <span>AI PICK</span>
              </div>
            </div>
            
            {/* Image Section */}
            <div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
              <Image
                src={product.displayData.image}
                alt={product.displayData.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
            
            {/* Content Section */}
            <div className="p-4">
              <div className="mb-3">
                <h4 className="font-bold text-lg text-slate-900 mb-2 font-playfair line-clamp-2">
                  {product.displayData.name}
                </h4>
                <p className="text-sm text-amber-600 italic mb-2 leading-relaxed line-clamp-2">
                  {product.displayData.tagline}
                </p>
                
                {/* Description - Truncated for sidebar */}
                {product.displayData.description && (
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-3">
                    {product.displayData.description}
                  </p>
                )}
                
                {/* Features - Limited for sidebar */}
                {product.displayData.features && product.displayData.features.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                      Key Features
                    </h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {product.displayData.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-amber-500 mr-2">•</span>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                      {product.displayData.features.length > 2 && (
                        <li className="text-slate-400 text-xs">
                          +{product.displayData.features.length - 2} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-3">
                <div>
                  <span className="text-xl font-bold text-slate-900 font-playfair">
                    {formatPrice(product.displayData.price)}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Free shipping to your dreams ✨
                  </p>
                </div>
                
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Collection
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <div key={product.productId} className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-center justify-center">
            <p className="text-sm text-slate-500">Product not found</p>
          </div>
        )
      ))}
    </div>
  );
};

export default RecommendedProducts;