
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CommandResponseProps {
  message: string;
  isTyping: boolean;
}

const CommandResponse: React.FC<CommandResponseProps> = ({ message, isTyping }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef(message);

  // Typing effect
  useEffect(() => {
    // Reset typing animation when message changes
    if (message !== messageRef.current) {
      setDisplayedText('');
      messageRef.current = message;
    }
    
    if (isTyping) {
      let i = 0;
      setDisplayedText('');
      
      // Clear any existing interval
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
      }
      
      // Set up typewriter effect
      typewriterRef.current = setInterval(() => {
        if (i < message.length) {
          setDisplayedText(prev => prev + message.charAt(i));
          i++;
        } else {
          if (typewriterRef.current) {
            clearInterval(typewriterRef.current);
          }
        }
      }, 30); // Speed of typing
    } else {
      setDisplayedText(message);
    }
    
    return () => {
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
      }
    };
  }, [message, isTyping]);
  
  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="jarvis-panel p-5 min-h-[100px] flex items-center justify-center relative group">
      {/* Scanner line effect */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <div 
          className={cn(
            "absolute h-[2px] w-full bg-gradient-to-r from-transparent via-jarvis to-transparent opacity-20",
            isTyping ? "animate-wave" : "opacity-0"
          )}
          style={{ 
            top: '50%',
            animationDuration: '3s'
          }}
        ></div>
      </div>
      
      <div className="relative text-lg md:text-xl font-medium holographic-text">
        {isTyping ? displayedText : message}
        <span className={cn(
          "inline-block w-2 h-5 ml-1 bg-jarvis transform translate-y-1",
          cursorVisible && isTyping ? "opacity-100" : "opacity-0",
          "transition-opacity duration-150"
        )}></span>
      </div>
      
      {/* Edge glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 border border-jarvis/20 rounded-lg transition-opacity duration-300 pointer-events-none"
           style={{ 
             boxShadow: '0 0 15px rgba(30, 174, 219, 0.2)' 
           }}></div>
    </div>
  );
};

export default CommandResponse;
