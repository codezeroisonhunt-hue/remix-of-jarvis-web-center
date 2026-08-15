
import React, { useEffect, useState } from 'react';
import { avatarService, AvatarExpression } from '@/services/avatarService';
import { useInterval } from '@/hooks/useInterval';

interface AIFaceProps {
  expression?: AvatarExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: 'default' | 'tech' | 'minimal' | 'hacker' | 'ghost';
  speaking?: boolean;
  className?: string;
}

export const AIFace: React.FC<AIFaceProps> = ({
  expression: externalExpression,
  size = 'md',
  style = 'tech',
  speaking = false,
  className
}) => {
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>(
    externalExpression || avatarService.getState().currentExpression
  );
  const [blinking, setBlinking] = useState(false);
  
  // Dimensions based on size
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };
  
  // Update expression when prop changes
  useEffect(() => {
    if (externalExpression) {
      setCurrentExpression(externalExpression);
    }
  }, [externalExpression]);
  
  // Random blinking
  useInterval(() => {
    if (Math.random() < 0.2) { // 20% chance to blink
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }
  }, 3000);
  
  // Generate the face SVG based on expression and style
  const renderFace = () => {
    // Common classes for all face styles
    const sizeClass = dimensions[size];
    
    switch (style) {
      case 'tech':
        return (
          <div className={`relative ${sizeClass} bg-black/30 rounded-full overflow-hidden border border-jarvis/30 flex items-center justify-center ${className || ''}`}>
            {/* Tech face representation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-3/4 h-1/4 bg-jarvis/20 rounded-full">
                {/* Eyes */}
                <div className="absolute top-0 left-1/4 transform -translate-y-5 w-1/3 flex justify-between">
                  <div className={`w-3 h-3 rounded-full bg-jarvis ${blinking ? 'h-0.5' : ''}`}></div>
                  <div className={`w-3 h-3 rounded-full bg-jarvis ${blinking ? 'h-0.5' : ''}`}></div>
                </div>
                
                {/* Mouth based on expression */}
                {currentExpression === 'happy' && (
                  <div className="absolute w-1/2 h-6 left-1/4 bottom-0 transform translate-y-2 rounded-full border-t-2 border-jarvis"></div>
                )}
                {currentExpression === 'sad' && (
                  <div className="absolute w-1/2 h-6 left-1/4 top-0 transform -translate-y-2 rounded-full border-b-2 border-jarvis"></div>
                )}
                {currentExpression === 'surprised' && (
                  <div className="absolute w-1/4 h-1/4 left-[37.5%] bottom-0 transform translate-y-2 rounded-full border-2 border-jarvis"></div>
                )}
                {currentExpression === 'angry' && (
                  <div className="absolute w-1/2 h-1 left-1/4 bottom-0 transform translate-y-2 bg-jarvis"></div>
                )}
                {currentExpression === 'thinking' && (
                  <div className="absolute w-1/4 h-1 left-1/4 bottom-0 transform translate-y-2 bg-jarvis"></div>
                )}
                {currentExpression === 'suspicious' && (
                  <div className="absolute w-1/3 h-1 left-1/3 bottom-0 transform translate-y-2 rotate-45 bg-jarvis"></div>
                )}
                {(currentExpression === 'neutral' || !currentExpression) && (
                  <div className="absolute w-1/3 h-1 left-1/3 bottom-0 transform translate-y-2 bg-jarvis"></div>
                )}
              </div>
            </div>
            
            {/* Animated circles for "speaking" effect */}
            {speaking && (
              <>
                <div className="absolute inset-0 border-2 border-jarvis/30 rounded-full animate-ping-slow opacity-30"></div>
                <div className="absolute inset-[15%] border border-jarvis/40 rounded-full animate-ping-slow opacity-40" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
            
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jarvis/10 to-transparent animate-scan"></div>
          </div>
        );
      
      case 'hacker':
        return (
          <div className={`relative ${sizeClass} bg-black/40 border border-red-500/30 rounded-lg overflow-hidden flex items-center justify-center ${className || ''}`}>
            {/* Hacker face representation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono text-xs text-red-500 mb-2">GHOST.SYS v2.0</div>
              
              {/* Eyes as terminal-like elements */}
              <div className="flex space-x-3">
                <div className={`w-3 h-3 bg-red-500 ${blinking ? 'opacity-30' : 'opacity-100'}`}></div>
                <div className={`w-3 h-3 bg-red-500 ${blinking ? 'opacity-30' : 'opacity-100'}`}></div>
              </div>
              
              {/* Expression as code-like text */}
              <div className="mt-2 text-xs font-mono text-red-500">
                {currentExpression === 'happy' && ":)"}
                {currentExpression === 'sad' && ":("}
                {currentExpression === 'surprised' && ":o"}
                {currentExpression === 'angry' && ">:("}
                {currentExpression === 'thinking' && ":/"}
                {currentExpression === 'suspicious' && ":|"}
                {(currentExpression === 'neutral' || !currentExpression) && ":|"}
              </div>
              
              {/* Binary stream at bottom */}
              <div className="absolute bottom-1 left-0 right-0 text-[8px] font-mono text-red-500/70 overflow-hidden whitespace-nowrap">
                {speaking ? 
                  "01010100 01110010 01100001 01100011 01101011 01101001 01101110 01100111" :
                  "10010110 01001100 01001111 01000001 01000100 01000101 01000100"}
              </div>
            </div>
            
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-scan"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
          </div>
        );
        
      case 'minimal':
        return (
          <div className={`relative ${sizeClass} rounded-full border-2 border-jarvis/30 bg-gradient-to-br from-jarvis/5 to-jarvis/10 flex items-center justify-center ${className || ''}`}>
            {/* Minimal face - just circles and lines */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-3/5 justify-between my-2">
                <div className={`w-3 h-3 rounded-full border-2 border-jarvis bg-transparent ${blinking ? 'h-0.5' : ''}`}></div>
                <div className={`w-3 h-3 rounded-full border-2 border-jarvis bg-transparent ${blinking ? 'h-0.5' : ''}`}></div>
              </div>
              
              {/* Mouth based on expression */}
              <div className="w-1/2 mt-2">
                {currentExpression === 'happy' && (
                  <div className="w-full h-3 border-t-2 border-jarvis rounded-t-full"></div>
                )}
                {currentExpression === 'sad' && (
                  <div className="w-full h-3 border-b-2 border-jarvis rounded-b-full"></div>
                )}
                {currentExpression === 'surprised' && (
                  <div className="w-1/2 h-4 mx-auto rounded-full border-2 border-jarvis"></div>
                )}
                {currentExpression === 'angry' && (
                  <div className="w-full h-0.5 bg-jarvis transform rotate-[-10deg]"></div>
                )}
                {currentExpression === 'thinking' && (
                  <div className="w-1/2 h-0.5 bg-jarvis"></div>
                )}
                {currentExpression === 'suspicious' && (
                  <div className="w-1/2 h-0.5 bg-jarvis transform rotate-[10deg]"></div>
                )}
                {(currentExpression === 'neutral' || !currentExpression) && (
                  <div className="w-full h-0.5 bg-jarvis"></div>
                )}
              </div>
            </div>
            
            {/* Breathing effect */}
            <div className={`absolute inset-0 rounded-full border border-jarvis/20 ${speaking ? 'animate-pulse' : ''}`}></div>
          </div>
        );
        
      case 'ghost':
        return (
          <div className={`relative ${sizeClass} rounded-full bg-black/40 flex items-center justify-center ${className || ''}`}>
            {/* Ghost effect - subtle, barely visible face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-60">
              {/* Eyes - barely visible dots */}
              <div className="flex w-3/5 justify-between my-2">
                <div className={`w-2 h-2 rounded-full bg-white/20 shadow-glow-sm ${blinking ? 'opacity-0' : 'opacity-70'}`}></div>
                <div className={`w-2 h-2 rounded-full bg-white/20 shadow-glow-sm ${blinking ? 'opacity-0' : 'opacity-70'}`}></div>
              </div>
              
              {/* Barely visible mouth */}
              <div className="w-1/3 h-0.5 bg-white/10 mt-2"></div>
            </div>
            
            {/* Ghostly particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.3,
                    animationDuration: `${3 + Math.random() * 7}s`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Ghostly fog effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-full"></div>
            
            {/* Speaking effect */}
            {speaking && (
              <div className="absolute inset-0 bg-white/5 animate-pulse rounded-full"></div>
            )}
          </div>
        );
      
      default:
        // Default face style
        return (
          <div className={`relative ${sizeClass} rounded-full bg-black/20 flex items-center justify-center ${className || ''}`}>
            {/* Default face with simple features */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex w-1/2 justify-between mt-4">
                <div className={`w-2.5 h-2.5 rounded-full bg-jarvis ${blinking ? 'h-0.5' : ''}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full bg-jarvis ${blinking ? 'h-0.5' : ''}`}></div>
              </div>
              
              {/* Dynamic mouth based on expression */}
              <div className="w-1/2 mt-3">
                {currentExpression === 'happy' && (
                  <div className="w-full h-1.5 border-t-2 border-jarvis rounded-t-lg"></div>
                )}
                {currentExpression === 'sad' && (
                  <div className="w-full h-1.5 border-b-2 border-jarvis rounded-b-lg"></div>
                )}
                {currentExpression === 'surprised' && (
                  <div className="w-2.5 h-2.5 mx-auto rounded-full bg-jarvis/80"></div>
                )}
                {currentExpression === 'angry' && (
                  <div className="w-full h-0.5 bg-jarvis"></div>
                )}
                {(currentExpression === 'neutral' || !currentExpression || currentExpression === 'thinking' || currentExpression === 'suspicious') && (
                  <div className="w-1/2 h-0.5 mx-auto bg-jarvis"></div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };
  
  return renderFace();
};

export default AIFace;
