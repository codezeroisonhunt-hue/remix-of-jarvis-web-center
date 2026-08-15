
import { useEffect, useState } from 'react';

export const useHackerModeEffects = (isHackerMode: boolean) => {
  const [transitionComplete, setTransitionComplete] = useState(false);
  
  useEffect(() => {
    if (isHackerMode) {
      // Add a delay before considering transition complete
      const timer = setTimeout(() => {
        setTransitionComplete(true);
      }, 2000); // 2 seconds delay
      
      return () => clearTimeout(timer);
    } else {
      setTransitionComplete(false);
    }
  }, [isHackerMode]);
  
  const playCommandTick = () => {
    // @ts-ignore - Global function from HackerSoundEffects
    if (window.playHackerCommandTick) {
      // @ts-ignore
      window.playHackerCommandTick();
    }
  };
  
  const playGlitchSound = () => {
    // @ts-ignore - Global function from HackerSoundEffects
    if (window.playHackerGlitchSound) {
      // @ts-ignore
      window.playHackerGlitchSound();
    }
  };
  
  return {
    transitionComplete,
    playCommandTick,
    playGlitchSound
  };
};

export default useHackerModeEffects;
