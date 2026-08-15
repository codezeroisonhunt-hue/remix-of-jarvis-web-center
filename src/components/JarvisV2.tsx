
import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import AIFace from './AIFace';
import { avatarService, AvatarExpression } from '@/services/avatarService';
import { intelligenceCore, IntelligenceType } from '@/services/intelligenceCoreService';
import { missionEngine } from '@/services/missionEngineService';
import { useGhostAI } from '@/hooks/useGhostAI';

interface JarvisV2Props {
  initialMode?: 'normal' | 'hacker' | 'ghost';
  className?: string;
}

const JarvisV2: React.FC<JarvisV2Props> = ({ 
  initialMode = 'normal',
  className
}) => {
  const [mode, setMode] = useState<'normal' | 'hacker' | 'ghost'>(initialMode);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expression, setExpression] = useState<AvatarExpression>('neutral');
  const [query, setQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState('');
  
  // Initialize ghost AI
  const ghostAI = useGhostAI({ autoActivate: mode === 'ghost', logLevel: 'minimal' });
  
  // Input reference for focus
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Message history
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    type?: IntelligenceType;
    timestamp: Date;
  }>>([]);
  
  // Activate avatar service when component mounts
  useEffect(() => {
    avatarService.activate();
    
    // Use ghost mode if that's the initial mode
    if (initialMode === 'ghost') {
      ghostAI.activate();
    }
    
    return () => {
      avatarService.deactivate();
      if (ghostAI.state.isActive) {
        ghostAI.deactivate();
      }
    };
  }, [initialMode, ghostAI]);
  
  // Handle mode changes
  useEffect(() => {
    if (mode === 'ghost' && !ghostAI.state.isActive) {
      ghostAI.activate();
      setExpression('suspicious');
      toast("Ghost Mode Activated", {
        description: "Entering stealth operations. All activities will be logged silently.",
      });
    } else if (mode !== 'ghost' && ghostAI.state.isActive) {
      ghostAI.deactivate();
    }
    
    // Set appropriate expression for each mode
    switch (mode) {
      case 'normal':
        setExpression('neutral');
        break;
      case 'hacker':
        setExpression('suspicious');
        break;
      case 'ghost':
        setExpression('thinking');
        break;
    }
  }, [mode, ghostAI]);
  
  // Handle sending a query to Jarvis
  const handleSendQuery = async () => {
    if (!query.trim() || processing) return;
    
    const userQuery = query.trim();
    setQuery('');
    setProcessing(true);
    
    // Determine intelligence type based on content and mode
    let intelligenceType: IntelligenceType = 'personal';
    
    if (mode === 'hacker') {
      intelligenceType = 'recon'; 
    } else if (mode === 'ghost') {
      intelligenceType = 'ghost';
    } else if (userQuery.toLowerCase().includes('scan') || 
      userQuery.toLowerCase().includes('analyze') ||
      userQuery.toLowerCase().includes('check security')) {
      intelligenceType = 'recon';
    }
    
    // Add user message to history
    const userMessageId = `user-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: userMessageId,
      content: userQuery,
      role: 'user',
      timestamp: new Date()
    }]);
    
    // Set thinking expression
    setExpression('thinking');
    
    try {
      // Process with the appropriate intelligence
      const result = await intelligenceCore.processRequest({
        type: intelligenceType,
        prompt: userQuery
      });
      
      // Add assistant response to messages
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        content: result.content,
        role: 'assistant',
        type: result.type,
        timestamp: new Date()
      }]);
      
      setResponse(result.content);
      
      // Speak the response
      setIsSpeaking(true);
      
      // Set appropriate expression based on response content
      const detectedExpression = await avatarService.detectEmotion(result.content);
      setExpression(detectedExpression);
      
      // Simulate speaking
      await avatarService.speak(result.content, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          setExpression('neutral');
        }
      });
      
    } catch (error) {
      console.error('Error processing query:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: 'I apologize, but I encountered an error processing your request.',
        role: 'assistant',
        timestamp: new Date()
      }]);
      
      setExpression('sad');
      
      toast("Processing Error", {
        description: "Failed to process your request.",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Handle keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };
  
  // Toggle between modes
  const handleToggleMode = () => {
    setMode(current => {
      if (current === 'normal') return 'hacker';
      if (current === 'hacker') return 'ghost';
      return 'normal';
    });
  };
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between p-4 bg-black/40 border-b border-jarvis/20">
        <h2 className="text-xl font-semibold text-jarvis">
          {mode === 'normal' && 'JARVIS V2'}
          {mode === 'hacker' && 'CODE ZERO'}
          {mode === 'ghost' && 'GHOST AI'}
        </h2>
        <button
          onClick={handleToggleMode}
          className="px-3 py-1 text-sm rounded-full bg-jarvis/10 text-jarvis border border-jarvis/30 hover:bg-jarvis/20"
        >
          {mode === 'normal' && 'Switch to Hacker Mode'}
          {mode === 'hacker' && 'Switch to Ghost Mode'}
          {mode === 'ghost' && 'Switch to Normal Mode'}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left panel - AI Face */}
        <div className="p-4 md:w-1/3 flex flex-col items-center justify-center bg-black/20">
          <AIFace 
            expression={expression} 
            speaking={isSpeaking} 
            size="lg" 
            style={mode === 'normal' ? 'tech' : mode === 'hacker' ? 'hacker' : 'ghost'} 
          />
          
          <div className="mt-4 text-sm text-center">
            {isSpeaking ? (
              <div className="text-jarvis">Speaking...</div>
            ) : processing ? (
              <div className="text-jarvis">Processing...</div>
            ) : (
              <div className="text-gray-400">Ready for instructions</div>
            )}
          </div>
          
          {/* Status indicators */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="text-xs bg-jarvis/10 text-jarvis px-3 py-1 rounded-full flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${mode === 'ghost' ? 'bg-red-400' : 'bg-jarvis'}`}></div>
              {mode === 'ghost' ? 'Silent Mode' : 'System Active'}
            </div>
            <div className="text-xs bg-jarvis/10 text-jarvis px-3 py-1 rounded-full flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${processing ? 'bg-jarvis animate-pulse' : 'bg-gray-400'}`}></div>
              {processing ? 'Processing' : 'Idle'}
            </div>
          </div>
        </div>
        
        {/* Right panel - Chat */}
        <div className="flex-1 flex flex-col bg-black/30 p-4">
          {/* Messages container */}
          <div className="flex-1 overflow-auto mb-4 p-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <p>No conversation history yet.</p>
                <p className="mt-2">How can I assist you today?</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-jarvis/20 text-white' 
                          : message.type === 'ghost'
                            ? 'bg-black/40 text-gray-300 border border-gray-700'
                            : message.type === 'recon'
                              ? 'bg-red-900/20 text-white border border-red-900/30'
                              : 'bg-jarvis/10 text-white'
                      }`}
                    >
                      {message.content}
                      {message.type && message.role === 'assistant' && (
                        <div className="mt-1 text-xs opacity-50">
                          {message.type.charAt(0).toUpperCase() + message.type.slice(1)} AI
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {processing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] px-4 py-2 rounded-lg bg-jarvis/5 text-white">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-jarvis/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                mode === 'normal' 
                  ? "Type a message..." 
                  : mode === 'hacker' 
                    ? "Enter command..." 
                    : "Silent query..."
              }
              className={`w-full px-4 py-3 bg-black/40 rounded-lg border ${
                mode === 'normal' 
                  ? 'border-jarvis/30 focus:border-jarvis/60' 
                  : mode === 'hacker'
                    ? 'border-red-500/30 focus:border-red-500/60 text-red-400'
                    : 'border-gray-700 focus:border-gray-500 text-gray-400'
              } focus:outline-none`}
              disabled={processing}
            />
            <button
              onClick={handleSendQuery}
              disabled={processing || !query.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 rounded-md ${
                mode === 'normal'
                  ? 'bg-jarvis/20 text-jarvis hover:bg-jarvis/30'
                  : mode === 'hacker'
                    ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisV2;
