import { useState, useEffect, useCallback, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';
import { JarvisChatContext } from '@/contexts/JarvisChatProvider';

type CommandHandler = (transcript: string) => void;

type VoiceCommandConfig = {
  pattern: RegExp | string;
  handler: CommandHandler;
  feedback?: string;
};

export const useVoiceCommands = (isListening: boolean) => {
  const [transcript, setTranscript] = useState<string>('');
  const [commands, setCommands] = useState<Map<string, VoiceCommandConfig>>(new Map());
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  
  // Use context directly to avoid dependency on useJarvisChat hook
  const jarvisChat = useContext(JarvisChatContext);
  
  // Default values for properties that may not exist in the context
  const activeMode = typeof jarvisChat === 'object' && jarvisChat !== null && 'activeMode' in jarvisChat 
    ? (jarvisChat as any).activeMode 
    : 'normal';
    
  const setIsSpeaking = typeof jarvisChat === 'object' && jarvisChat !== null && 'setIsSpeaking' in jarvisChat
    ? (jarvisChat as any).setIsSpeaking 
    : (() => {});
  
  // Register a new command
  const registerCommand = useCallback((name: string, config: VoiceCommandConfig) => {
    setCommands(prevCommands => {
      const newCommands = new Map(prevCommands);
      newCommands.set(name, config);
      return newCommands;
    });
  }, []);
  
  // Unregister a command
  const unregisterCommand = useCallback((name: string) => {
    setCommands(prevCommands => {
      const newCommands = new Map(prevCommands);
      newCommands.delete(name);
      return newCommands;
    });
  }, []);
  
  // Process transcript to find and execute commands
  const processTranscript = useCallback((text: string) => {
    if (!text.trim() || isProcessingCommand) return;
    
    setTranscript(text);
    
    // Check for wake word "Jarvis" or "Hey Jarvis"
    const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(text);
    
    if (!hasWakeWord) return;
    
    // Log command for security
    if (window.JARVIS) {
      window.JARVIS.voice.logCommand(text, '');
    }
    
    setIsProcessingCommand(true);
    
    // Check each registered command
    let commandExecuted = false;
    
    commands.forEach((config, name) => {
      const { pattern, handler, feedback } = config;
      
      const match = typeof pattern === 'string' 
        ? text.toLowerCase().includes(pattern.toLowerCase())
        : pattern.test(text);
        
      if (match) {
        try {
          handler(text);
          
          if (feedback) {
            toast({
              title: "Command Recognized",
              description: feedback,
            });
            
            // Provide voice feedback if in voice mode
            if (activeMode === 'voice' || activeMode === 'face') {
              const synth = window.speechSynthesis;
              const utterance = new SpeechSynthesisUtterance(feedback);
              synth.speak(utterance);
              setIsSpeaking(true);
              utterance.onend = () => setIsSpeaking(false);
            }
          }
          
          commandExecuted = true;
        } catch (error) {
          console.error(`Error executing command "${name}":`, error);
          toast({
            title: "Command Error",
            description: `Error executing "${name}"`,
            variant: "destructive"
          });
        }
      }
    });
    
    // Notify if no command matched
    if (hasWakeWord && !commandExecuted) {
      toast({
        title: "Command Not Recognized",
        description: "I didn't understand that command",
      });
    }
    
    setIsProcessingCommand(false);
  }, [commands, isProcessingCommand, activeMode, setIsSpeaking]);
  
  // Simulate voice recognition (in a real implementation this would use the Web Speech API)
  useEffect(() => {
    if (!isListening) return;
    
    // In a real implementation, this would be replaced with actual voice recognition
    // For now we'll just simulate some commands coming in periodically for testing
    const testCommands = [
      "Jarvis, run security scan",
      "Hey Jarvis, activate emergency mode",
      "Jarvis, launch hacking mode",
      "Jarvis, check for updates",
      "Hey Jarvis, scan for objects",
      "Jarvis, show me the latest news",
      "Hey Jarvis, what's the weather today",
      "Jarvis, show tech news",
      "Hey Jarvis, news from India"
    ];
    
    // Only for development/testing purposes
    const simulationInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const randomCommand = testCommands[Math.floor(Math.random() * testCommands.length)];
        processTranscript(randomCommand);
      }
    }, 30000);
    
    // In a real implementation, we'd use the Web Speech API
    // const recognition = new window.SpeechRecognition();
    // recognition.continuous = true;
    // recognition.interimResults = false;
    // recognition.onresult = (event) => {
    //   const transcript = event.results[event.results.length - 1][0].transcript;
    //   processTranscript(transcript);
    // };
    // recognition.start();
    
    return () => {
      clearInterval(simulationInterval);
      // recognition.stop();
    };
  }, [isListening, processTranscript]);
  
  return {
    transcript,
    registerCommand,
    unregisterCommand,
    processTranscript
  };
};

// Add global type declaration for JARVIS global object
declare global {
  interface Window {
    JARVIS?: {
      security: {
        scan: () => void;
        setEmergencyMode: () => void;
        resetSecurityLevel: () => void;
        authorizeUser: (username: string) => void;
      };
      system: {
        backup: () => void;
        rollback: (backupPoint: Date) => void;
        getLastBackupTime: () => Date | null;
        getUpdateStatus: () => Record<string, string>;
      };
      voice: {
        logCommand: (command: string, response: string) => void;
      };
    };
  }
}
