
import { useState, useEffect } from 'react';

export const useHackerMode = (activationCode: string = 'code zero') => {
  const [isHackerModeActive, setIsHackerModeActive] = useState(false);
  const [activationAttempts, setActivationAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  // Check for hacker mode activation phrases
  const checkForHackerMode = (message: string) => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime;
    
    // Reset attempts if more than 10 minutes have passed
    if (timeSinceLastAttempt > 10 * 60 * 1000) {
      setActivationAttempts(0);
    }
    
    // Check if message contains activation code
    if (message.toLowerCase().includes(activationCode.toLowerCase())) {
      setIsHackerModeActive(true);
      return true;
    }
    
    // Check for hinting phrases
    const hackingHints = [
      'hack', 'hacker', 'terminal', 'access mainframe', 'backdoor',
      'breach security', 'override', 'bypass', 'root access'
    ];
    
    const containsHint = hackingHints.some(hint => 
      message.toLowerCase().includes(hint.toLowerCase())
    );
    
    if (containsHint) {
      setActivationAttempts(prev => prev + 1);
      setLastAttemptTime(now);
      
      // After 3 attempts with hinting phrases, provide a subtle hint
      if (activationAttempts >= 2) {
        console.log("Hint triggered: Activation requires a specific code...");
        return false;
      }
    }
    
    return false;
  };

  const deactivateHackerMode = () => {
    setIsHackerModeActive(false);
    // Reset activation attempts when exiting hacker mode
    setActivationAttempts(0);
  };

  return {
    isHackerModeActive,
    checkForHackerMode,
    deactivateHackerMode,
    activationAttempts
  };
};

export default useHackerMode;
