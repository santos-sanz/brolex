import { useState, useEffect } from 'react';
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

  // Function to add a tool listener to the ElevenLabs widget
  const initializeProductTool = () => {
    if (typeof window !== 'undefined') {
      // Wait for the ElevenLabs widget to load
      const checkForWidget = setInterval(() => {
        const widget = document.querySelector('elevenlabs-convai');
        if (widget) {
          clearInterval(checkForWidget);
          
          // Add event listener for the custom tool events from ElevenLabs
          window.addEventListener('elivedemo:tool-request', (event: any) => {
            if (event.detail?.tools?.showProduct) {
              handleProductDisplay(event.detail.tools.showProduct);
            }
          });
          
          console.log('Product display tool initialized');
        }
      }, 1000);
      
      return () => {
        clearInterval(checkForWidget);
        window.removeEventListener('elivedemo:tool-request', () => {});
      };
    }
  };

  // Handler for product display tool events
  const handleProductDisplay = (productData: { productId: number | string }) => {
    const productId = typeof productData.productId === 'string' 
      ? parseInt(productData.productId, 10) 
      : productData.productId;
    
    // Find the product in our data
    const productDetails = watches.find(watch => watch.id === productId);
    
    if (productDetails) {
      // If the product is already in the list, don't add it again
      if (!recommendedProducts.some(p => p.productId === productId)) {
        setRecommendedProducts(prev => [
          ...prev, 
          { productId, displayData: productDetails }
        ]);
      }
      console.log('Product displayed:', productDetails.name);
    } else {
      console.warn(`Product with ID ${productId} not found`);
      // Still add it to the list but with null data
      setRecommendedProducts(prev => [
        ...prev, 
        { productId, displayData: null }
      ]);
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
    initializeProductTool,
    removeProduct,
    clearProducts
  };
}
