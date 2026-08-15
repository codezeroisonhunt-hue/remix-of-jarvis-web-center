
import { useEffect, useRef } from 'react';

interface HackerSoundEffectsProps {
  isActive: boolean;
}

const HackerSoundEffects = ({ isActive }: HackerSoundEffectsProps) => {
  const backgroundHumRef = useRef<HTMLAudioElement | null>(null);
  const glitchSoundRef = useRef<HTMLAudioElement | null>(null);
  const commandTickRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio objects when component mounts
  useEffect(() => {
    // Background ambient hum sound
    backgroundHumRef.current = new Audio();
    backgroundHumRef.current.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4P//////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDQAAAAAAAAAGw5MZMwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    backgroundHumRef.current.loop = true;
    backgroundHumRef.current.volume = 0.15;

    // Glitch sound effect
    glitchSoundRef.current = new Audio();
    glitchSoundRef.current.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAZIA19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19f/////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCQAAAAAAAAAGSjpxpPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxBMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxCMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    glitchSoundRef.current.volume = 0.25;

    // Command tick sound
    commandTickRef.current = new Audio();
    commandTickRef.current.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAABAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA/////////////////////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxAYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxB4AAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    commandTickRef.current.volume = 0.3;
    
    return () => {
      // Clean up on unmount
      if (backgroundHumRef.current) {
        backgroundHumRef.current.pause();
        backgroundHumRef.current = null;
      }
      
      if (glitchSoundRef.current) {
        glitchSoundRef.current = null;
      }
      
      if (commandTickRef.current) {
        commandTickRef.current = null;
      }
    };
  }, []);

  // Control background hum based on active state
  useEffect(() => {
    if (isActive && backgroundHumRef.current) {
      backgroundHumRef.current.play().catch(e => console.log("Audio play failed:", e));
    } else if (backgroundHumRef.current) {
      backgroundHumRef.current.pause();
    }
  }, [isActive]);

  // Function to play the glitch sound
  const playGlitchSound = () => {
    if (glitchSoundRef.current) {
      glitchSoundRef.current.currentTime = 0;
      glitchSoundRef.current.play().catch(e => console.log("Glitch sound play failed:", e));
    }
  };

  // Function to play the command tick sound
  const playCommandTick = () => {
    if (commandTickRef.current) {
      commandTickRef.current.currentTime = 0;
      commandTickRef.current.play().catch(e => console.log("Command tick sound play failed:", e));
    }
  };

  // Expose methods to window for external triggering
  useEffect(() => {
    if (isActive) {
      // @ts-ignore - Add to window for external access
      window.playHackerGlitchSound = playGlitchSound;
      // @ts-ignore - Add to window for external access
      window.playHackerCommandTick = playCommandTick;

      return () => {
        // @ts-ignore - Clean up
        delete window.playHackerGlitchSound;
        // @ts-ignore - Clean up
        delete window.playHackerCommandTick;
      };
    }
  }, [isActive]);

  // This component doesn't render anything visible
  return null;
};

export default HackerSoundEffects;
