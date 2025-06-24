// Product Tool Handler for ElevenLabs Agent
// This script registers the showProductCard client tool with the ElevenLabs widget

(function() {
  'use strict';
  
  console.log('Product Tool Handler: Script loaded');
  
  // Function to register the client tool
  function registerProductTool() {
    // Check if ElevenLabs widget is available
    if (typeof window.ElevenLabsWidget !== 'undefined' && window.ElevenLabsWidget.registerClientTool) {
      console.log('Product Tool Handler: Registering showProductCard tool');
      
      window.ElevenLabsWidget.registerClientTool('showProductCard', function(parameters) {
        console.log('Product Tool Handler: showProductCard called with parameters:', parameters);
        
        try {
          // Extract product information from parameters
          const { productId, name, price, image, description } = parameters;
          
          // Dispatch a custom event to communicate with React components
          const event = new CustomEvent('showProductCard', {
            detail: {
              productId: productId || `product_${Date.now()}`,
              name: name || 'Luxury Timepiece',
              price: price || '$999',
              image: image || '/placeholder-watch.jpg',
              description: description || 'A magnificent timepiece for the discerning individual.'
            }
          });
          
          window.dispatchEvent(event);
          
          console.log('Product Tool Handler: Product card event dispatched');
          
          // Return success response
          return {
            success: true,
            message: `Product "${name}" has been displayed`
          };
          
        } catch (error) {
          console.error('Product Tool Handler: Error in showProductCard:', error);
          return {
            success: false,
            error: error.message
          };
        }
      });
      
      console.log('Product Tool Handler: Tool registration complete');
    } else {
      console.log('Product Tool Handler: ElevenLabs widget not ready, retrying...');
      // Retry after a short delay
      setTimeout(registerProductTool, 500);
    }
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerProductTool);
  } else {
    // DOM is already ready
    registerProductTool();
  }
  
  // Also try to register when the window loads (fallback)
  window.addEventListener('load', registerProductTool);
  
})();