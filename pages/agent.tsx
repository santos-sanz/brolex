import Head from 'next/head';
import Layout from '../components/Layout';
import ElevenLabsAgent from '../components/ElevenLabsAgent';
import { useState, useEffect } from 'react';
import { Crown, Sparkles, Star, Mic, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Agent() {
  const [apiKey, setApiKey] = useState<string>('');
  
  // Using the provided Agent ID
  const AGENT_ID = 'agent_01jybb45c6fcwapkfyh35etnqa';
  
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
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
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
            
            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Luxury Expertise</h3>
                <p className="text-sm text-slate-300">Get recommendations based on your lifestyle and questionable taste in timepieces.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Creative Excuses</h3>
                <p className="text-sm text-slate-300">Learn the art of being fashionably late with style and sophistication.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Voice Interaction</h3>
                <p className="text-sm text-slate-300">Speak naturally with our AI for a premium consultation experience.</p>
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
              />
            </motion.div>
            
            {/* Testing Notice */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Testing the AI Agent</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    If you don't have environment variables configured, you can enter your ElevenLabs API key directly in the interface above to test the agent functionality.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <h5 className="text-xs font-semibold text-amber-900 mb-2">Sample Questions to Ask:</h5>
                    <ul className="text-xs text-amber-800 space-y-1">
                      <li>• "What watch would you recommend for someone who's always late?"</li>
                      <li>• "Tell me about the Subwrecker's water resistance."</li>
                      <li>• "What's the best excuse for being 30 minutes late?"</li>
                      <li>• "How does the Dayfaker's confidence display work?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
            
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