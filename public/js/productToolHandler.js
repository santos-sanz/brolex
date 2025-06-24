// Initialize the ElevenLabs Tool for product recommendations
window.addEventListener('DOMContentLoaded', () => {
  // Wait for the ElevenLabs widget to load
  const checkForWidget = setInterval(() => {
    const widget = document.querySelector('elevenlabs-convai');
    if (widget) {
      clearInterval(checkForWidget);
      initializeProductTool(widget);
    }
  }, 1000);
});

function initializeProductTool(widget) {
  // Define the tool
  const productTool = {
    name: "showProductCard",
    description: "Displays a specific product on the screen",
    parameters: {
      type: "object",
      properties: {
        productId: {
          type: "number",
          description: "The ID of the product to display"
        }
      },
      required: ["productId"]
    },
    // Add a handler function that returns a Promise
    handler: async (params) => {
      console.log('Product tool handler called with params:', params);
      
      // Create and dispatch a custom event that our React hook will listen for
      const toolEvent = new CustomEvent('elivedemo:tool-request', {
        detail: {
          tools: {
            showProductCard: params
          }
        }
      });
      
      window.dispatchEvent(toolEvent);
      
      // Resolve the promise with a success response
      return { status: 'success', message: 'Product displayed successfully' };
    }
  };

  // Register the tool with the widget
  if (typeof widget.registerClientTool === 'function') {
    widget.registerClientTool(productTool);
    console.log("Product tool registered successfully with ElevenLabs widget as client tool");
  } else if (typeof widget.registerAgentTool === 'function') {
    widget.registerAgentTool(productTool);
    console.log("Product tool registered successfully with ElevenLabs widget as agent tool");
  } else {
    console.warn("No tool registration method found on ElevenLabs widget");
  }

  // Also listen for tool-call events for backwards compatibility
  widget.addEventListener('tool-call', (event) => {
    if (event.detail?.name === 'showProductCard') {
      const data = event.detail?.parameters || {};
      
      // Create and dispatch a custom event that our React hook will listen for
      const toolEvent = new CustomEvent('elivedemo:tool-request', {
        detail: {
          tools: {
            showProductCard: data
          }
        }
      });
      
      window.dispatchEvent(toolEvent);
      console.log('Product display tool called via event:', data);
      
      // Return success to the agent
      return { status: 'success' };
    }
  });
}