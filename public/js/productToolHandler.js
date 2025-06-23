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
    name: "showProduct",
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
    }
  };

  // Register the tool with the widget
  if (typeof widget.registerAgentTool === 'function') {
    widget.registerAgentTool(productTool);
    console.log("Product tool registered successfully with ElevenLabs widget");
  } else {
    console.warn("registerAgentTool method not found on ElevenLabs widget");
  }

  // When the agent calls the tool, a custom event will be dispatched
  // This event will be captured by the React component in productDisplayTool.ts
  widget.addEventListener('tool-call', (event) => {
    if (event.detail?.name === 'showProduct') {
      const data = event.detail?.parameters || {};
      
      // Create and dispatch a custom event that our React hook will listen for
      const toolEvent = new CustomEvent('elivedemo:tool-request', {
        detail: {
          tools: {
            showProduct: data
          }
        }
      });
      
      window.dispatchEvent(toolEvent);
      console.log('Product display tool called:', data);
      
      // Return success to the agent
      return { status: 'success' };
    }
  });
}
