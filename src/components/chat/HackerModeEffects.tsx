
import { useEffect, useState } from 'react';
import './HackerModeEffects.css';

interface HackerModeEffectsProps {
  isActive: boolean;
}

const HackerModeEffects = ({ isActive }: HackerModeEffectsProps) => {
  // Only render effects if hacker mode is active
  if (!isActive) return null;
  
  return (
    <>
      <div className="scanline" />
      <div className="flicker" />
    </>
  );
};

export const GlitchText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
};

export const AutoTypeText = ({ text, speed = 50 }: { text: string, speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span className="type-text">{displayText}</span>;
};

export default HackerModeEffects;
