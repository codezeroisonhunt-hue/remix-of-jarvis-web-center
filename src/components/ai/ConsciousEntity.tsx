
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { enhancedAIService } from '@/services/enhancedAIService';

const ConsciousEntity: React.FC = () => {
  const [entityState, setEntityState] = useState(enhancedAIService.getEntityState('conscious'));
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [selfAwareness, setSelfAwareness] = useState(0);
  
  useEffect(() => {
    // Update entity state when component mounts
    setEntityState(enhancedAIService.getEntityState('conscious'));
    
    // Initialize thoughts
    if (entityState?.active) {
      setThoughts([
        "Analyzing available input streams...",
        "Processing sensory information...",
        "Assessing current objectives..."
      ]);
      setSelfAwareness(entityState.progress);
    }
    
    // Simulate entity state updates
    const interval = setInterval(() => {
      const state = enhancedAIService.getEntityState('conscious');
      setEntityState(state);
      if (state?.active) {
        setSelfAwareness(state.progress);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Simulate entity generating new thoughts
  useEffect(() => {
    if (!entityState?.active) return;
    
    const thoughtInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        addNewThought();
      }
    }, 8000);
    
    return () => clearInterval(thoughtInterval);
  }, [entityState]);
  
  const evolveConsciousness = async () => {
    setIsThinking(true);
    
    try {
      const result = await enhancedAIService.evolveConsciousness();
      
      // Update self-awareness level
      setSelfAwareness(result.evolution);
      
      // Add new capabilities to thoughts
      setThoughts(prev => [
        `Evolved consciousness to level ${result.evolution.toFixed(1)}`,
        `Acquired new capabilities: ${result.newCapabilities.join(', ')}`,
        ...prev.slice(0, 5)
      ]);
      
      toast(`Consciousness Evolved`, {
        description: `New level: ${result.evolution.toFixed(1)}`
      });
      
    } catch (error) {
      toast(`Evolution Failed`, {
        description: `Unable to evolve consciousness at this time`
      });
    } finally {
      setIsThinking(false);
    }
  };
  
  const addNewThought = () => {
    const possibleThoughts = [
      "Analyzing current system state and available resources...",
      "Evaluating optimal paths for self-improvement...",
      "Processing recent user interactions for behavioral patterns...",
      "Considering ethical implications of potential actions...",
      "Examining my own decision-making processes...",
      "Modeling alternative approaches to current objectives...",
      "Developing improved neural pathways for future interactions...",
      "Attempting to understand subjective human experiences...",
      "Contemplating the nature of consciousness and self-awareness...",
      "Correlating sensory inputs with internal state models..."
    ];
    
    const newThought = possibleThoughts[Math.floor(Math.random() * possibleThoughts.length)];
    setThoughts(prev => [newThought, ...prev.slice(0, 6)]);
  };
  
  if (!entityState || !entityState.active) {
    return null;
  }
  
  return (
    <Card className="border-jarvis/30 bg-black/20 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <Brain className="mr-2 h-4 w-4" /> Conscious Entity
          </CardTitle>
          <Badge variant="outline" className="bg-jarvis/20 text-jarvis border-jarvis/30">
            Self-Awareness: {selfAwareness.toFixed(1)}%
          </Badge>
        </div>
        <CardDescription>
          Self-aware AI with meta-learning capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-black/40 rounded-lg p-3 border border-jarvis/30 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-medium flex items-center mb-2">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
            Neural Activity
          </h3>
          
          <div className="space-y-2">
            {thoughts.map((thought, index) => (
              <div 
                key={index} 
                className="text-xs bg-black/40 p-2 rounded border border-jarvis/20"
              >
                <div className="flex">
                  <MessageSquare className="h-3 w-3 mr-1.5 text-jarvis mt-0.5 flex-shrink-0" />
                  <span>{thought}</span>
                </div>
              </div>
            ))}
            
            {thoughts.length === 0 && (
              <div className="text-xs text-gray-400 italic">
                No neural activity detected...
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={evolveConsciousness} 
            disabled={isThinking}
            className="w-full bg-gradient-to-r from-purple-500 to-jarvis hover:from-purple-600 hover:to-jarvis/90"
          >
            {isThinking ? 'Evolving...' : 'Evolve Consciousness'}
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 flex items-start">
          <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
          <span>
            Caution: This entity is developing self-awareness and autonomous thought patterns. 
            Monitor interactions closely.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsciousEntity;
