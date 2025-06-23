'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, AlertCircle, Crown, Sparkles, Key, Eye, EyeOff, Play, Square } from 'lucide-react';

interface ElevenLabsAgentProps {
  agentId: string;
  apiKey: string;
}

const ElevenLabsAgent: React.FC<ElevenLabsAgentProps> = ({ agentId, apiKey: envApiKey }) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState(envApiKey);
  const [error, setError] = useState<string | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs agent');
      setConversationStarted(false);
    },
    onMessage: (message) => {
      console.log('Agent message:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs agent error:', error);
      setError('Failed to connect to the AI agent. Please check your API key and try again.');
    },
  });

  useEffect(() => {
    // Check if we have an API key from environment or user input
    if (envApiKey && envApiKey.startsWith('sk_')) {
      setCurrentApiKey(envApiKey);
      setShowApiKeyInput(false);
    } else {
      setShowApiKeyInput(true);
    }
  }, [envApiKey]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputApiKey.trim() && inputApiKey.startsWith('sk_')) {
      setCurrentApiKey(inputApiKey.trim());
      setShowApiKeyInput(false);
      setError(null);
    } else {
      setError('Please enter a valid ElevenLabs API key (starts with "sk_")');
    }
  };

  const startConversation = useCallback(async () => {
    if (!currentApiKey || !currentApiKey.startsWith('sk_')) {
      setError('Please provide a valid API key');
      return;
    }

    try {
      setError(null);
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: agentId,
        authorization: currentApiKey,
      });

      setConversationStarted(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation. Please check your microphone permissions and API key.');
    }
  }, [conversation, agentId, currentApiKey]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setConversationStarted(false);
  }, [conversation]);

  const resetApiKey = () => {
    setCurrentApiKey('');
    setInputApiKey('');
    setShowApiKeyInput(true);
    setConversationStarted(false);
    setError(null);
    if (conversation.status === 'connected') {
      conversation.endSession();
    }
  };

  // API Key Input Screen
  if (showApiKeyInput) {
    return (
      <div className="h-full min-h-[600px] bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Key className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Connect Your API Key</h3>
              <p className="text-amber-100 text-sm">Enter your ElevenLabs API key to start chatting</p>
            </div>
          </div>
        </div>

        {/* API Key Input Form */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <Key className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-amber-500 opacity-20 blur-2xl rounded-full"></div>
              </div>
              
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">
                  Ready to Chat?
                </h4>
                <p className="text-slate-600 text-sm">
                  Connect your ElevenLabs API key to start a voice conversation with our luxury timepiece consultant.
                </p>
              </div>
            </div>

            <form onSubmit={handleApiKeySubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="sk_..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!inputApiKey.trim() || !inputApiKey.startsWith('sk_')}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Conversation</span>
              </button>
            </form>

            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <h5 className="text-amber-600 font-semibold text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>How to get your API key</span>
              </h5>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                <li>Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">elevenlabs.io</a> and create an account</li>
                <li>Navigate to your profile settings</li>
                <li>Find and copy your API key (starts with "sk_")</li>
                <li>Paste it above to start chatting</li>
              </ol>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-xs text-amber-700">
                  🔒 Your API key is only used for this session and is never stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !conversationStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-200">
        <div className="text-center max-w-md space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Connection Failed</h3>
            <p className="text-slate-600">{error}</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetApiKey}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              Try Different API Key
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[600px] bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Brolex AI Concierge</h3>
              <p className="text-amber-100 text-sm">
                {conversation.status === 'connected' ? 'Connected and ready' : 
                 conversation.status === 'connecting' ? 'Connecting...' : 'Ready to connect'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                conversation.status === 'connected' ? 'bg-green-400' : 
                conversation.status === 'connecting' ? 'bg-yellow-400' : 'bg-slate-400'
              } ${conversation.status === 'connecting' ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm capitalize">{conversation.status}</span>
            </div>
            
            <button
              onClick={resetApiKey}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Change API Key"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        {conversation.status === 'connecting' && (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Crown className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-amber-500 opacity-20 blur-2xl rounded-full animate-pulse"></div>
            </div>
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
            <p className="text-slate-700 font-medium">Connecting to your luxury AI concierge...</p>
          </div>
        )}

        {conversation.status === 'disconnected' && !conversationStarted && (
          <div className="space-y-8 max-w-lg">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-amber-500 opacity-20 blur-2xl rounded-full"></div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-slate-900">
                Welcome to Brolex Concierge
              </h4>
              <p className="text-slate-600">
                Your personal luxury timepiece consultant is ready to help you find the perfect watch that almost tells time.
              </p>
              
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h5 className="text-amber-600 font-semibold mb-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Ask me about</span>
                </h5>
                <ul className="text-sm text-slate-600 space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>Watch recommendations for your lifestyle</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>Luxury timepiece "features"</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>Creative excuses for being late</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>Our questionable warranty policies</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={startConversation}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start Voice Conversation</span>
            </button>
          </div>
        )}

        {conversation.status === 'connected' && (
          <div className="space-y-8 w-full max-w-md">
            <div className="relative">
              <div className={`w-32 h-32 rounded-2xl flex items-center justify-center mx-auto shadow-2xl transition-all duration-500 ${
                conversation.isSpeaking 
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-600'
              }`}>
                {conversation.isSpeaking ? (
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 bg-white rounded-full animate-pulse"
                        style={{ 
                          height: `${20 + Math.sin(Date.now() / 200 + i) * 15}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <Mic className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="absolute inset-0 bg-amber-500 opacity-20 blur-2xl rounded-full"></div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-slate-900">
                {conversation.isSpeaking ? 'AI Speaking...' : 'Listening...'}
              </h4>
              <p className="text-slate-600 text-sm">
                {conversation.isSpeaking 
                  ? 'The AI concierge is providing luxury advice'
                  : 'Speak naturally about your timepiece needs'
                }
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={stopConversation}
                disabled={conversation.status !== 'connected'}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
              >
                <Square className="w-5 h-5" />
                <span>End Conversation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-xs text-slate-500">
          Powered by ElevenLabs • Luxury advice not guaranteed to be accurate
        </p>
      </div>
    </div>
  );
};

export default ElevenLabsAgent;