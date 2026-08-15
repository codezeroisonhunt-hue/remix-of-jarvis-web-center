
import React, { useEffect, useState } from 'react';
import EnhancedHackerMode from './EnhancedHackerMode';
import { HackerEffectsProvider } from '../../contexts/HackerEffectsContext';

interface HackerModeIntegrationProps {
  isHackerMode: boolean;
}

const HackerModeIntegration = ({ isHackerMode }: HackerModeIntegrationProps) => {
  const [terminalText, setTerminalText] = useState<string>('');
  const [transitionActive, setTransitionActive] = useState<boolean>(false);

  // Handle mode transition effects
  useEffect(() => {
    if (isHackerMode) {
      setTransitionActive(true);
      setTerminalText('> Initializing JARVIS Terminal...\n> Loading security protocols...\n> Access granted. Terminal ready.');
    } else {
      setTransitionActive(false);
      setTerminalText('');
    }
  }, [isHackerMode]);

  return (
    <HackerEffectsProvider>
      <EnhancedHackerMode 
        isActive={isHackerMode || transitionActive} 
        terminalText={terminalText}
      />
    </HackerEffectsProvider>
  );
};

export default HackerModeIntegration;
