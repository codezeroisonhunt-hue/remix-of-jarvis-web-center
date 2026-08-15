
import React, { createContext, useContext, useState, useEffect } from 'react';

type HackerEffectsContextType = {
  isActive: boolean;
  activateEffects: () => void;
  deactivateEffects: () => void;
  playGlitchEffect: () => void;
  playCommandTick: () => void;
};

const HackerEffectsContext = createContext<HackerEffectsContextType | null>(null);

export const useHackerEffects = () => {
  const context = useContext(HackerEffectsContext);
  if (!context) {
    throw new Error('useHackerEffects must be used within a HackerEffectsProvider');
  }
  return context;
};

export const HackerEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  const activateEffects = () => {
    setIsActive(true);
    // @ts-ignore - Global function from HackerSoundEffects
    if (window.playHackerGlitchSound) {
      // @ts-ignore
      window.playHackerGlitchSound();
    }
  };

  const deactivateEffects = () => {
    setIsActive(false);
  };

  const playGlitchEffect = () => {
    // @ts-ignore - Global function from HackerSoundEffects
    if (window.playHackerGlitchSound) {
      // @ts-ignore
      window.playHackerGlitchSound();
    }
  };

  const playCommandTick = () => {
    // @ts-ignore - Global function from HackerSoundEffects
    if (window.playHackerCommandTick) {
      // @ts-ignore
      window.playHackerCommandTick();
    }
  };

  return (
    <HackerEffectsContext.Provider 
      value={{ 
        isActive, 
        activateEffects, 
        deactivateEffects,
        playGlitchEffect,
        playCommandTick
      }}
    >
      {children}
    </HackerEffectsContext.Provider>
  );
};

export default HackerEffectsProvider;
