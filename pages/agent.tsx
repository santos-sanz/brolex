import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Crown, Bot, Loader2, AlertCircle } from 'lucide-react';

export default function Agent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if environment variables are available
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      setError('ElevenLabs API credentials are not configured. Please check your environment variables.');
      setIsLoading(false);
      return;
    }

    // Validate API key format (basic check)
    if (!apiKey.startsWith('sk_')) {
      setError('Invalid ElevenLabs API key format. API key should start with "sk_".');
      setIsLoading(false);
      return;
    }

    // Load ElevenLabs Agent script with better error handling
    const script = document.createElement('script');
    script.src = 'https://agent.elevenlabs.io/agent.js';
    script.setAttribute('data-agent-id', agentId);
    script.setAttribute('data-api-key', apiKey);
    script.async = true;
    
    // Add timeout for script loading
    const timeout = setTimeout(() => {
      setError('Script loading timed out. Please check your internet connection and try again.');
      setIsLoading(false);
    }, 10000); // 10 second timeout
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('ElevenLabs script loaded successfully');
      
      // Additional check to ensure the agent is properly initialized
      setTimeout(() => {
        const agentWidget = document.getElementById('elevenlabs-agent-widget');
        if (agentWidget && agentWidget.children.length === 0) {
          setError('ElevenLabs agent failed to initialize. Please verify your Agent ID and API key are correct.');
        }
        setIsLoading(false);
      }, 2000);
    };
    
    script.onerror = (event) => {
      clearTimeout(timeout);
      console.error('Failed to load ElevenLabs script:', event);
      setError('Failed to load ElevenLabs agent. This may be due to invalid credentials or network issues. Please verify your API key and Agent ID.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeout);
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://agent.elevenlabs.io/agent.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Force a re-render to trigger useEffect again
    window.location.reload();
  };

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
                    <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to Load AI Agent</h3>
                    <p className="text-slate-600 mb-4">{error}</p>
                    
                    <div className="bg-slate-50 rounded-lg p-4 mb-4 text-left">
                      <h4 className="font-medium text-slate-900 mb-2">Troubleshooting Steps:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Verify your ElevenLabs API key is valid and active</li>
                        <li>• Check that your Agent ID is correct</li>
                        <li>• Ensure your ElevenLabs account has sufficient credits</li>
                        <li>• Try refreshing the page</li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={handleRetry}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              
              {!isLoading && !error && (
                <div id="elevenlabs-agent-widget" className="w-full h-full min-h-[400px]">
                  {/* ElevenLabs agent will be embedded here */}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}