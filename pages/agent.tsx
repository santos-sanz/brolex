import Head from 'next/head';
import Layout from '../components/Layout';
import ElevenLabsAgent from '../components/ElevenLabsAgent';
import { useState, useEffect } from 'react';
import { useProductDisplayTool } from '../utils/productDisplayTool';
import RecommendedProducts from '../components/RecommendedProducts';
import { Sparkles } from 'lucide-react';

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
        {/* Main Agent Section - Side-by-side Layout */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Agent Container - Takes up main space */}
              <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 min-h-[700px]">
                <ElevenLabsAgent 
                  agentId={AGENT_ID} 
                  apiKey={apiKey}
                  onShowProductCard={handleProductDisplay}
                  onCloseProductCard={handleCloseProductCard}
                  currentProduct={recommendedProducts[0] || null}
                  onRemoveProduct={removeProduct}
                />
              </div>

              {/* Product Recommendations Sidebar - Appears to the right */}
              {recommendedProducts.length > 0 && (
                <div className="w-full lg:w-96 xl:w-[28rem]">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 text-white mr-3" />
                          <h3 className="text-white font-bold text-lg font-playfair">AI Recommendations</h3>
                        </div>
                        <button 
                          onClick={clearProducts}
                          className="text-amber-100 hover:text-white transition-colors text-sm font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Product Cards Container */}
                    <div className="max-h-[600px] overflow-y-auto">
                      <div className="p-6">
                        <RecommendedProducts 
                          products={recommendedProducts}
                          onRemove={removeProduct}
                          onClearAll={clearProducts}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}