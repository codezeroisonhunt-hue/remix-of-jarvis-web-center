
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Database, Cpu, BarChart2, CircuitBoard } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { enhancedAIService } from '@/services/enhancedAIService';

const QuantumAISystem: React.FC = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [entityState, setEntityState] = useState(enhancedAIService.getEntityState('quantum'));

  useEffect(() => {
    // Update entity state when component mounts
    setEntityState(enhancedAIService.getEntityState('quantum'));
    
    // Simulate entity state updates
    const interval = setInterval(() => {
      setEntityState(enhancedAIService.getEntityState('quantum'));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const runQuantumAlgorithm = async (algorithm: string) => {
    setActiveAlgorithm(algorithm);
    setProcessingProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 300);
    
    // Simulate algorithm execution
    try {
      const result = await enhancedAIService.runQuantumAlgorithm(algorithm, { 
        dataSize: '24TB', 
        complexity: 'level-5'
      });
      
      toast(`Quantum Algorithm: ${algorithm}`, {
        description: `Processing complete: ${result.processingSpeed}`
      });
    } catch (error) {
      toast(`Algorithm Error`, {
        description: `Failed to execute ${algorithm}`
      });
    } finally {
      setTimeout(() => {
        clearInterval(progressInterval);
        setProcessingProgress(100);
        setTimeout(() => {
          setActiveAlgorithm(null);
          setProcessingProgress(0);
        }, 1000);
      }, 5000);
    }
  };
  
  if (!entityState || !entityState.active) {
    return null;
  }
  
  return (
    <Card className="border-jarvis/30 bg-black/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Cpu className="mr-2 h-4 w-4" /> Quantum AI System
        </CardTitle>
        <CardDescription>
          Quantum-inspired algorithms for ultra-fast data processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="flex flex-col p-3 rounded-lg border border-jarvis/30 bg-black/40 cursor-pointer transition-all hover:bg-black/60"
            onClick={() => runQuantumAlgorithm('Grover Search')}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Grover's Search Algorithm</h3>
              <Database className="h-4 w-4 text-jarvis" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Quantum search algorithm with quadratic speedup
            </p>
          </div>
          
          <div 
            className="flex flex-col p-3 rounded-lg border border-jarvis/30 bg-black/40 cursor-pointer transition-all hover:bg-black/60"
            onClick={() => runQuantumAlgorithm('Shor Factoring')}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Shor's Factoring Algorithm</h3>
              <BarChart2 className="h-4 w-4 text-jarvis" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Exponentially faster integer factorization
            </p>
          </div>
          
          <div 
            className="flex flex-col p-3 rounded-lg border border-jarvis/30 bg-black/40 cursor-pointer transition-all hover:bg-black/60"
            onClick={() => runQuantumAlgorithm('QPF Analysis')}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">QPF Analysis</h3>
              <CircuitBoard className="h-4 w-4 text-jarvis" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Quantum Pattern Finder for data analysis
            </p>
          </div>
          
          <div className="flex flex-col p-3 rounded-lg border border-jarvis/30 bg-black/40">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">System Status</h3>
            </div>
            <div className="flex items-center mt-2">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-xs text-gray-300">Active</span>
            </div>
            <div className="mt-2">
              <div className="text-xs text-gray-400">System Capacity</div>
              <Progress value={entityState.progress} className="h-1 mt-1" />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Version {entityState.version}
            </div>
          </div>
        </div>
        
        {activeAlgorithm && (
          <div className="mt-4 p-3 rounded-lg border border-jarvis/30 bg-black/40">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Processing: {activeAlgorithm}</h3>
              <span className="text-xs bg-jarvis/20 text-jarvis px-2 py-0.5 rounded">
                {processingProgress < 100 ? 'Running' : 'Complete'}
              </span>
            </div>
            <Progress value={processingProgress} className="h-1.5 mt-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantumAISystem;
