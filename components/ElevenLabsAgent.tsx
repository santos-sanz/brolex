'use client';

import { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, Crown, Sparkles, Key, Eye, EyeOff } from 'lucide-react';

interface ElevenLabsAgentProps {
  agentId: string;
  apiKey: string;
}

declare global {
  interface Window {
    ElevenLabs?: {
      Agent: {
        startSession: (config: any) => Promise<any>;
        endSession: () => void;
      };
    };
  }
}

const ElevenLabsAgent: React.FC<ElevenLabsAgentProps> = ({ agentId, apiKey: envApiKey }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState(envApiKey);
  const agentRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we have an API key from environment or user input
    if (envApiKey && envApiKey.startsWith('sk_')) {
      setCurrentApiKey(envApiKey);
      setShowApiKeyInput(false);
    } else {
      setShowApiKeyInput(true);
      setIsLoading(false);
    }
  }, [envApiKey]);

  useEffect(() => {
    if (!currentApiKey || !currentApiKey.startsWith('sk_')) {
      return;
    }

    const loadElevenLabsScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        if (window.ElevenLabs) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/convai-widget/index.js';
        script.async = true;
        
        script.onload = () => {
          // Wait a bit for the library to initialize
          setTimeout(() => {
            if (window.ElevenLabs) {
              resolve();
            } else {
              reject(new Error('ElevenLabs library not available after script load'));
            }
          }, 1000);
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load ElevenLabs script'));
        };

        document.head.appendChild(script);
      });
    };

    const initializeAgent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await loadElevenLabsScript();
        
        if (!window.ElevenLabs) {
          throw new Error('ElevenLabs library not available');
        }

        // Initialize the agent
        const agent = await window.ElevenLabs.Agent.startSession({
          agentId: agentId,
          apiKey: currentApiKey,
          onConnect: () => {
            console.log('Connected to ElevenLabs agent');
            setIsConnected(true);
            setIsLoading(false);
          },
          onDisconnect: () => {
            console.log('Disconnected from ElevenLabs agent');
            setIsConnected(false);
          },
          onError: (error: any) => {
            console.error('ElevenLabs agent error:', error);
            setError('Failed to connect to the AI agent. Please check your API key and try again.');
            setIsLoading(false);
          },
          onMessage: (message: any) => {
            console.log('Agent message:', message);
          },
          onModeChange: (mode: any) => {
            setIsListening(mode.mode === 'listening');
          }
        });

        agentRef.current = agent;
        
      } catch (err) {
        console.error('Failed to initialize ElevenLabs agent:', err);
        setError('Unable to load the AI agent. Please check your API key and try again.');
        setIsLoading(false);
      }
    };

    initializeAgent();

    return () => {
      if (agentRef.current) {
        try {
          window.ElevenLabs?.Agent.endSession();
        } catch (err) {
          console.error('Error ending session:', err);
        }
      }
    };
  }, [agentId, currentApiKey]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputApiKey.trim() && inputApiKey.startsWith('sk_')) {
      setCurrentApiKey(inputApiKey.trim());
      setShowApiKeyInput(false);
    } else {
      setError('Please enter a valid ElevenLabs API key (starts with "sk_")');
    }
  };

  const startConversation = () => {
    if (agentRef.current && isConnected) {
      setConversationStarted(true);
      // The agent should automatically start listening
    }
  };

  const toggleMute = () => {
    if (agentRef.current) {
      setIsMuted(!isMuted);
      // Implement mute functionality if available in the API
    }
  };

  const resetApiKey = () => {
    setCurrentApiKey('');
    setInputApiKey('');
    setShowApiKeyInput(true);
    setIsConnected(false);
    setConversationStarted(false);
    setError(null);
    if (agentRef.current) {
      try {
        window.ElevenLabs?.Agent.endSession();
      } catch (err) {
        console.error('Error ending session:', err);
      }
    }
  };

  // API Key Input Screen
  if (showApiKeyInput) {
    return (
      <div className="h-full min-h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Key className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-playfair">API Key Required</h3>
              <p className="text-amber-100 text-sm">Enter your ElevenLabs API key to test the agent</p>
            </div>
          </div>
        </div>

        {/* API Key Input Form */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-amber-500 opacity-30 blur-2xl rounded-full"></div>
              </div>
              
              <div>
                <h4 className="text-2xl font-bold text-white font-playfair mb-2">
                  Test the AI Agent
                </h4>
                <p className="text-slate-300 text-sm">
                  Enter your ElevenLabs API key to start a conversation with our luxury timepiece consultant.
                </p>
              </div>
            </div>

            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  placeholder="sk_..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {error && (
                <div className="bg-red-900/50 border border-red-600 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!inputApiKey.trim() || !inputApiKey.startsWith('sk_')}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Key className="w-5 h-5" />
                <span>Connect to Agent</span>
              </button>
            </form>

            <div className="bg-slate-800 rounded-lg p-4 space-y-3">
              <h5 className="text-amber-400 font-semibold text-sm">How to get your API key:</h5>
              <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">elevenlabs.io</a></li>
                <li>Sign up or log in to your account</li>
                <li>Go to your profile settings</li>
                <li>Copy your API key (starts with "sk_")</li>
              </ol>
              <p className="text-xs text-slate-400 mt-2">
                Your API key is only used for this session and is not stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200">
        <div className="relative mb-6">
          <Crown className="w-12 h-12 text-amber-500 animate-pulse" />
          <div className="absolute inset-0 bg-amber-500 opacity-20 blur-xl rounded-full animate-pulse"></div>
        </div>
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Connecting to your luxury AI concierge...</p>
        <p className="text-sm text-slate-500 mt-2">Preparing the finest artificial intelligence</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-200">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection Failed</h3>
        <p className="text-slate-600 text-center max-w-md mb-6">{error}</p>
        
        <div className="flex space-x-3">
          <button
            onClick={resetApiKey}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Different API Key
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-playfair">Brolex AI Concierge</h3>
              <p className="text-amber-100 text-sm">
                {isConnected ? 'Ready to assist' : 'Connecting...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-sm">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
            
            <button
              onClick={resetApiKey}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Change API Key"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        {!conversationStarted ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-amber-500 opacity-30 blur-2xl rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-white font-playfair">
                Welcome to Brolex Concierge
              </h4>
              <p className="text-slate-300 max-w-md mx-auto">
                Your personal luxury timepiece consultant is ready to help you find the perfect watch that almost tells time.
              </p>
              
              <div className="bg-slate-800 rounded-lg p-4 max-w-md mx-auto">
                <h5 className="text-amber-400 font-semibold mb-2">Ask me about:</h5>
                <ul className="text-sm text-slate-300 space-y-1 text-left">
                  <li>• Watch recommendations for your lifestyle</li>
                  <li>• Luxury timepiece "features"</li>
                  <li>• Creative excuses for being late</li>
                  <li>• Our questionable warranty policies</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={startConversation}
              disabled={!isConnected}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Mic className="w-5 h-5" />
              <span>Start Voice Conversation</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 w-full max-w-md">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-br from-green-500 to-green-600 animate-pulse' 
                  : 'bg-gradient-to-br from-amber-500 to-amber-600'
              }`}>
                {isListening ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-8 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-6 bg-white rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-10 bg-white rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-6 bg-white rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-8 bg-white rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <Volume2 className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="absolute inset-0 bg-amber-500 opacity-30 blur-2xl rounded-full"></div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white font-playfair">
                {isListening ? 'Listening...' : 'AI Concierge Active'}
              </h4>
              <p className="text-slate-300 text-sm">
                {isListening 
                  ? 'Speak naturally about your luxury timepiece needs'
                  : 'The AI is processing your request'
                }
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
              
              <button
                onClick={() => setConversationStarted(false)}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
              >
                <MicOff className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 bg-slate-800 p-4 text-center">
        <p className="text-xs text-slate-400">
          Powered by ElevenLabs • Luxury advice not guaranteed to be accurate
        </p>
      </div>

      {/* Hidden container for ElevenLabs widget */}
      <div ref={containerRef} className="hidden" />
    </div>
  );
};

export default ElevenLabsAgent;