import Head from 'next/head';
import Layout from '../components/Layout';
import ElevenLabsAgent from '../components/ElevenLabsAgent';
import { useState, useEffect } from 'react';
import { useProductDisplayTool } from '../utils/productDisplayTool';

export default function Agent() {
  const [apiKey, setApiKey] = useState<string>('');
  
  // Using the EXACT agent ID you specified
  const AGENT_ID = 'agent_01jybb45c6fcwapkfyh35etnqa';
  
  // Initialize product display tool
  const { 
    recommendedProducts, 
    handleProductDisplay,
    handleCloseProductCard,
    removeProduct, 
    clearProducts 
  } = useProductDisplayTool();
  
  useEffect(() => {
    // Get API key from environment variables
    const envApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (envApiKey) {
      setApiKey(envApiKey);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Brolex AI Concierge – Luxury Watch Assistant</title>
        <meta 
          name="description" 
          content="Chat with our AI concierge about Brolex luxury watches. Get personalized recommendations and creative excuses for being late." 
        />
      </Head>
      
      <Layout>
        {/* Main Agent Section - Compact Height */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Agent Container - Reduced height */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 h-[600px]">
              <ElevenLabsAgent 
                agentId={AGENT_ID} 
                apiKey={apiKey}
                onShowProductCard={handleProductDisplay}
                onCloseProductCard={handleCloseProductCard}
                currentProduct={recommendedProducts[0] || null}
                onRemoveProduct={removeProduct}
              />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}