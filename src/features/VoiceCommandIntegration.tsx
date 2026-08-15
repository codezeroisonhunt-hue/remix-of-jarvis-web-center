
import React, { useEffect, useState, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCommandIntegrationProps {
  isActive: boolean;
}

const VoiceCommandIntegration: React.FC<VoiceCommandIntegrationProps> = ({ 
  isActive
}) => {
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    clearTranscript,
    isSupported 
  } = useSpeechRecognition();
  
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeCommandsRef = useRef<Set<string>>(new Set());
  
  // Get JarvisChat context safely with a fallback
  let sendMessage: (message: string) => Promise<void>;
  let isSpeaking = false;
  
  // Try-catch to handle possible context not being available
  try {
    // Dynamically import to avoid direct usage that could throw an error
    const { useJarvisChat } = require('@/components/JarvisChatContext');
    try {
      const jarvisChat = useJarvisChat();
      sendMessage = jarvisChat.sendMessage;
      isSpeaking = jarvisChat.isSpeaking;
    } catch (error) {
      // Context not available, use fallback
      console.warn("JarvisChat context not available, using fallback values");
      sendMessage = async (message: string) => {
        console.log("Would send message:", message);
        toast({
          title: "Voice Command",
          description: `Received: "${message}" (Context unavailable)`,
        });
      };
    }
  } catch (error) {
    // Module not available or other error
    console.warn("JarvisChat module not available");
    sendMessage = async (message: string) => {
      console.log("Would send message:", message);
      toast({
        title: "Voice Command",
        description: `Received: "${message}" (Module unavailable)`,
      });
    };
  }
  
  // Set up and connect to Supabase Realtime for command broadcasting
  useEffect(() => {
    if (!isActive) return;
    
    // Create a realtime channel for voice commands
    const channel = supabase.channel('voice_commands', {
      config: {
        broadcast: { self: true },
        presence: { key: 'user_' + Math.random().toString(36).substring(2, 9) },
      }
    });

    // Handle incoming voice commands from other clients
    channel
      .on('broadcast', { event: 'voice_command' }, (payload) => {
        console.log('Received broadcast voice command:', payload);
        if (payload.payload && payload.payload.command) {
          // Add visual indicator that command was received remotely
          toast({
            title: "Remote Voice Command",
            description: `Processing: "${payload.payload.command}"`,
          });
          
          // Process the command but don't broadcast it again
          processCommand(payload.payload.command, false);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to voice commands channel');
          setRealtimeChannel(channel);
        }
      });

    return () => {
      if (channel) {
        console.log('Removing voice commands channel');
        supabase.removeChannel(channel);
      }
    };
  }, [isActive]);
  
  // Start/stop listening based on active status
  useEffect(() => {
    if (isActive && !isListening && isSupported) {
      startListening();
      console.log("Voice recognition started");
    } else if (!isActive && isListening) {
      stopListening();
      console.log("Voice recognition stopped");
    }
    
    return () => {
      if (isListening) {
        stopListening();
        console.log("Voice recognition cleanup");
      }
      
      // Clear any pending command timeouts
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
    };
  }, [isActive, isListening, startListening, stopListening, isSupported]);
  
  // Process transcript when it changes
  useEffect(() => {
    if (!transcript || transcript === lastProcessedTranscript || isSpeaking || isProcessing) return;
    
    // Check for wake word "Jarvis"
    const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(transcript);
    
    if (hasWakeWord) {
      console.log("Wake word detected:", transcript);
      
      // Process command and broadcast to other clients
      processCommand(transcript, true);
      setLastProcessedTranscript(transcript);
      clearTranscript();
    }
  }, [transcript, lastProcessedTranscript, isSpeaking, isProcessing]);
  
  // Function to process voice commands with debouncing and broadcasting
  const processCommand = async (command: string, shouldBroadcast: boolean = true) => {
    // Prevent processing if this command is already being handled
    if (activeCommandsRef.current.has(command)) {
      return;
    }
    
    // Add to active commands
    activeCommandsRef.current.add(command);
    setIsProcessing(true);
    
    // Notify user
    toast({
      title: "Voice Command Detected",
      description: `Processing: "${command}"`,
    });
    
    // Broadcast command to other clients
    if (shouldBroadcast && realtimeChannel) {
      try {
        await realtimeChannel.send({
          type: 'broadcast',
          event: 'voice_command',
          payload: { command }
        });
        console.log("Voice command broadcast to other clients");
      } catch (error) {
        console.error("Error broadcasting voice command:", error);
      }
    }
    
    try {
      // Process the command
      await sendMessage(command);
    } catch (error) {
      console.error("Error processing voice command:", error);
    } finally {
      // Add delay before allowing the same command again
      commandTimeoutRef.current = setTimeout(() => {
        activeCommandsRef.current.delete(command);
        setIsProcessing(false);
      }, 2000);
    }
  };
  
  return null; // This is a non-visual component
};

export default VoiceCommandIntegration;
