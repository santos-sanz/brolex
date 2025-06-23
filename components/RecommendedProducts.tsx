import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, X, Tag } from 'lucide-react';
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
      className="mt-8 bg-white rounded-xl border border-amber-100 overflow-hidden shadow-md"
    >
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="w-4 h-4 text-white mr-2" />
            <h3 className="text-white font-semibold">Recommended Products</h3>
          </div>
          <button 
            onClick={onClearAll}
            className="text-amber-100 hover:text-white transition-colors text-xs"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          product.displayData ? (
            <motion.div 
              key={product.productId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <button
                onClick={() => onRemove(product.productId)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Remove product"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
              
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                <Image
                  src={product.displayData.image}
                  alt={product.displayData.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="p-3">
                <h4 className="font-bold text-slate-900">{product.displayData.name}</h4>
                <p className="text-xs text-amber-600 italic mb-2">{product.displayData.tagline}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {formatPrice(product.displayData.price)}
                  </span>
                  <Link href="/" className="inline-flex items-center justify-center rounded-full bg-amber-500 p-1 text-white hover:bg-amber-600 transition-colors">
                    <ShoppingCart className="h-3 w-3" />
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
    </motion.div>
  );
};

export default RecommendedProducts;
