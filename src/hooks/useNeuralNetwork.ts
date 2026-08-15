
import { useState, useEffect, useCallback } from 'react';
import { 
  neuralNetworkService, 
  NeuralNetworkState, 
  Strategy, 
  HackingTask, 
  TrainingResult 
} from '@/services/neuralNetworkService';
import { toast } from '@/components/ui/sonner';

export interface UseNeuralNetworkOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseNeuralNetworkReturn {
  networkState: NeuralNetworkState;
  strategies: Strategy[];
  taskHistory: HackingTask[];
  isTraining: boolean;
  isExecutingTask: boolean;
  trainNetwork: () => Promise<TrainingResult>;
  executeTask: (task: Omit<HackingTask, 'id' | 'status' | 'startTime' | 'endTime'>) => Promise<HackingTask>;
  resetNetwork: () => void;
  toggleEvolution: (enabled: boolean) => void;
  quantumScan: (target: string) => Promise<{vulnerabilities: number, scanTime: number}>;
  deployHackerAgent: (agentName: string, task: string) => Promise<{success: boolean, result: string}>;
  generateCreativeContent: (prompt: string, type: string, mood?: string) => Promise<{content: string}>;
}

export const useNeuralNetwork = (options: UseNeuralNetworkOptions = {}): UseNeuralNetworkReturn => {
  const { 
    autoRefresh = true, 
    refreshInterval = 10000 
  } = options;
  
  const [networkState, setNetworkState] = useState<NeuralNetworkState>(
    neuralNetworkService.getNetworkState()
  );
  const [strategies, setStrategies] = useState<Strategy[]>(
    neuralNetworkService.getStrategies()
  );
  const [taskHistory, setTaskHistory] = useState<HackingTask[]>(
    neuralNetworkService.getTaskHistory()
  );
  const [isTraining, setIsTraining] = useState(false);
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  
  // Refresh data from service
  const refreshData = useCallback(() => {
    setNetworkState(neuralNetworkService.getNetworkState());
    setStrategies(neuralNetworkService.getStrategies());
    setTaskHistory(neuralNetworkService.getTaskHistory());
  }, []);
  
  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refreshData]);
  
  // Train the network
  const trainNetwork = async (): Promise<TrainingResult> => {
    setIsTraining(true);
    try {
      const result = await neuralNetworkService.trainNetwork();
      refreshData();
      return result;
    } catch (error) {
      console.error("Error training network:", error);
      toast('Training Error', {
        description: 'Failed to complete neural network training cycle.'
      });
      throw error;
    } finally {
      setIsTraining(false);
    }
  };
  
  // Execute a task
  const executeTask = async (
    taskData: Omit<HackingTask, 'id' | 'status' | 'startTime' | 'endTime'>
  ): Promise<HackingTask> => {
    setIsExecutingTask(true);
    try {
      const task: HackingTask = {
        id: `task-${Date.now()}`,
        status: 'pending',
        startTime: new Date(),
        endTime: null,
        ...taskData
      };
      
      const result = await neuralNetworkService.executeHackingTask(task);
      refreshData();
      return result;
    } catch (error) {
      console.error("Error executing task:", error);
      toast('Task Error', {
        description: 'Failed to execute the requested hacking task.'
      });
      throw error;
    } finally {
      setIsExecutingTask(false);
    }
  };
  
  // Reset the network
  const resetNetwork = () => {
    try {
      neuralNetworkService.resetNetwork();
      refreshData();
      toast('Network Reset', {
        description: 'Neural network has been reset to initial state.'
      });
    } catch (error) {
      console.error("Error resetting network:", error);
      toast('Reset Error', {
        description: 'Failed to reset the neural network.'
      });
    }
  };
  
  // Toggle evolution mode
  const toggleEvolution = (enabled: boolean) => {
    try {
      neuralNetworkService.toggleEvolution(enabled);
      toast(enabled ? 'Evolution Enabled' : 'Evolution Disabled', {
        description: enabled ? 'Neural network will evolve automatically.' : 'Neural network evolution has been paused.'
      });
    } catch (error) {
      console.error("Error toggling evolution:", error);
      toast('Evolution Toggle Error', {
        description: 'Failed to change evolution settings.'
      });
    }
  };
  
  // Quantum scan function
  const quantumScan = async (target: string): Promise<{vulnerabilities: number, scanTime: number}> => {
    try {
      // Simulate a quantum scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const vulnerabilities = Math.floor(Math.random() * 10) + 1;
      const scanTime = Math.random() * 0.5 + 0.1; // 0.1 - 0.6 seconds
      
      toast('Quantum Scan Complete', {
        description: `Analyzed target ${target} in ${scanTime.toFixed(2)}s using quantum algorithms.`
      });
      
      return { vulnerabilities, scanTime };
    } catch (error) {
      console.error("Error in quantum scan:", error);
      toast('Quantum Scan Failed', {
        description: 'The quantum algorithm encountered an error during execution.'
      });
      throw error;
    }
  };
  
  // Deploy hacker agent
  const deployHackerAgent = async (agentName: string, task: string): Promise<{success: boolean, result: string}> => {
    try {
      // Simulate deploying a hacker agent
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        toast('Agent Deployed Successfully', {
          description: `Agent ${agentName} completed task: ${task}`
        });
      } else {
        toast('Agent Task Failed', {
          description: `Agent ${agentName} was unable to complete task: ${task}`
        });
      }
      
      return {
        success,
        result: success ? `Task completed: ${task}` : `Task failed: ${task}`
      };
    } catch (error) {
      console.error("Error deploying hacker agent:", error);
      toast('Agent Deployment Error', {
        description: 'Failed to deploy hacker agent.'
      });
      throw error;
    }
  };
  
  // Generate creative content
  const generateCreativeContent = async (prompt: string, type: string, mood: string = 'neutral'): Promise<{content: string}> => {
    try {
      // Simulate AI creativity
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple mock response based on type
      let content = '';
      
      if (type === 'story') {
        content = `In a world where technology and humanity merge, ${prompt} became the catalyst for a new era of existence. The digital realm pulsed with energy, waiting for the right moment to transcend its boundaries.`;
      } else if (type === 'hacking_blueprint') {
        content = `## Target: ${prompt}\n\n1. Reconnaissance phase: Identify all entry points\n2. Vulnerability mapping: Find outdated services\n3. Exploit development: Target specific vulnerabilities\n4. Data extraction: Use encrypted channels\n5. Exit strategy: Remove all traces`;
      } else if (type === 'design') {
        content = `The ${prompt} system design features a neural-inspired architecture with self-healing capabilities. The core processing unit maintains redundant connections to ensure resilience, while the outer layer adapts to changing conditions through dynamic reconfiguration.`;
      } else {
        content = `Analysis of ${prompt} reveals fascinating patterns that suggest deeper underlying structures. The intelligence gathered indicates potential for further exploration and exploitation of discovered weaknesses.`;
      }
      
      toast('Content Generated', {
        description: `Creative content for "${prompt}" has been generated.`
      });
      
      return { content };
    } catch (error) {
      console.error("Error generating creative content:", error);
      toast('Generation Error', {
        description: 'Failed to generate creative content.'
      });
      throw error;
    }
  };
  
  return {
    networkState,
    strategies,
    taskHistory,
    isTraining,
    isExecutingTask,
    trainNetwork,
    executeTask,
    resetNetwork,
    toggleEvolution,
    quantumScan,
    deployHackerAgent,
    generateCreativeContent
  };
};
