
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import HackerModeWrapper from './chat/HackerModeWrapper';
import VoiceCommandIntegration from '@/features/VoiceCommandIntegration';
import { enhancedAIService } from '@/services/enhancedAIService';
import { toast } from '@/components/ui/sonner';

// Enhanced JarvisModeSwitcher to support new advanced features
const JarvisModeSwitcher = () => {
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [effectsContainer, setEffectsContainer] = useState<HTMLElement | null>(null);
  const [voiceCommandsActive, setVoiceCommandsActive] = useState(false);
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false);
  
  // Create a container for our effects
  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'jarvis-effects-container';
    document.body.appendChild(container);
    setEffectsContainer(container);
    
    return () => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);
  
  // Detect hacker mode by observing DOM changes
  useEffect(() => {
    // Function to check if hacker mode is active
    const checkHackerMode = () => {
      // Look for elements that suggest hacker mode is active
      const hackerModeElements = document.querySelectorAll('.hacker-mode-active, [data-hacker-mode="true"]');
      const terminalElements = document.querySelectorAll('[class*="terminal"], [class*="console"]');
      
      // Check if body has a class indicating hacker mode
      const bodyHasHackerClass = document.body.classList.contains('hacker-mode');
      
      const newHackerModeState = hackerModeElements.length > 0 || terminalElements.length > 0 || bodyHasHackerClass;
      
      if (newHackerModeState !== isHackerMode) {
        setIsHackerMode(newHackerModeState);
        
        // Enable advanced features when entering hacker mode
        if (newHackerModeState && !advancedFeaturesEnabled) {
          enableAdvancedFeatures();
        }
      }
    };
    
    // Initial check
    checkHackerMode();
    
    // Set up a mutation observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
      checkHackerMode();
    });
    
    // Observe document for changes in class attributes and child list
    observer.observe(document.body, { 
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class']
    });
    
    // Also check periodically
    const interval = setInterval(checkHackerMode, 1000);
    
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [isHackerMode, advancedFeaturesEnabled]);

  // Toggle voice commands when entering/exiting hacker mode
  useEffect(() => {
    setVoiceCommandsActive(isHackerMode);
  }, [isHackerMode]);
  
  // Enable advanced features when hacker mode is activated
  const enableAdvancedFeatures = () => {
    setAdvancedFeaturesEnabled(true);
    
    // Initialize core advanced AI systems
    enhancedAIService.activateEntity('quantum');
    
    toast("Advanced Features Enabled", {
      description: "Quantum AI system and enhanced capabilities activated"
    });
    
    // Schedule activation of Conscious Entity after a delay
    setTimeout(() => {
      enhancedAIService.activateEntity('conscious');
    }, 3000);
  };
  
  // If effects container is not ready, don't render anything
  if (!effectsContainer) return null;
  
  // Use portal to render our effects overlay
  return createPortal(
    <>
      <HackerModeWrapper isHackerMode={isHackerMode} />
      <VoiceCommandIntegration isActive={voiceCommandsActive} />
    </>,
    effectsContainer
  );
};

export default JarvisModeSwitcher;
