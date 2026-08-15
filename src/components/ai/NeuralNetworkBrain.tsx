
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Brain, Zap, Code, Target, Lightbulb, Cpu } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { neuralNetworkService, Strategy, HackingTask } from '@/services/neuralNetworkService';

export interface NeuralNetworkBrainProps {
  className?: string;
}

const NeuralNetworkBrain: React.FC<NeuralNetworkBrainProps> = ({ className }) => {
  const [networkState, setNetworkState] = useState(neuralNetworkService.getNetworkState());
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [taskHistory, setTaskHistory] = useState<HackingTask[]>([]);
  const [newTaskForm, setNewTaskForm] = useState({
    target: '',
    objective: '',
    difficulty: 5
  });
  const [isExecutingTask, setIsExecutingTask] = useState(false);

  useEffect(() => {
    // Initial load
    setStrategies(neuralNetworkService.getStrategies());
    setTaskHistory(neuralNetworkService.getTaskHistory());
    
    // Update every 10 seconds
    const interval = setInterval(() => {
      setNetworkState(neuralNetworkService.getNetworkState());
      setStrategies(neuralNetworkService.getStrategies());
      setTaskHistory(neuralNetworkService.getTaskHistory());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleTrain = async () => {
    setIsTraining(true);
    try {
      const result = await neuralNetworkService.trainNetwork();
      toast(result.success ? "Training Complete" : "Training Failed", {
        description: result.message,
      });
      
      // Update state after training
      setNetworkState(neuralNetworkService.getNetworkState());
      setStrategies(neuralNetworkService.getStrategies());
    } catch (error) {
      console.error("Training error:", error);
      toast("Training Error", {
        description: "An error occurred during neural network training",
      });
    } finally {
      setIsTraining(false);
    }
  };
  
  const handleExecuteTask = async () => {
    if (!newTaskForm.target || !newTaskForm.objective) {
      toast("Validation Error", {
        description: "Please provide a target and objective",
      });
      return;
    }
    
    setIsExecutingTask(true);
    try {
      const task: HackingTask = {
        id: `task-${Date.now()}`,
        target: newTaskForm.target,
        objective: newTaskForm.objective,
        difficulty: newTaskForm.difficulty,
        status: 'pending'
      };
      
      const result = await neuralNetworkService.executeHackingTask(task);
      
      // Update task history
      setTaskHistory(neuralNetworkService.getTaskHistory());
      
      // Clear form
      setNewTaskForm({
        target: '',
        objective: '',
        difficulty: 5
      });
      
    } catch (error) {
      console.error("Task execution error:", error);
      toast("Execution Error", {
        description: "Failed to execute hacking task",
      });
    } finally {
      setIsExecutingTask(false);
    }
  };
  
  const renderKnowledgeBase = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(networkState.knowledgeBase).map(([domain, level]) => (
          <div key={domain} className="p-3 bg-black/20 border border-jarvis/30 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold capitalize">{domain}</span>
              <span className="text-sm text-jarvis">{(level * 100).toFixed(0)}%</span>
            </div>
            <Progress value={level * 100} className="h-2" />
          </div>
        ))}
      </div>
    );
  };
  
  const renderStrategies = () => {
    // Sort strategies by success rate
    const sortedStrategies = [...strategies].sort((a, b) => b.successRate - a.successRate);
    
    return (
      <div className="space-y-4">
        {sortedStrategies.map(strategy => (
          <Card key={strategy.id} className="bg-black/20 border-jarvis/30">
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{strategy.name}</CardTitle>
                <Badge variant="outline">{(strategy.successRate * 100).toFixed(0)}% Success</Badge>
              </div>
              <CardDescription>{strategy.description}</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {strategy.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-jarvis/20 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>Complexity: {strategy.complexity}/10</span>
                <span>Used {strategy.usageCount} times</span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {strategies.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Code className="mx-auto h-8 w-8 mb-2" />
            <p>No strategies available yet. Train the network to generate strategies.</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderTaskHistory = () => {
    return (
      <div className="space-y-4">
        {taskHistory.map(task => (
          <Card key={task.id} className={`bg-black/20 ${
            task.status === 'completed' ? 'border-green-800/50' : 
            task.status === 'failed' ? 'border-red-900/50' : 'border-jarvis/30'
          }`}>
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">{task.objective}</CardTitle>
                <Badge variant={task.status === 'completed' ? 'default' : 
                              task.status === 'failed' ? 'destructive' : 'outline'}>
                  {task.status}
                </Badge>
              </div>
              <CardDescription className="text-xs">Target: {task.target}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2 text-sm">
              {task.result && <p>{task.result}</p>}
              {task.strategyUsed && (
                <div className="mt-2 text-xs text-gray-400">
                  Strategy: {task.strategyUsed.name}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0 pb-3 text-xs text-gray-400">
              {task.startTime && (
                <span>
                  {new Date(task.startTime).toLocaleString()}
                  {task.endTime && ` (${Math.round((new Date(task.endTime).getTime() - 
                    new Date(task.startTime).getTime()) / 1000)}s)`}
                </span>
              )}
            </CardFooter>
          </Card>
        ))}
        
        {taskHistory.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Target className="mx-auto h-8 w-8 mb-2" />
            <p>No tasks executed yet. Create a task to get started.</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderNewTaskForm = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target</label>
          <input
            type="text"
            value={newTaskForm.target}
            onChange={e => setNewTaskForm({...newTaskForm, target: e.target.value})}
            placeholder="example.com, 192.168.1.1, etc."
            className="w-full px-3 py-2 bg-black/40 border border-jarvis/30 rounded-md focus:outline-none focus:border-jarvis"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Objective</label>
          <input
            type="text"
            value={newTaskForm.objective}
            onChange={e => setNewTaskForm({...newTaskForm, objective: e.target.value})}
            placeholder="Scan ports, find vulnerabilities, etc."
            className="w-full px-3 py-2 bg-black/40 border border-jarvis/30 rounded-md focus:outline-none focus:border-jarvis"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Difficulty (1-10)</label>
            <span className="text-sm text-jarvis">{newTaskForm.difficulty}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={newTaskForm.difficulty}
            onChange={e => setNewTaskForm({...newTaskForm, difficulty: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={handleExecuteTask} 
          disabled={isExecutingTask}
          className="w-full bg-jarvis/20 text-jarvis hover:bg-jarvis/30 border border-jarvis/30"
        >
          {isExecutingTask ? "Executing..." : "Execute Task"}
        </Button>
      </div>
    );
  };
  
  return (
    <div className={`${className} p-4`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-jarvis" />
            <h2 className="text-xl font-bold text-jarvis">Neural Network Hacker Brain</h2>
          </div>
          <Badge 
            variant="outline" 
            className="bg-jarvis/10 border-jarvis/30"
          >
            v{networkState.version.toFixed(2)}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="p-3 bg-black/30 border border-jarvis/30 rounded-lg flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-jarvis/80" />
            <div>
              <div className="text-xs text-gray-400">Learning Rate</div>
              <div className="font-semibold">{networkState.learningRate.toFixed(3)}</div>
            </div>
          </div>
          
          <div className="p-3 bg-black/30 border border-jarvis/30 rounded-lg flex items-center">
            <Zap className="h-5 w-5 mr-2 text-jarvis/80" />
            <div>
              <div className="text-xs text-gray-400">Training Iterations</div>
              <div className="font-semibold">{networkState.iterations}</div>
            </div>
          </div>
          
          <div className="p-3 bg-black/30 border border-jarvis/30 rounded-lg flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-jarvis/80" />
            <div>
              <div className="text-xs text-gray-400">Strategies</div>
              <div className="font-semibold">{strategies.length}</div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleTrain} 
          disabled={isTraining} 
          className="bg-jarvis/20 text-jarvis hover:bg-jarvis/30 border border-jarvis/30"
        >
          {isTraining ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-jarvis" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Training...
            </>
          ) : (
            <>Train Neural Network</>
          )}
        </Button>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-black/20 border border-jarvis/20 mb-4">
          <TabsTrigger value="overview">Knowledge</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="tasks">Task History</TabsTrigger>
          <TabsTrigger value="new-task">New Task</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          {renderKnowledgeBase()}
        </TabsContent>
        
        <TabsContent value="strategies" className="mt-0">
          <div className="max-h-[500px] overflow-y-auto pr-1">
            {renderStrategies()}
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-0">
          <div className="max-h-[500px] overflow-y-auto pr-1">
            {renderTaskHistory()}
          </div>
        </TabsContent>
        
        <TabsContent value="new-task" className="mt-0">
          {renderNewTaskForm()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NeuralNetworkBrain;
