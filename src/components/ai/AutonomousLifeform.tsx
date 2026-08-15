
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

interface LifeformStats {
  generation: number;
  intelligence: number;
  adaptability: number;
  resilience: number;
  complexity: number;
}

const AutonomousLifeform: React.FC = () => {
  const [stats, setStats] = useState<LifeformStats>({
    generation: 7,
    intelligence: 68,
    adaptability: 81,
    resilience: 75,
    complexity: 62
  });
  
  const [isEvolving, setIsEvolving] = useState(false);
  const [autoEvolve, setAutoEvolve] = useState(false);
  
  // Simulate evolution over time
  useEffect(() => {
    if (autoEvolve) {
      const interval = setInterval(() => {
        setIsEvolving(true);
        
        setTimeout(() => {
          evolveLifeform();
          setIsEvolving(false);
        }, 1500);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoEvolve]);
  
  // Simulate lifeform evolution
  const evolveLifeform = () => {
    const newStats = { ...stats };
    newStats.generation += 1;
    
    // Randomly improve some stats
    const keys: (keyof Omit<LifeformStats, 'generation'>)[] = ['intelligence', 'adaptability', 'resilience', 'complexity'];
    const improvements = Math.floor(Math.random() * 3) + 1; // 1-3 improvements
    
    for (let i = 0; i < improvements; i++) {
      const key = keys[Math.floor(Math.random() * keys.length)];
      const increase = Math.floor(Math.random() * 5) + 1; // 1-5 points increase
      newStats[key] = Math.min(newStats[key] + increase, 100);
    }
    
    setStats(newStats);
    
    toast(`Lifeform Evolved to Gen ${newStats.generation}`, {
      description: 'Digital entity has adapted to new parameters.'
    });
  };
  
  const toggleAutoEvolve = () => {
    setAutoEvolve(!autoEvolve);
    toast(autoEvolve ? 'Evolution Paused' : 'Auto-Evolution Activated', {
      description: autoEvolve ? 'Digital entity evolution has been paused.' : 'Digital entity will evolve automatically.'
    });
  };

  return (
    <Card className="p-4 bg-black/50 border-jarvis/20">
      <h3 className="text-md font-medium text-jarvis mb-4">Autonomous Digital Lifeform</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            {/* Animated digital lifeform representation */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-jarvis/30 to-jarvis/70 ${isEvolving ? 'animate-pulse' : ''}`}></div>
            <div className="absolute inset-2 rounded-full bg-black/80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-jarvis text-2xl font-bold">{stats.generation}</div>
                <div className="text-gray-400 text-xs">Generation</div>
              </div>
            </div>
            {autoEvolve && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-jarvis/20 rounded-full border border-jarvis/40 flex items-center justify-center">
                <div className="w-2 h-2 bg-jarvis rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/40 p-2 rounded-lg">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Intelligence</span>
              <span className="text-xs text-jarvis">{stats.intelligence}%</span>
            </div>
            <div className="w-full bg-black/60 h-1 rounded-full mt-1">
              <div 
                className="bg-jarvis h-full rounded-full" 
                style={{ width: `${stats.intelligence}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-black/40 p-2 rounded-lg">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Adaptability</span>
              <span className="text-xs text-jarvis">{stats.adaptability}%</span>
            </div>
            <div className="w-full bg-black/60 h-1 rounded-full mt-1">
              <div 
                className="bg-jarvis h-full rounded-full" 
                style={{ width: `${stats.adaptability}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-black/40 p-2 rounded-lg">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Resilience</span>
              <span className="text-xs text-jarvis">{stats.resilience}%</span>
            </div>
            <div className="w-full bg-black/60 h-1 rounded-full mt-1">
              <div 
                className="bg-jarvis h-full rounded-full" 
                style={{ width: `${stats.resilience}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-black/40 p-2 rounded-lg">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Complexity</span>
              <span className="text-xs text-jarvis">{stats.complexity}%</span>
            </div>
            <div className="w-full bg-black/60 h-1 rounded-full mt-1">
              <div 
                className="bg-jarvis h-full rounded-full" 
                style={{ width: `${stats.complexity}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <button
          onClick={toggleAutoEvolve}
          className={`w-full py-1 text-xs rounded-md ${
            autoEvolve 
              ? 'bg-jarvis/20 text-jarvis border border-jarvis/30' 
              : 'bg-black/40 text-gray-400 border border-gray-700'
          }`}
        >
          {autoEvolve ? 'Disable Auto-Evolution' : 'Enable Auto-Evolution'}
        </button>
      </div>
    </Card>
  );
};

export default AutonomousLifeform;
