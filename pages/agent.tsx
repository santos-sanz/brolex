import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Crown, Sparkles } from 'lucide-react';
import ElevenLabsAgent from '../components/ElevenLabsAgent';

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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
        {/* Minimal Header */}
        <header className="py-6 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Collection</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Crown className="w-6 h-6 text-amber-600 transform -rotate-12" />
                <div className="absolute inset-0 bg-amber-600 opacity-20 blur-lg rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-slate-900 font-playfair">Brolex</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Crown className="w-12 h-12 text-amber-600 mr-3 transform -rotate-12" />
                  <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-amber-500" />
                  <div className="absolute inset-0 bg-amber-600 opacity-20 blur-xl rounded-full"></div>
                </div>
                <div className="text-left">
                  <h1 className="text-5xl font-bold text-slate-900 font-playfair">
                    AI Concierge
                  </h1>
                  <p className="text-amber-600 text-sm mt-1">
                    *Luxury advice with a grain of salt
                  </p>
                </div>
              </div>
              
              <p className="text-slate-600 text-xl max-w-2xl mx-auto mb-8">
                Your personal luxury timepiece consultant, powered by artificial intelligence and questionable expertise.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Luxury Expertise</h3>
                  <p className="text-sm text-slate-600">Get recommendations based on your lifestyle and questionable taste in timepieces.</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Creative Excuses</h3>
                  <p className="text-sm text-slate-600">Learn the art of being fashionably late with style and sophistication.</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowLeft className="w-6 h-6 text-white transform rotate-45" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Voice Interaction</h3>
                  <p className="text-sm text-slate-600">Speak naturally with our AI for a premium consultation experience.</p>
                </div>
              </div>
            </div>

            {/* Agent Container */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <ElevenLabsAgent 
                agentId={AGENT_ID} 
                apiKey={apiKey} 
              />
            </div>
            
            {/* Testing Notice */}
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Testing the AI Agent</h4>
                  <p className="text-sm text-amber-800">
                    If you don't have environment variables configured, you can enter your ElevenLabs API key directly in the interface above to test the agent functionality.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                This AI concierge is for entertainment purposes. Actual timekeeping accuracy not guaranteed. 
                Side effects may include sudden urges to check your phone for the real time and an inexplicable 
                desire to explain why being late is actually fashionable.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}