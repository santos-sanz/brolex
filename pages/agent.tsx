import Head from 'next/head';
import Layout from '../components/Layout';
import ElevenLabsAgent from '../components/ElevenLabsAgent';
import RecommendedProducts from '../components/RecommendedProducts';
import { useState, useEffect } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductDisplayTool } from '../utils/productDisplayTool';

export default function Agent() {
  const [apiKey, setApiKey] = useState<string>('');
  
  // Using the EXACT agent ID you specified
  const AGENT_ID = 'agent_01jybb45c6fcwapkfyh35etnqa';
  
  // Initialize product display tool
  const { 
    recommendedProducts, 
    handleProductDisplay,
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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="relative">
                <Crown className="w-12 h-12 text-amber-500 mr-3 transform -rotate-12" />
                <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-amber-500" />
                <div className="absolute inset-0 bg-amber-500 opacity-20 blur-xl rounded-full"></div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-white font-playfair">
                  AI Concierge
                </h1>
                <p className="text-amber-400 text-sm mt-1">
                  *Luxury advice with a grain of salt
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-12">
                Your personal luxury timepiece consultant, powered by artificial intelligence and questionable expertise.
              </p>
            </motion.div>
            
            {/* Debug info to verify agent ID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700 max-w-md mx-auto">
                <p className="text-slate-300 text-sm">
                  <span className="text-amber-400 font-medium">Agent ID:</span> {AGENT_ID}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Connecting to your luxury timepiece consultant
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Agent Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white">
          <div className="max-w-4xl mx-auto">
            {/* Agent Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <ElevenLabsAgent 
                agentId={AGENT_ID} 
                apiKey={apiKey}
                onShowProductCard={handleProductDisplay}
              />
            </motion.div>
            
            {/* Product Recommendations */}
            <RecommendedProducts 
              products={recommendedProducts}
              onRemove={removeProduct}
              onClearAll={clearProducts}
            />
            
            {/* Disclaimer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                This AI concierge is for entertainment purposes. Actual timekeeping accuracy not guaranteed. 
                Side effects may include sudden urges to check your phone for the real time and an inexplicable 
                desire to explain why being late is actually fashionable.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
}