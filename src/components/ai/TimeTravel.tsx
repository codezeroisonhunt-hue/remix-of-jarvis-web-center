
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface Timeline {
  id: string;
  name: string;
  probability: number;
  outcome: string;
}

const TimeTravel: React.FC = () => {
  const [timelines, setTimelines] = useState<Timeline[]>([
    {
      id: 'timeline-1',
      name: 'Alpha',
      probability: 82,
      outcome: 'Technological singularity achieved by 2040'
    },
    {
      id: 'timeline-2',
      name: 'Beta',
      probability: 47,
      outcome: 'Global climate stabilization by 2050'
    },
    {
      id: 'timeline-3',
      name: 'Gamma',
      probability: 23,
      outcome: 'Quantum communication network established'
    }
  ]);
  
  const [selectedTimeline, setSelectedTimeline] = useState<string>('timeline-1');
  const [simulating, setSimulating] = useState(false);
  
  const handleSimulate = () => {
    setSimulating(true);
    
    setTimeout(() => {
      // Generate a new random timeline
      const newTimeline: Timeline = {
        id: `timeline-${Date.now()}`,
        name: ['Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'][Math.floor(Math.random() * 5)],
        probability: Math.floor(Math.random() * 70) + 15,
        outcome: [
          'Decentralized autonomous governance established',
          'AI integration with human consciousness achieved',
          'Space colonization begins with Mars settlement',
          'New energy paradigm replaces fossil fuels completely',
          'Global neural network connects all human minds'
        ][Math.floor(Math.random() * 5)]
      };
      
      setTimelines(prev => [...prev, newTimeline]);
      setSimulating(false);
      
      toast('New Timeline Generated', {
        description: `Timeline ${newTimeline.name} has been simulated with ${newTimeline.probability}% probability.`
      });
    }, 2000);
  };
  
  const handleSelectTimeline = (id: string) => {
    setSelectedTimeline(id);
  };
  
  const selectedTimelineData = timelines.find(t => t.id === selectedTimeline) || timelines[0];

  return (
    <Card className="p-4 bg-black/50 border-jarvis/20">
      <h3 className="text-md font-medium text-jarvis mb-4">Time Travel Simulation</h3>
      
      <div className="space-y-3">
        <div className="bg-black/40 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Alternate Timelines</div>
          <div className="space-y-2 max-h-28 overflow-y-auto pr-2">
            {timelines.map(timeline => (
              <div 
                key={timeline.id}
                onClick={() => handleSelectTimeline(timeline.id)}
                className={`flex justify-between items-center p-1 rounded cursor-pointer ${
                  selectedTimeline === timeline.id ? 'bg-jarvis/20 text-jarvis' : 'hover:bg-black/60'
                }`}
              >
                <div>
                  <div className="text-sm">{timeline.name}</div>
                  <div className="text-xs text-gray-400">P={timeline.probability}%</div>
                </div>
                <div className={`w-1 h-7 rounded-full ${
                  timeline.probability > 70 ? 'bg-green-500' :
                  timeline.probability > 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Selected Timeline</div>
          <div className="text-md text-jarvis mb-1">Timeline {selectedTimelineData.name}</div>
          <div className="text-sm text-white">{selectedTimelineData.outcome}</div>
          <div className="mt-2 text-xs text-gray-400">
            Probability: <span className="text-jarvis">{selectedTimelineData.probability}%</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full text-jarvis border-jarvis/30 hover:bg-jarvis/10"
          disabled={simulating}
          onClick={handleSimulate}
        >
          {simulating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-jarvis" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Simulating...
            </span>
          ) : (
            'Generate New Timeline'
          )}
        </Button>
      </div>
    </Card>
  );
};

export default TimeTravel;
