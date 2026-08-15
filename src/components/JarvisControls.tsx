import React, { useState } from 'react';
import { JarvisMode } from './JarvisCore';
import { Button } from './ui/button';
import { 
  Brain, 
  Mic, 
  Headphones, 
  Volume2,
  VolumeX
} from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface JarvisControlsProps {
  activeMode: JarvisMode;
  setActiveMode: (mode: JarvisMode) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

const JarvisControls: React.FC<JarvisControlsProps> = ({ 
  activeMode, 
  setActiveMode,
  isListening,
  setIsListening
}) => {
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [autoReply, setAutoReply] = useState(true);
  
  const handleModeChange = (mode: JarvisMode) => {
    setActiveMode(mode);
  };
  
  const toggleListening = () => {
    setIsListening(!isListening);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="jarvis-panel p-4">
      <div className="mb-4">
        <h3 className="text-jarvis font-medium mb-3">Operation Modes</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeMode === 'normal' ? 'default' : 'outline'}
            className={`flex items-center ${
              activeMode === 'normal' 
                ? 'bg-jarvis text-white' 
                : 'bg-transparent border-jarvis/30 text-jarvis hover:bg-jarvis/20'
            }`}
            onClick={() => handleModeChange('normal')}
          >
            <Brain className="mr-2 h-4 w-4" />
            Normal
          </Button>
          <Button
            variant={activeMode === 'voice' ? 'default' : 'outline'}
            className={`flex items-center ${
              activeMode === 'voice' 
                ? 'bg-jarvis text-white' 
                : 'bg-transparent border-jarvis/30 text-jarvis hover:bg-jarvis/20'
            }`}
            onClick={() => handleModeChange('voice')}
          >
            <Mic className="mr-2 h-4 w-4" />
            Voice
          </Button>
          <Button
            variant={activeMode === 'face' ? 'default' : 'outline'}
            className={`flex items-center ${
              activeMode === 'face' 
                ? 'bg-jarvis text-white' 
                : 'bg-transparent border-jarvis/30 text-jarvis hover:bg-jarvis/20'
            }`}
            onClick={() => handleModeChange('face')}
          >
            <Headphones className="mr-2 h-4 w-4" />
            Face
          </Button>
        </div>
      </div>
      
      {(activeMode === 'voice' || activeMode === 'face') && (
        <div className="mb-4">
          <h3 className="text-jarvis font-medium mb-3">Voice Controls</h3>
          <div className="flex justify-between items-center mb-3">
            <Button
              variant={isListening ? 'default' : 'outline'}
              className={`w-full ${
                isListening 
                  ? 'bg-jarvis text-white animate-pulse' 
                  : 'bg-transparent border-jarvis/30 text-jarvis hover:bg-jarvis/20'
              }`}
              onClick={toggleListening}
            >
              <Mic className="mr-2 h-4 w-4" />
              {isListening ? 'Listening...' : 'Start Listening'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-jarvis hover:bg-jarvis/20"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={handleVolumeChange}
            />
            <span className="text-xs text-jarvis w-8 text-center">{isMuted ? '0%' : `${volume}%`}</span>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-jarvis font-medium mb-3">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-reply" className="text-gray-300 cursor-pointer">Auto Reply</Label>
            <Switch
              id="auto-reply"
              checked={autoReply}
              onCheckedChange={setAutoReply}
              className="data-[state=checked]:bg-jarvis"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-jarvis/20">
        <p className="text-gray-500 text-xs text-center">JARVIS v1.0</p>
        <p className="text-gray-500 text-xs text-center">© 2025 All Rights Reserved</p>
      </div>
    </div>
  );
};

export default JarvisControls;
