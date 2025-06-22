import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ElevenLabsAgent from '../components/ElevenLabsAgent';

export default function Agent() {
  const [apiKey, setApiKey] = useState<string>('');
  
  // Using the Anti-Sales Agent ID from MCP
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
        <title>Brolex | AI Assistant</title>
        <meta name="description" content="Talk to our luxury watch assistant" />
      </Head>

      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Brolex AI Assistant</h1>
            <p className="text-muted-foreground">
              Ask questions about our luxury watches or get personalized recommendations
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            <div className="p-4 bg-muted font-medium border-b border-border">
              Anti-Sales Agent
            </div>
            <div className="h-[600px]">
              <ElevenLabsAgent 
                agentId={AGENT_ID} 
                apiKey={apiKey} 
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}