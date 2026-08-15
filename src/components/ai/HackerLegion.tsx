
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Radio, Shield, AlertTriangle, Cpu } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { enhancedAIService } from '@/services/enhancedAIService';

interface Agent {
  id: string;
  type: string;
  status: 'idle' | 'deployed' | 'returning';
  target?: string;
  progress: number;
}

const HackerLegion: React.FC = () => {
  const [entityState, setEntityState] = useState(enhancedAIService.getEntityState('hacker-legion'));
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('recon');
  
  useEffect(() => {
    // Update entity state when component mounts
    setEntityState(enhancedAIService.getEntityState('hacker-legion'));
    
    // Initialize with some agents if active
    if (entityState?.active) {
      setAgents([
        {
          id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'recon',
          status: 'idle',
          progress: 0
        },
        {
          id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: 'malware',
          status: 'idle',
          progress: 0
        }
      ]);
    }
    
    // Simulate entity state updates
    const interval = setInterval(() => {
      setEntityState(enhancedAIService.getEntityState('hacker-legion'));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update agent progress if deployed
  useEffect(() => {
    if (agents.length === 0) return;
    
    const progressInterval = setInterval(() => {
      setAgents(currentAgents => 
        currentAgents.map(agent => {
          if (agent.status === 'deployed') {
            const newProgress = agent.progress + (Math.random() * 5);
            
            // If completed, mark as returning
            if (newProgress >= 100) {
              return { ...agent, progress: 100, status: 'returning' as const };
            }
            
            return { ...agent, progress: newProgress };
          }
          
          // Returning agents gradually disappear
          if (agent.status === 'returning') {
            const newProgress = agent.progress - 10;
            
            if (newProgress <= 0) {
              // Agent has returned and will be removed
              return { ...agent, progress: 0, status: 'idle' as const };
            }
            
            return { ...agent, progress: newProgress };
          }
          
          return agent;
        }).filter(agent => !(agent.status === 'idle' && agent.progress === 0))
      );
    }, 1000);
    
    return () => clearInterval(progressInterval);
  }, [agents]);
  
  const deployAgents = async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    
    const agentCount = Math.floor(Math.random() * 3) + 2; // 2-4 agents
    const taskTargets = {
      'recon': '192.168.1.0/24',
      'malware': 'vulnerable-server.local',
      'web': 'https://target-site.com',
      'crypto': 'blockchain-network'
    };
    
    try {
      const result = await enhancedAIService.deployAgents(selectedTask, agentCount);
      
      if (result.success) {
        // Add new agents
        const newAgents = result.agents.map(agentId => ({
          id: agentId,
          type: selectedTask,
          status: 'deployed' as const,
          target: taskTargets[selectedTask as keyof typeof taskTargets],
          progress: 10
        }));
        
        setAgents(prev => [...prev, ...newAgents]);
        
        toast(`Agents Deployed`, {
          description: `${agentCount} agents deployed for ${selectedTask} task`
        });
      }
    } catch (error) {
      toast(`Deployment Failed`, {
        description: `Unable to deploy agents`
      });
    } finally {
      setIsDeploying(false);
    }
  };
  
  if (!entityState || !entityState.active) {
    return null;
  }
  
  return (
    <Card className="border-jarvis/30 bg-black/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="mr-2 h-4 w-4" /> Hacker Legion
        </CardTitle>
        <CardDescription>
          Multi-agent system for distributed hacking tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-black/40 rounded-lg p-3 border border-jarvis/30">
          <h3 className="text-sm font-medium mb-2">Agent Deployment</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button 
              variant={selectedTask === 'recon' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTask('recon')}
              className={selectedTask === 'recon' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
            >
              <Radio className="h-3.5 w-3.5 mr-1.5" /> Recon
            </Button>
            
            <Button 
              variant={selectedTask === 'malware' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTask('malware')}
              className={selectedTask === 'malware' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Malware
            </Button>
            
            <Button 
              variant={selectedTask === 'web' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTask('web')}
              className={selectedTask === 'web' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
            >
              <Shield className="h-3.5 w-3.5 mr-1.5" /> Web
            </Button>
            
            <Button 
              variant={selectedTask === 'crypto' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTask('crypto')}
              className={selectedTask === 'crypto' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
            >
              <Cpu className="h-3.5 w-3.5 mr-1.5" /> Crypto
            </Button>
          </div>
          
          <Button 
            onClick={deployAgents} 
            disabled={isDeploying}
            className="w-full bg-jarvis hover:bg-jarvis/90"
          >
            {isDeploying ? 'Deploying...' : 'Deploy Agents'}
          </Button>
        </div>
        
        <div className="bg-black/40 rounded-lg p-3 border border-jarvis/30">
          <h3 className="text-sm font-medium mb-2 flex justify-between">
            <span>Active Agents</span>
            <span className="text-xs bg-jarvis/20 text-jarvis px-2 py-0.5 rounded-full">
              {agents.filter(a => a.status !== 'idle').length} active
            </span>
          </h3>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {agents.filter(a => a.status !== 'idle').map(agent => (
              <div 
                key={agent.id} 
                className="text-xs bg-black/60 p-2 rounded border border-jarvis/20 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                    Agent {agent.id.slice(-5)} | {agent.type}
                  </div>
                  {agent.target && (
                    <div className="text-gray-400 mt-0.5">
                      Target: {agent.target}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-jarvis">
                    {agent.status === 'deployed' ? 'Deployed' : 'Returning'} 
                  </div>
                  <div className="text-gray-400">
                    {Math.floor(agent.progress)}%
                  </div>
                </div>
              </div>
            ))}
            
            {agents.filter(a => a.status !== 'idle').length === 0 && (
              <div className="text-xs text-gray-400 italic text-center py-2">
                No active agents
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HackerLegion;
