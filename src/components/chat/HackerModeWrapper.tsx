
import { useEffect } from 'react';
import HackerModeIntegration from './HackerModeIntegration';

// This component will be used alongside the existing HackerMode.tsx
// without modifying the original file
const HackerModeWrapper = ({ isHackerMode }: { isHackerMode: boolean }) => {
  // Portal to add our effects to the main application
  useEffect(() => {
    // Create a container for our enhanced hacker mode effects
    const effectsContainer = document.createElement('div');
    effectsContainer.id = 'hacker-mode-effects-container';
    effectsContainer.style.position = 'absolute';
    effectsContainer.style.top = '0';
    effectsContainer.style.left = '0';
    effectsContainer.style.width = '100%';
    effectsContainer.style.height = '100%';
    effectsContainer.style.pointerEvents = 'none';
    effectsContainer.style.zIndex = '1000';
    
    // Add the container to the body
    document.body.appendChild(effectsContainer);
    
    // Cleanup function
    return () => {
      document.body.removeChild(effectsContainer);
    };
  }, []);
  
  // This component doesn't render anything directly - it just sets up the effects
  return <HackerModeIntegration isHackerMode={isHackerMode} />;
};

export default HackerModeWrapper;
