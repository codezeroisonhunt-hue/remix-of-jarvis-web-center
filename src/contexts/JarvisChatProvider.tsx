
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AssistantType } from '@/pages/JarvisInterface';

interface ImageGenerationResult {
  url: string;
  prompt: string;
  id: string;
}

export interface JarvisChatContextType {
  messages: any[];
  sendMessage: (message: string) => Promise<void>;
  activeImage: ImageGenerationResult | null;
  setActiveImage: (image: ImageGenerationResult | null) => void;
  isGeneratingImage: boolean;
  handleImageGenerationFromPrompt: (prompt: string) => Promise<ImageGenerationResult | null>;
  handleRefineImage: (feedback: string) => Promise<ImageGenerationResult | null>;
  generationProgress: number;
  isSpeaking: boolean;
  isListening: boolean;
  activeAssistant: AssistantType;
  inputMode: 'voice' | 'text';
  setInputMode: (mode: 'voice' | 'text') => void;
}

// Create and export the JarvisContext
export const JarvisChatContext = createContext<JarvisChatContextType | undefined>(undefined);

export const JarvisChatProvider = ({ children, ...props }: { 
  children: ReactNode,
  activeMode?: string,
  setIsSpeaking?: (value: boolean) => void,
  isListening?: boolean,
  activeAssistant?: string,
  setActiveAssistant?: (assistant: string) => void,
  inputMode?: 'voice' | 'text',
  setInputMode?: (mode: 'voice' | 'text') => void,
  onMessageCheck?: (message: string) => boolean,
  hackerModeActive?: boolean,
  hackerOutput?: string,
  setHackerOutput?: (output: string) => void,
  onDeactivateHacker?: () => void
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<ImageGenerationResult | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use provided props or defaults
  const inputModeState = useState<'voice' | 'text'>(props.inputMode || 'text');
  const activeAssistantState = useState<AssistantType>(props.activeAssistant as AssistantType || 'jarvis');
  
  // Initialize with a welcome message
  useEffect(() => {
    const initialMessage = {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am JARVIS, your personal assistant. How can I help you today?',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);
  
  // Function to send a message
  const sendMessage = async (message: string) => {
    // Check if this is a special message that should be handled by parent (e.g. hacker mode or hologram)
    if (props.onMessageCheck && props.onMessageCheck(message)) {
      return;
    }
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate a response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${message}"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // If we have a setIsSpeaking function from props, use it
      if (props.setIsSpeaking) {
        props.setIsSpeaking(true);
        setTimeout(() => props.setIsSpeaking!(false), 3000);
      }
    }, 1000);
  };
  
  // Mock image generation for demo purposes
  const handleImageGenerationFromPrompt = async (prompt: string): Promise<ImageGenerationResult | null> => {
    setIsGeneratingImage(true);
    setGenerationProgress(0);
    
    // Simulate progressive generation
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(interval);
    setGenerationProgress(100);
    setIsGeneratingImage(false);
    
    const result = {
      url: 'https://via.placeholder.com/512x512?text=AI+Generated+Image',
      prompt,
      id: Date.now().toString()
    };
    
    setActiveImage(result);
    return result;
  };
  
  // Mock image refinement
  const handleRefineImage = async (feedback: string): Promise<ImageGenerationResult | null> => {
    if (!activeImage) return null;
    
    setIsGeneratingImage(true);
    setGenerationProgress(0);
    
    // Simulate progressive generation
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(interval);
    setGenerationProgress(100);
    setIsGeneratingImage(false);
    
    const result = {
      url: `https://via.placeholder.com/512x512?text=Refined:+${feedback.substring(0, 20)}`,
      prompt: `${activeImage.prompt} ${feedback}`,
      id: Date.now().toString()
    };
    
    setActiveImage(result);
    return result;
  };
  
  return (
    <JarvisChatContext.Provider 
      value={{
        messages,
        sendMessage,
        activeImage,
        setActiveImage,
        isGeneratingImage,
        handleImageGenerationFromPrompt,
        handleRefineImage,
        generationProgress,
        isSpeaking: props.setIsSpeaking ? Boolean(isSpeaking) : false,
        isListening: Boolean(props.isListening),
        activeAssistant: activeAssistantState[0],
        inputMode: inputModeState[0],
        setInputMode: props.setInputMode || inputModeState[1]
      }}
    >
      {children}
    </JarvisChatContext.Provider>
  );
};

export const useJarvisChat = () => {
  const context = useContext(JarvisChatContext);
  if (context === undefined) {
    throw new Error('useJarvisChat must be used within a JarvisChatProvider');
  }
  return context;
};
