
import { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AssistantType } from '@/pages/JarvisInterface';

export const useVoiceSynthesis = (activeMode: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Try to find a good default voice - prefer Daniel (English)
      const defaultVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('daniel') && voice.lang.startsWith('en')
      ) || availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
      
      setSelectedVoice(defaultVoice || null);
    };

    // Load voices on mount and when voices change
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = useCallback(async (text: string, assistantType: AssistantType = 'jarvis') => {
    if (!selectedVoice) {
      toast({
        title: "Voice Not Available",
        description: "No speech synthesis voice is available.",
        variant: "destructive"
      });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      toast({
        title: "Speech Error",
        description: "Failed to speak the text.",
        variant: "destructive"
      });
    };

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const setAudioVolume = useCallback((volume: number) => {
    // Volume is handled by the system for Web Speech API
  }, []);

  return {
    speakText,
    stopSpeaking,
    setAudioVolume,
    isPlaying,
    voices,
    selectedVoice,
    setSelectedVoice
  };
};
