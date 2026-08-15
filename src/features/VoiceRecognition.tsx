import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface VoiceRecognitionProps {
  onTranscription?: (text: string) => void;
}

export const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ onTranscription }) => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    clearTranscript,
    error,
    isSupported 
  } = useSpeechRecognition();

  // Pass transcription to parent component when it changes
  useEffect(() => {
    if (transcript && onTranscription) {
      onTranscription(transcript);
    }
  }, [transcript, onTranscription]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-red-500/30 bg-red-500/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Voice Recognition Unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-red-400">
            Voice recognition is not supported in this browser. Please try Chrome, Edge, or Safari.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-jarvis/30 ${isListening ? 'bg-jarvis/10' : 'bg-black/20'} transition-colors`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">Voice Recognition</span>
          {isListening && (
            <span className="text-xs bg-jarvis/20 text-jarvis px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </CardTitle>
        <CardDescription>Speak clearly to give commands to JARVIS</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Button 
            variant={isListening ? "default" : "outline"}
            className={isListening ? "bg-jarvis text-white hover:bg-jarvis/90" : "text-jarvis border-jarvis/50"}
            onClick={toggleListening}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" /> Start Listening
              </>
            )}
          </Button>
          
          {transcript && (
            <Button variant="ghost" onClick={clearTranscript} size="sm">
              Clear
            </Button>
          )}
        </div>
        
        {isListening && (
          <div className="flex items-center space-x-1 my-2">
            <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        
        {transcript && (
          <div className="bg-black/30 border border-jarvis/20 rounded-md p-3 mt-2 text-white">
            <p>{transcript}</p>
          </div>
        )}
        
        {error && (
          <p className="text-red-400 text-sm mt-1">Error: {error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceRecognition;
