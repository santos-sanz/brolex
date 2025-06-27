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
        <title>Brolex AI – Ask a Watch, Get a Wink</title>
        <meta
          name="description"
          content="Consult our AI for questionable watch advice and impeccable sarcasm."
        />
      </Head>
      
      <Layout>
        {/* Main Agent Section - Extended Height for Product Cards */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Agent Container - Extended height and width for better product card visibility */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 min-h-[700px]">
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