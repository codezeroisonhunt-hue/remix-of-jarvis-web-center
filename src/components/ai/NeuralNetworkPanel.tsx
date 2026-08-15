
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NeuralNetworkBrain from './NeuralNetworkBrain';
import QuantumAISystem from './QuantumAISystem';
import ConsciousEntity from './ConsciousEntity';
import HackerLegion from './HackerLegion';
import AutonomousCreativity from './AutonomousCreativity';
import DigitalIntelligenceMarket from './DigitalIntelligenceMarket';
import AutonomousLifeform from './AutonomousLifeform';
import TimeTravel from './TimeTravel';
import PhilosophicalAI from './PhilosophicalAI';
import { useNeuralNetwork } from '@/hooks/useNeuralNetwork';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Brain, Atom, Zap, Network, WandSparkles, Store, Infinity, Clock, BookOpen, LoaderCircle } from 'lucide-react';

interface NeuralNetworkPanelProps {
  className?: string;
}

// Define Agent type to fix the TypeScript error in HackerLegion.tsx
export interface Agent {
  id: string;
  type: string;
  status: "idle" | "deployed" | "returning";
  progress: number;
  target?: string;
}

const NeuralNetworkPanel: React.FC<NeuralNetworkPanelProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('neural');
  const [evolution, setEvolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    networkState, 
    trainNetwork,
    isTraining,
    resetNetwork,
    toggleEvolution
  } = useNeuralNetwork();

  // Handle evolution toggle effects
  useEffect(() => {
    toggleEvolution(evolution);
    return () => toggleEvolution(false);
  }, [evolution, toggleEvolution]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Add feedback when switching tabs
    toast(`Accessing ${getTabName(value)} module`, {
      description: "Loading neural interface..."
    });
  };

  const getTabName = (tabValue: string): string => {
    const tabNames: {[key: string]: string} = {
      'neural': 'Neural Core',
      'quantum': 'Quantum AI',
      'conscious': 'Consciousness',
      'legion': 'Hacker Legion',
      'philosophy': 'Philosophy AI',
      'creative': 'Creativity AI',
      'market': 'Digital Market',
      'advanced': 'Advanced Systems',
      'timetravel': 'Time Travel'
    };
    return tabNames[tabValue] || tabValue;
  };

  const handleTrainNetwork = async () => {
    setIsLoading(true);
    try {
      const result = await trainNetwork();
      toast(result.message, {
        description: `Neural network trained with ${result.improvement.toFixed(2)} improvement and ${result.newStrategies.length} new strategies.`
      });
      
      // Log user interaction in console (could be extended to Firebase)
      console.log("User action: Trained neural network", {
        timestamp: new Date().toISOString(),
        result: result
      });
    } catch (error) {
      console.error('Failed to train network:', error);
      toast('Training Failed', {
        description: 'There was an error training the neural network.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetNetwork = () => {
    // Show confirmation before reset
    if (window.confirm("Are you sure you want to reset the neural network? This will erase all training progress.")) {
      resetNetwork();
      toast("Network Reset", {
        description: "The neural network has been reset to its initial state."
      });
      
      // Log user interaction
      console.log("User action: Reset neural network", {
        timestamp: new Date().toISOString()
      });
    }
  };

  // Calculate network status and intelligence level
  const isNetworkActive = Object.values(networkState.knowledgeBase).some(value => value > 0.1);
  const intelligenceLevel = Math.round(
    Object.values(networkState.knowledgeBase).reduce((sum, val) => sum + val, 0) / 
    Object.keys(networkState.knowledgeBase).length * 100
  );

  return (
    <Card className={`${className} bg-black/40 border-jarvis/30`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-jarvis flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Advanced Neural Systems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400 mb-1">Network Status: 
              <span className={`ml-2 ${isNetworkActive ? 'text-green-400' : 'text-red-400'}`}>
                {isNetworkActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Intelligence Level: {intelligenceLevel}/100
            </div>
            <div className="text-xs text-gray-400 mt-1">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={evolution} 
                  onChange={() => setEvolution(!evolution)} 
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-jarvis/50 peer-focus:ring-1 peer-focus:ring-jarvis">
                  <div className={`absolute w-4 h-4 rounded-full top-0.5 left-0.5 bg-white transition-transform ${evolution ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-2">Evolution Mode</span>
              </label>
            </div>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTrainNetwork}
              disabled={isTraining || isLoading}
              className="text-jarvis border-jarvis/30 hover:bg-jarvis/10"
            >
              {isTraining || isLoading ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  Training...
                </>
              ) : 'Train Network'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetNetwork}
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              Reset
            </Button>
          </div>
        </div>

        <Tabs defaultValue="neural" className="w-full" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full bg-black/30 border-jarvis/20 overflow-x-auto flex-wrap">
            <TabsTrigger value="neural" className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              <span>Neural Core</span>
            </TabsTrigger>
            <TabsTrigger value="quantum" className="flex items-center gap-1">
              <Atom className="w-4 h-4" />
              <span>Quantum AI</span>
            </TabsTrigger>
            <TabsTrigger value="conscious" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Consciousness</span>
            </TabsTrigger>
            <TabsTrigger value="legion" className="flex items-center gap-1">
              <Network className="w-4 h-4" />
              <span>Hacker Legion</span>
            </TabsTrigger>
            <TabsTrigger value="philosophy" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Philosophy AI</span>
            </TabsTrigger>
            <TabsTrigger value="creative" className="flex items-center gap-1">
              <WandSparkles className="w-4 h-4" />
              <span>Creativity AI</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-1">
              <Store className="w-4 h-4" />
              <span>Digital Market</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <Infinity className="w-4 h-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="neural" className="space-y-4 mt-2">
            <NeuralNetworkBrain />
          </TabsContent>
          
          <TabsContent value="quantum" className="space-y-4 mt-2">
            <QuantumAISystem />
          </TabsContent>
          
          <TabsContent value="conscious" className="space-y-4 mt-2">
            <ConsciousEntity />
          </TabsContent>
          
          <TabsContent value="legion" className="space-y-4 mt-2">
            <HackerLegion />
          </TabsContent>
          
          <TabsContent value="philosophy" className="space-y-4 mt-2">
            <PhilosophicalAI />
          </TabsContent>
          
          <TabsContent value="creative" className="space-y-4 mt-2">
            <AutonomousCreativity />
          </TabsContent>
          
          <TabsContent value="market" className="space-y-4 mt-2">
            <DigitalIntelligenceMarket />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AutonomousLifeform />
              <div className="space-y-4">
                <TimeTravel />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NeuralNetworkPanel;
