
import React, { useEffect, useRef } from 'react';
import { JarvisMode } from './JarvisCore';
import JarvisCore from './core/JarvisCore';
import SatelliteVision from './SatelliteVision';

interface JarvisAvatarProps {
  activeMode: JarvisMode;
  isSpeaking: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  detectedEmotion?: string;
  detectedAge?: number | null;
  detectedGender?: string | null;
  detectedObjects?: Array<{ class: string; confidence: number }>;
}

const JarvisAvatar: React.FC<JarvisAvatarProps> = ({ 
  activeMode, 
  isSpeaking,
  isListening = false,
  isProcessing = false,
  detectedEmotion,
  detectedAge,
  detectedGender,
  detectedObjects = []
}) => {
  return (
    <div className="jarvis-panel relative h-[350px] flex items-center justify-center group">
      {/* Tech background */}
      <div className="tech-grid"></div>
      
      {/* Jarvis Logo */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="w-6 h-6 rounded-full bg-jarvis/80 flex items-center justify-center mr-2">
          <span className="text-black font-bold text-xs">J</span>
        </div>
        <div className="jarvis-logo text-sm">J.A.R.V.I.S</div>
      </div>
      
      {/* Core Background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <JarvisCore
          isSpeaking={isSpeaking}
          isListening={isListening}
          isProcessing={isProcessing}
        />
      </div>
      
      {/* SatelliteVision Component - only show in satellite mode */}
      {activeMode === 'satellite' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SatelliteVision />
        </div>
      )}
      
      {/* Status Indicator */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs ${
        isSpeaking ? 'bg-jarvis/20 text-jarvis animate-flicker' : 
        isListening ? 'bg-green-500/20 text-green-400 animate-pulse' :
        isProcessing ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
        'bg-gray-800/50 text-gray-400'
      }`}>
        {isSpeaking ? 'SPEAKING' : 
         isListening ? 'LISTENING' : 
         isProcessing ? 'PROCESSING' : 
         'IDLE'}
      </div>
      
      {/* Emotion and Personal Data Display - show when in face mode */}
      {activeMode === 'face' && detectedEmotion && (
        <div className="absolute top-16 right-4 bg-jarvis/20 text-jarvis px-3 py-1 rounded-full text-xs">
          {detectedGender && detectedAge 
            ? `${detectedEmotion} • ${detectedGender} • ~${detectedAge} yrs`
            : `Emotion: ${detectedEmotion}`
          }
        </div>
      )}
      
      {/* Object Detection Display - show in face mode */}
      {activeMode === 'face' && detectedObjects && detectedObjects.length > 0 && (
        <div className="absolute top-24 right-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
          Objects: {detectedObjects.slice(0, 3).map(obj => obj.class).join(', ')}
          {detectedObjects.length > 3 && '...'}
        </div>
      )}
      
      {/* Mode Badge */}
      <div className="absolute top-4 right-4 bg-jarvis/20 text-jarvis px-3 py-1 rounded-full text-xs uppercase font-bold">
        {activeMode} mode
      </div>
      
      {/* Glowing effect on hover */}
      <div className="absolute inset-0 border border-transparent rounded-md transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:border-jarvis/40 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]"></div>
    </div>
  );
};

export default JarvisAvatar;
