
import { useState, useEffect, useCallback } from 'react';
import { intelligenceCore } from '@/services/intelligenceCoreService';
import { missionEngine } from '@/services/missionEngineService';

export interface GhostAIOptions {
  autoActivate?: boolean;
  logLevel?: 'none' | 'minimal' | 'verbose';
  missionTypes?: string[];
  autoRunInterval?: number; // in ms, 0 to disable
}

export interface GhostAIState {
  isActive: boolean;
  lastActivity: Date | null;
  surveillanceActive: boolean;
  currentMissions: string[];
  detectedThreats: string[];
  patternRecognition: Record<string, number>;
}

export interface GhostAIReturn {
  state: GhostAIState;
  activate: () => void;
  deactivate: () => void;
  runSurveillance: (target: string) => Promise<any>;
  createMission: (name: string, description: string, target: string) => string;
  getMissionStatus: (id: string) => any;
  analyzePattern: (data: any) => Promise<any>;
}

export const useGhostAI = (options: GhostAIOptions = {}): GhostAIReturn => {
  const [state, setState] = useState<GhostAIState>({
    isActive: options.autoActivate || false,
    lastActivity: null,
    surveillanceActive: false,
    currentMissions: [],
    detectedThreats: [],
    patternRecognition: {},
  });

  // Auto-run surveillance if configured
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (state.isActive && options.autoRunInterval && options.autoRunInterval > 0) {
      interval = setInterval(() => {
        runSurveillance('auto-scan');
      }, options.autoRunInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive, options.autoRunInterval]);

  // Log state changes if verbose logging is enabled
  useEffect(() => {
    if (options.logLevel === 'verbose') {
      console.log('[GhostAI] State updated:', state);
    }
  }, [state, options.logLevel]);

  const activate = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      lastActivity: new Date()
    }));
    
    if (options.logLevel === 'verbose' || options.logLevel === 'minimal') {
      console.log('[GhostAI] Activated');
    }
  }, [options.logLevel]);

  const deactivate = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      surveillanceActive: false,
      lastActivity: new Date()
    }));
    
    if (options.logLevel === 'verbose' || options.logLevel === 'minimal') {
      console.log('[GhostAI] Deactivated');
    }
  }, [options.logLevel]);

  const runSurveillance = useCallback(async (target: string) => {
    if (!state.isActive) {
      if (options.logLevel === 'verbose') {
        console.warn('[GhostAI] Cannot run surveillance: Ghost AI is not active');
      }
      return null;
    }

    setState(prev => ({
      ...prev,
      surveillanceActive: true,
      lastActivity: new Date()
    }));

    try {
      // Call the Ghost Intelligence type
      const result = await intelligenceCore.processRequest({
        type: 'ghost',
        prompt: `Run surveillance on ${target}`,
        context: { target },
        stream: false
      });

      // Update state with any detected patterns/threats
      if (result.metadata?.patternConfidence > 0.7) {
        setState(prev => {
          const updatedPatterns = { ...prev.patternRecognition };
          
          // Add/update the recognized pattern
          if (result.metadata?.dataCollected) {
            result.metadata.dataCollected.forEach((type: string) => {
              updatedPatterns[type] = (updatedPatterns[type] || 0) + 1;
            });
          }
          
          return {
            ...prev,
            patternRecognition: updatedPatterns,
            lastActivity: new Date(),
            surveillanceActive: false
          };
        });
      }

      if (options.logLevel === 'verbose') {
        console.log('[GhostAI] Surveillance complete:', result);
      }

      return result;
    } catch (error) {
      console.error('[GhostAI] Surveillance error:', error);
      
      setState(prev => ({
        ...prev,
        surveillanceActive: false
      }));
      
      return null;
    }
  }, [state.isActive, options.logLevel]);

  const createMission = useCallback((name: string, description: string, target: string) => {
    if (!state.isActive) {
      if (options.logLevel === 'verbose') {
        console.warn('[GhostAI] Cannot create mission: Ghost AI is not active');
      }
      return '';
    }

    const mission = missionEngine.createMission({
      name,
      description,
      type: 'osint',
      priority: 'medium',
      target
    });

    setState(prev => ({
      ...prev,
      currentMissions: [...prev.currentMissions, mission.id],
      lastActivity: new Date()
    }));

    if (options.logLevel === 'verbose') {
      console.log('[GhostAI] Mission created:', mission);
    }

    // Auto-start the mission
    missionEngine.startMission(mission.id);

    return mission.id;
  }, [state.isActive, options.logLevel]);

  const getMissionStatus = useCallback((id: string) => {
    return missionEngine.getMission(id);
  }, []);

  const analyzePattern = useCallback(async (data: any) => {
    if (!state.isActive) {
      if (options.logLevel === 'verbose') {
        console.warn('[GhostAI] Cannot analyze pattern: Ghost AI is not active');
      }
      return null;
    }

    try {
      const result = await intelligenceCore.processRequest({
        type: 'ghost',
        prompt: 'Analyze pattern in the provided data',
        context: { data },
        stream: false
      });

      if (options.logLevel === 'verbose') {
        console.log('[GhostAI] Pattern analysis complete:', result);
      }

      return result;
    } catch (error) {
      console.error('[GhostAI] Pattern analysis error:', error);
      return null;
    }
  }, [state.isActive, options.logLevel]);

  return {
    state,
    activate,
    deactivate,
    runSurveillance,
    createMission,
    getMissionStatus,
    analyzePattern
  };
};

// Example usage:
// const ghostAI = useGhostAI({ autoActivate: true, logLevel: 'verbose' });
// ghostAI.runSurveillance('network-traffic');
