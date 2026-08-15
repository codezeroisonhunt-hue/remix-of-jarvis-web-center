
import React, { useState } from 'react';
import { useJarvisChat } from '../contexts/JarvisChatProvider';
import ChatDashboardPanel from './chat/ChatDashboardPanel';
import MessageInput from './chat/MessageInput';
import MessageSuggestions from './chat/MessageSuggestions';
import HackerModeEnhanced from './chat/HackerModeEnhanced';
import useHackerMode from '../hooks/useHackerMode';
import { toast } from './ui/sonner';
import { detectThreats } from '@/services/threatDetectionService';

const JarvisChatMainEnhanced: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Try to use the JarvisChat context, but provide fallbacks if it's not available
  let jarvisChat;
  try {
    jarvisChat = useJarvisChat();
  } catch (error) {
    console.warn("JarvisChat context not available, using fallback values");
    jarvisChat = {
      handleImageGenerationFromPrompt: async (text: string) => {
        console.log("Image generation requested:", text);
        return null;
      },
      isGeneratingImage: false,
      messages: [],
      activeImage: null,
      setActiveImage: () => {},
      handleRefineImage: async () => null,
      generationProgress: 0
    };
  }
  
  const { isHackerModeActive, checkForHackerMode, deactivateHackerMode } = useHackerMode();

  // Create a local send message function since the JarvisChatContext doesn't have sendMessage
  const handleSendMessage = async (text: string) => {
    // Check if hacker mode should be activated
    const isHackerCommand = checkForHackerMode(text);
    
    // Handle threat detection command
    if (text.toLowerCase().includes("detect threat") || text.toLowerCase().includes("scan for threats")) {
      setIsProcessing(true);
      // Add the message to our local state
      setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now().toString() }]);
      
      // Process threat detection
      try {
        const phoneNumber = "whatsapp:+13205300568"; // Default Twilio number
        const result = await detectThreats(phoneNumber);
        
        let responseText = "";
        if (result.status === "threats_detected") {
          responseText = `I've detected ${result.threatCount} high-level security threats. Alerts have been sent to your WhatsApp.`;
        } else {
          responseText = "Threat scan complete. No immediate threats detected.";
        }
        
        // Add response message
        setMessages(prev => [...prev, { role: 'assistant', content: responseText, id: Date.now().toString() }]);
      } catch (error) {
        console.error("Error in threat detection:", error);
        toast("Error", {
          description: "Failed to complete threat detection.",
        });
      } finally {
        setIsProcessing(false);
      }
      
      // Clear input
      setInput('');
      return;
    }
    
    // If not a hacker command and we have image generation handling available
    if (!isHackerCommand && jarvisChat.handleImageGenerationFromPrompt) {
      setIsProcessing(true);
      
      // We'll use image generation as a fallback since sendMessage isn't available
      jarvisChat.handleImageGenerationFromPrompt(text)
        .catch(error => console.error("Failed to process message:", error))
        .finally(() => setIsProcessing(false));
        
      // Add the message to our local state
      setMessages(prev => [...prev, { role: 'user', content: text, id: Date.now().toString() }]);
    }
    
    // Clear input
    setInput('');
  };

  // Close hacker mode when clicking outside or sending a new message
  const handleCloseHackerMode = () => {
    if (isHackerModeActive) {
      deactivateHackerMode();
    }
  };
  
  // Use context messages if available, otherwise use local state
  const displayMessages = jarvisChat.messages || messages;
  const isCurrentlyProcessing = jarvisChat.isGeneratingImage || isProcessing;
  
  // Create suggestions with threat detection
  const suggestions = [
    { id: 'threat-1', text: 'Detect threat' },
    { id: 'threat-2', text: 'Scan for threats' },
    { id: 'default-1', text: 'Generate an image for me' },
    { id: 'default-2', text: 'What can you help me with?' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto p-4" onClick={handleCloseHackerMode}>
        <ChatDashboardPanel />
      </div>
      
      {/* Hacker mode overlay */}
      {isHackerModeActive && (
        <div className="absolute inset-0 z-10 bg-black/70 p-8 overflow-auto">
          <HackerModeEnhanced isActive={isHackerModeActive} />
        </div>
      )}
      
      {/* Message suggestions */}
      <div className="p-2 border-t border-gray-700">
        <MessageSuggestions 
          suggestions={suggestions} 
          onSuggestionClick={(suggestion) => handleSendMessage(suggestion)}
        />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-700">
        <MessageInput 
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isDisabled={isHackerModeActive}
          isProcessing={isCurrentlyProcessing}
        />
      </div>
    </div>
  );
};

export default JarvisChatMainEnhanced;
