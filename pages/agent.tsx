import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Crown, Bot, Loader2 } from 'lucide-react';

export default function Agent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if environment variables are available
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID || 'agent_01jybb45c6fcwapkfyh35etnqa';
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || 'sk_891e7ca9e5f9a7b1bc844c0ec12d0f7555739dae3ee91b9c';

    if (!agentId || !apiKey) {
      setError('Missing ElevenLabs configuration');
      setIsLoading(false);
      return;
    }

    // Load ElevenLabs Agent script
    const script = document.createElement('script');
    script.src = 'https://agent.elevenlabs.io/agent.js';
    script.setAttribute('data-agent-id', agentId);
    script.setAttribute('data-api-key', apiKey);
    
    script.onload = () => {
      console.log('ElevenLabs script loaded successfully');
      setIsLoading(false);
    };
    
    script.onerror = () => {
      console.error('Failed to load ElevenLabs script');
      setError('Failed to load AI agent');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://agent.elevenlabs.io/agent.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Brolex AI Concierge</title>
        <meta 
          name="description" 
          content="Chat with our AI concierge about Brolex luxury watches." 
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
        {/* Minimal Header */}
        <header className="py-6 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Link>
            
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-amber-600 transform -rotate-12" />
              <span className="text-xl font-bold text-slate-900 font-playfair">Brolex</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2 font-playfair">
                AI Concierge
              </h1>
              <p className="text-slate-600">
                Your personal luxury timepiece consultant
              </p>
            </div>

            {/* ElevenLabs Agent Container */}
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[500px]">
              {isLoading && (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading AI Concierge...</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <Bot className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">Unable to load AI agent</p>
                    <p className="text-sm text-slate-500">{error}</p>
                    <p className="text-xs text-slate-400 mt-4">
                      Please check your environment configuration
                    </p>
                  </div>
                </div>
              )}
              
              <div id="elevenlabs-agent-widget" className="w-full h-full min-h-[400px]">
                {/* ElevenLabs agent will be embedded here */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}