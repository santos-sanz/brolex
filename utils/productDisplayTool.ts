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

  // Handler for product display tool events
  const handleProductDisplay = (productData: { productId: number | string }) => {
    const productId = typeof productData.productId === 'string' 
      ? parseInt(productData.productId, 10) 
      : productData.productId;
    
    // Find the product in our data
    const productDetails = watches.find(watch => watch.id === productId);
    
    if (productDetails) {
      // If the product is already in the list, don't add it again
      setRecommendedProducts(prev => {
        if (!prev.some(p => p.productId === productId)) {
          return [...prev, { productId, displayData: productDetails }];
        }
        return prev;
      });
      console.log('Product displayed:', productDetails.name);
    } else {
      console.warn(`Product with ID ${productId} not found`);
      // Still add it to the list but with null data
      setRecommendedProducts(prev => {
        if (!prev.some(p => p.productId === productId)) {
          return [...prev, { productId, displayData: null }];
        }
        return prev;
      });
    }
  };

  // Remove a product from the display
  const removeProduct = (productId: number) => {
    setRecommendedProducts(prev => prev.filter(p => p.productId !== productId));
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