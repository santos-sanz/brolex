import { useState } from 'react';
import productsJson from '../data/products.json';

// Type definitions
export interface Watch {
  id: number;
  name: string;
  tagline: string;
  price: number;
  image: string;
  description: string;
  features: string[];
}

export interface RecommendedProduct {
  productId: number;
  displayData: Watch | null;
}

// ElevenLabs product display tool
export function useProductDisplayTool() {
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const watches: Watch[] = productsJson as Watch[];

  // Handler for product display tool events - now shows only one product at a time
  const handleProductDisplay = (productData: { productId: number | string; name?: string; price?: string; image?: string; description?: string }) => {
    console.log('🎯 handleProductDisplay called with:', productData);
    
    const productId = typeof productData.productId === 'string' 
      ? parseInt(productData.productId, 10) 
      : productData.productId;
    
    console.log('🎯 Looking for product with ID:', productId);
    console.log('🎯 Available products:', watches.map(w => ({ id: w.id, name: w.name })));
    
    // Find the product in our data
    const productDetails = watches.find(watch => watch.id === productId);
    
    if (productDetails) {
      console.log('✅ Product found:', productDetails.name);
      
      // Replace the current product (show only one at a time)
      setRecommendedProducts([{ productId, displayData: productDetails }]);
    } else {
      console.warn(`❌ Product with ID ${productId} not found in data`);
      console.log('Available product IDs:', watches.map(w => w.id));
      
      // Still add it to show the error
      setRecommendedProducts([{ productId, displayData: null }]);
    }
  };

  // Remove a product from the display
  const removeProduct = (productId: number) => {
    setRecommendedProducts([]);
  };

  // Clear all displayed products
  const clearProducts = () => {
    setRecommendedProducts([]);
  };

  return {
    recommendedProducts,
    handleProductDisplay,
    removeProduct,
    clearProducts
  };
}