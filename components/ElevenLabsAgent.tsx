import { useEffect, useState, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ElevenLabsAgentProps {
  agentId: string;
  apiKey: string;
}

// Define script sources to try, in order of preference
const SCRIPT_SOURCES = [
  'https://agent.elevenlabs.io/agent.js',
  'https://elevenlabs-agent.vercel.app/agent.js', // Proxy fallback (example, you'd need to set this up)
];

const ElevenLabsAgent: React.FC<ElevenLabsAgentProps> = ({ agentId, apiKey }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const scriptAttempts = useRef<number>(0);

  useEffect(() => {
    // Validate API key format
    if (!apiKey) {
      setError(isDevelopment 
        ? 'ElevenLabs API key is not configured. Please add NEXT_PUBLIC_ELEVENLABS_API_KEY to your .env file.'
        : 'Unable to load voice assistant. Please try again later.');
      setIsLoading(false);
      return;
    }

    if (!apiKey.startsWith('sk_')) {
      setError(isDevelopment
        ? 'Invalid ElevenLabs API key format. API key should start with "sk_".'
        : 'Unable to load voice assistant. Please try again later.');
      setIsLoading(false);
      return;
    }

    // Create a container for the agent
    const agentContainer = document.createElement('div');
    agentContainer.id = 'elevenlabs-agent-container';
    agentContainer.style.width = '100%';
    agentContainer.style.height = '100%';
    agentContainer.style.minHeight = '400px';

    // Clear any previous content and append the container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(agentContainer);
    }

    // Initialize ElevenLabs Agent
    try {
      // Create a function to attempt loading the script from different sources
      const attemptScriptLoad = (sourceIndex: number = 0) => {
        if (sourceIndex >= SCRIPT_SOURCES.length) {
          if (isDevelopment) {
            console.error('[ElevenLabs Agent] All script sources failed to load');
          }
          setError(isDevelopment
            ? 'Failed to load ElevenLabs agent script from all available sources. Check network connection and agent configuration.'
            : 'Unable to load voice assistant. Please try again later.');
          setIsLoading(false);
          return;
        }

        scriptAttempts.current = sourceIndex;
        const script = document.createElement('script');
        script.src = SCRIPT_SOURCES[sourceIndex];
        script.async = true;
        script.setAttribute('data-agent-id', agentId);
        script.setAttribute('data-api-key', apiKey);
        
        // For localhost development, add origin hint to help with allow list
        if (isDevelopment) {
          script.setAttribute('data-origin-hint', window.location.origin);
        }

      // Handle script loading timeout
      const timeout = setTimeout(() => {
        if (isDevelopment) {
          console.error('[ElevenLabs Agent] Script loading timed out after 10 seconds');
        }
        setError(isDevelopment
          ? 'Script loading timed out. Please check your internet connection and try again.'
          : 'Unable to load voice assistant. Please try again later.');
        setIsLoading(false);
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        if (isDevelopment) {
          console.log('[ElevenLabs Agent] Script loaded successfully');
        }

        // Verify agent is properly initialized
        setTimeout(() => {
          const agentWidget = document.getElementById('elevenlabs-agent-widget');
          if (!agentWidget || agentWidget.children.length === 0) {
            if (isDevelopment) {
              console.error('[ElevenLabs Agent] Failed to initialize agent widget');
            }
            setError(isDevelopment
              ? 'ElevenLabs agent failed to initialize. Please verify your Agent ID and API key are correct.'
              : 'Unable to load voice assistant. Please try again later.');
          }
          setIsLoading(false);
        }, 2000);
      };

      script.onerror = (event) => {
        clearTimeout(timeout);
        
        if (isDevelopment) {
          console.group('%c[ElevenLabs Agent] Script Loading Failed', 'color: #ff4d4f; font-weight: bold;');
          console.error('Event:', event);
          console.error('Agent ID:', agentId);
          console.error('API Key configured:', !!apiKey);
          console.error('Script Source:', script.src);
          console.error('Attempt:', scriptAttempts.current + 1, 'of', SCRIPT_SOURCES.length);
          console.groupEnd();
        }
        
        // Try the next source
        attemptScriptLoad(scriptAttempts.current + 1);
      };

      document.head.appendChild(script);
      };
      
      // Start the loading process with the first source
      attemptScriptLoad();
    } catch (err) {
      if (isDevelopment) {
        console.error('[ElevenLabs Agent] Initialization error:', err);
      }
      setError(isDevelopment
        ? `Error initializing ElevenLabs agent: ${err instanceof Error ? err.message : 'Unknown error'}`
        : 'Unable to load voice assistant. Please try again later.');
      setIsLoading(false);
    }

    // Cleanup when component unmounts
    return () => {
      // Remove any ElevenLabs script tags from any source
      SCRIPT_SOURCES.forEach(src => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          existingScript.remove();
        }
      });
      
      const agentWidget = document.getElementById('elevenlabs-agent-widget');
      if (agentWidget) {
        agentWidget.remove();
      }
    };
  }, [agentId, apiKey, isDevelopment]);

  return (
    <div className="relative min-h-[400px] w-full">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p>Loading voice assistant...</p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-sm p-6">
          <AlertCircle className="h-8 w-8 mb-4 text-destructive" />
          <p className="text-center mb-4">{error}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a 
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center"
            >
              Return to Home
            </a>
            {isDevelopment && (
              <button 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // Reset and try loading again
                  scriptAttempts.current = 0;
                  setTimeout(() => window.location.reload(), 500);
                }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
};

export default ElevenLabsAgent;
