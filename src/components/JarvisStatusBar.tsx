
import React from 'react';
import { JarvisMode } from './JarvisCore';
import { LucideIcon } from 'lucide-react';

interface JarvisStatusBarProps {
  activeMode: JarvisMode;
  isSpeaking: boolean;
  isListening: boolean;
  modeIcons: Record<JarvisMode, LucideIcon>;
  modeNames: Record<JarvisMode, string>;
  children?: React.ReactNode;
}

const JarvisStatusBar: React.FC<JarvisStatusBarProps> = ({ 
  activeMode, 
  isSpeaking, 
  isListening, 
  modeIcons,
  modeNames,
  children
}) => {
  const Icon = modeIcons[activeMode];
  
  return (
    <div className="w-full jarvis-panel flex items-center justify-between p-3">
      <div className="flex items-center">
        <div className="text-xl font-bold text-jarvis text-glow mr-2">JARVIS</div>
        <div className="text-xs uppercase bg-jarvis/20 text-jarvis px-2 py-0.5 rounded">
          v1.0
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex items-center text-sm">
          <div className={`h-2 w-2 rounded-full mr-2 ${isSpeaking ? 'bg-jarvis animate-pulse-slow' : 'bg-gray-600'}`}></div>
          <span className={isSpeaking ? 'text-jarvis' : 'text-gray-500'}>Voice</span>
        </div>
        
        <div className="flex items-center text-sm">
          <div className={`h-2 w-2 rounded-full mr-2 ${isListening ? 'bg-jarvis animate-pulse-slow' : 'bg-gray-600'}`}></div>
          <span className={isListening ? 'text-jarvis' : 'text-gray-500'}>Listening</span>
        </div>
        
        <div className="flex items-center text-sm">
          <div className="h-2 w-2 rounded-full mr-2 bg-jarvis"></div>
          <span className="text-jarvis">System Online</span>
        </div>
      </div>
      
      {children && (
        <div className="flex items-center">
          {children}
        </div>
      )}
      
      <div className="flex items-center">
        <Icon className="h-4 w-4 text-jarvis mr-2" />
        <span className="text-jarvis text-sm">{modeNames[activeMode]}</span>
      </div>
    </div>
  );
};

export default JarvisStatusBar;
