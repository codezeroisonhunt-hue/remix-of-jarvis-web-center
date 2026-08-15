
import React from "react";
import { Message, LanguageOption } from "@/types/chat";
import { Card } from "@/components/ui/card";

interface ChatLayoutProps {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isTyping: boolean;
  currentTypingText: string;
  isProcessing: boolean;
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  audioPlaying: boolean;
  volume: number;
  onVolumeChange: (values: number[]) => void;
  stopSpeaking: () => void;
  toggleMute: () => void;
  isListening: boolean;
  activeAssistant: string;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
  handleSendMessage: () => void;
  getSuggestions: () => string[];
  hackerMode?: boolean;
  toggleListening: () => void;
  detectedEmotion?: string;
  detectedObjects?: Array<{ class: string; confidence: number }>;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages,
  input,
  setInput,
  isTyping,
  currentTypingText,
  isProcessing,
  selectedLanguage,
  onLanguageChange,
  audioPlaying,
  volume,
  onVolumeChange,
  stopSpeaking,
  toggleMute,
  isListening,
  activeAssistant,
  inputMode,
  setInputMode,
  handleSendMessage,
  getSuggestions,
  hackerMode = false,
  toggleListening,
  detectedEmotion,
  detectedObjects
}) => {
  // For demo purposes, we'll just log the emotion
  React.useEffect(() => {
    if (detectedEmotion) {
      console.log("Detected emotion in ChatLayout:", detectedEmotion);
    }
    
    if (detectedObjects && detectedObjects.length > 0) {
      console.log("Detected objects in ChatLayout:", detectedObjects);
    }
  }, [detectedEmotion, detectedObjects]);

  // Simple placeholder for visualization
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Messages list */}
        {messages.map(message => (
          <div key={message.id} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
            <Card className={`inline-block p-3 max-w-[80%] text-white ${
              message.role === 'user' ? 
                hackerMode ? 'bg-transparent border-red-500/30' : 'bg-transparent border-[#33c3f0]/30' :
                hackerMode ? 'bg-transparent border-red-500/30' : 'bg-transparent border-[#33c3f0]/30'
            }`}>
              <p>{message.content}</p>
            </Card>
          </div>
        ))}
        
        {isTyping && (
          <div className="mb-4">
            <Card className={`inline-block p-3 max-w-[80%] text-white ${
              hackerMode ? 'bg-transparent border-red-500/30' : 'bg-transparent border-[#33c3f0]/30'
            }`}>
              <p>{currentTypingText}</p>
            </Card>
          </div>
        )}
        
        {detectedEmotion && (
          <div className="mb-4 text-center">
            <Card className="inline-block p-2 bg-transparent border-jarvis/30 text-white">
              <p className="text-sm">{detectedEmotion}</p>
            </Card>
          </div>
        )}
        
        {detectedObjects && detectedObjects.length > 0 && (
          <div className="mb-4 text-center">
            <Card className="inline-block p-2 bg-transparent border-green-500/30 text-white">
              <p className="text-sm">
                Objects: {detectedObjects.slice(0, 5).map(obj => obj.class).join(', ')}
                {detectedObjects.length > 5 ? '...' : ''}
              </p>
            </Card>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type a message..."}
            className="flex-1 bg-black/40 border border-gray-700 rounded-l px-4 py-2 text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className={`px-4 py-2 rounded-r ${
              hackerMode ? 'bg-red-600 hover:bg-red-700' : 'bg-[#33c3f0] hover:bg-[#33c3f0]/80'
            } text-white`}
            disabled={isProcessing}
          >
            Send
          </button>
        </div>
        
        {/* Voice control */}
        <div className="mt-2 flex justify-between items-center">
          <button
            onClick={toggleListening}
            className={`px-4 py-1 rounded ${
              isListening ?
                (hackerMode ? 'bg-red-600 text-white' : 'bg-green-600 text-white') :
                'bg-gray-700 text-gray-300'
            }`}
          >
            {isListening ? 'Listening...' : 'Start Listening'}
          </button>
          
          <div className="text-sm text-gray-400">
            {isProcessing ? 'Processing...' : audioPlaying ? 'Speaking...' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
