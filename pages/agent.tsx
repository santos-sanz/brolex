import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Crown, Bot } from 'lucide-react';

export default function Agent() {
  useEffect(() => {
    // Load ElevenLabs Agent script
    const script = document.createElement('script');
    script.src = 'https://agent.elevenlabs.io/agent.js';
    script.setAttribute('data-agent-id', process.env.NEXT_PUBLIC_AGENT_ID || 'YOUR_AGENT_ID');
    script.setAttribute('data-api-key', process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || 'YOUR_API_KEY');
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
        <title>Brolex AI Concierge – Luxury Customer Service</title>
        <meta 
          name="description" 
          content="Chat with our AI concierge about Brolex luxury watches. Get personalized recommendations that almost make sense." 
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Questionable Luxury
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <Crown className="w-10 h-10 text-amber-600 mr-3 transform -rotate-12" />
                  <Bot className="w-10 h-10 text-gray-700" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                  Brolex Concierge (AI)
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  Your personal luxury timepiece consultant
                </p>
                <p className="text-sm text-gray-500">
                  Powered by artificial intelligence, guaranteed to be artificially intelligent
                </p>
              </div>

              {/* ElevenLabs Agent will be embedded here */}
              <div className="mb-8">
                <div id="elevenlabs-agent-widget" className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-2xl">
                  <div className="text-center p-8">
                    <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      AI Concierge is initializing...
                    </p>
                    <p className="text-sm text-gray-500">
                      Please ensure your environment variables are configured
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-amber-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Ask me about:</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Which Brolex suits your lifestyle (or lack thereof)</li>
                    <li>• The deep philosophy behind our questionable timekeeping</li>
                    <li>• Why our watches are priced in the realm of fantasy</li>
                    <li>• Technical specifications that definitely exist</li>
                  </ul>
                </div>
                
                <p className="text-xs text-gray-500">
                  Disclaimer: AI responses may contain traces of actual intelligence. 
                  Side effects may include sudden urges to check the time on your phone instead.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}