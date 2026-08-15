
import { toast } from '@/components/ui/sonner';

export interface NeuralNetworkState {
  learningRate: number;
  iterations: number;
  knowledgeBase: Record<string, number>;
  successRates: Record<string, number>;
  lastTrainingDate: Date;
  strategies: Strategy[];
  version: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  successRate: number;
  usageCount: number;
  createdAt: Date;
  lastUsed?: Date;
  tags: string[];
  complexity: number;
}

export interface TrainingResult {
  success: boolean;
  improvement: number;
  newStrategies: Strategy[];
  message: string;
}

export interface HackingTask {
  id: string;
  target: string;
  objective: string;
  difficulty: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: string;
  strategyUsed?: Strategy;
  startTime?: Date;
  endTime?: Date;
}

class NeuralNetworkService {
  private state: NeuralNetworkState;
  private tasks: HackingTask[] = [];
  private isLearning: boolean = false;
  private mutationRate: number = 0.05;
  private evolutionEnabled: boolean = true;

  constructor() {
    // Load state from localStorage if available
    const savedState = localStorage.getItem('neural-network-state');
    
    if (savedState) {
      try {
        this.state = JSON.parse(savedState);
        console.log('Neural network state loaded:', this.state);
      } catch (error) {
        console.error('Failed to load neural network state:', error);
        this.initializeDefaultState();
      }
    } else {
      this.initializeDefaultState();
    }
    
    // Auto-save state periodically
    setInterval(() => this.saveState(), 30000);
    
    // Schedule autonomous learning
    this.scheduleAutonomousLearning();
  }
  
  private initializeDefaultState() {
    this.state = {
      learningRate: 0.03,
      iterations: 0,
      knowledgeBase: {
        'reconnaissance': 0.2,
        'exploitation': 0.1,
        'persistence': 0.05,
        'evasion': 0.15,
        'exfiltration': 0.1
      },
      successRates: {},
      lastTrainingDate: new Date(),
      strategies: this.generateInitialStrategies(),
      version: 1.0
    };
    
    console.log('Neural network initialized with default state');
  }
  
  private generateInitialStrategies(): Strategy[] {
    return [
      {
        id: 'strategy-001',
        name: 'Basic Port Scanning',
        description: 'Scans common ports to identify open services',
        successRate: 0.75,
        usageCount: 0,
        createdAt: new Date(),
        tags: ['reconnaissance', 'network'],
        complexity: 1
      },
      {
        id: 'strategy-002',
        name: 'Password Dictionary Attack',
        description: 'Attempts to guess passwords using common dictionaries',
        successRate: 0.4,
        usageCount: 0,
        createdAt: new Date(),
        tags: ['exploitation', 'authentication'],
        complexity: 2
      },
      {
        id: 'strategy-003',
        name: 'Social Engineering Template',
        description: 'Creates convincing phishing templates',
        successRate: 0.6,
        usageCount: 0,
        createdAt: new Date(),
        tags: ['social', 'initial-access'],
        complexity: 3
      }
    ];
  }
  
  private saveState() {
    try {
      localStorage.setItem('neural-network-state', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save neural network state:', error);
    }
  }
  
  private scheduleAutonomousLearning() {
    // Schedule learning every 3 hours
    setInterval(() => {
      if (!this.isLearning && this.evolutionEnabled) {
        this.trainNetwork();
      }
    }, 3 * 60 * 60 * 1000);
  }
  
  /**
   * Train the neural network on existing data and develop new strategies
   */
  public async trainNetwork(): Promise<TrainingResult> {
    if (this.isLearning) {
      return {
        success: false,
        improvement: 0,
        newStrategies: [],
        message: 'Neural network is already in learning mode'
      };
    }
    
    try {
      this.isLearning = true;
      console.log('Starting neural network training...');
      
      // Simulate training time based on complexity
      const trainingTime = 1000 + Math.random() * 2000;
      toast("Neural Network", {
        description: "Training in progress... Evolving strategies",
      });
      
      // Wait for simulated training time
      await new Promise(resolve => setTimeout(resolve, trainingTime));
      
      // Update knowledge base
      Object.keys(this.state.knowledgeBase).forEach(key => {
        this.state.knowledgeBase[key] += Math.random() * this.state.learningRate;
        
        // Cap knowledge at 1.0
        if (this.state.knowledgeBase[key] > 1) {
          this.state.knowledgeBase[key] = 1;
        }
      });
      
      // Improve existing strategies based on usage
      this.state.strategies = this.state.strategies.map(strategy => {
        if (strategy.usageCount > 0) {
          // Improve success rate based on usage
          const improvement = (Math.random() * this.state.learningRate) * (strategy.usageCount / 10);
          strategy.successRate = Math.min(0.99, strategy.successRate + improvement);
        }
        return strategy;
      });
      
      // Generate new strategies occasionally
      const newStrategies: Strategy[] = [];
      if (Math.random() < 0.3) {
        const newStrategy = this.evolveNewStrategy();
        this.state.strategies.push(newStrategy);
        newStrategies.push(newStrategy);
        
        toast("Neural Evolution", {
          description: `New strategy evolved: ${newStrategy.name}`,
        });
      }
      
      // Update state
      this.state.iterations++;
      this.state.lastTrainingDate = new Date();
      this.state.version += 0.01;
      
      // Calculate overall improvement
      const averageImprovement = Object.values(this.state.knowledgeBase).reduce((sum, val) => sum + val, 0) / 
                               Object.keys(this.state.knowledgeBase).length;
      
      this.saveState();
      
      return {
        success: true,
        improvement: averageImprovement,
        newStrategies,
        message: `Training completed. Network evolved to v${this.state.version.toFixed(2)}`
      };
    } catch (error) {
      console.error('Error during network training:', error);
      return {
        success: false,
        improvement: 0,
        newStrategies: [],
        message: 'Training failed due to internal error'
      };
    } finally {
      this.isLearning = false;
    }
  }
  
  /**
   * Create a new evolved strategy based on existing knowledge
   */
  private evolveNewStrategy(): Strategy {
    // Choose a random existing strategy as template
    const baseStrategies = this.state.strategies;
    const baseStrategy = baseStrategies[Math.floor(Math.random() * baseStrategies.length)];
    
    // Knowledge domains
    const domains = ['reconnaissance', 'exploitation', 'persistence', 'evasion', 'exfiltration', 
                     'privilege-escalation', 'lateral-movement', 'command-control'];
                     
    // Common techniques
    const techniques = ['scanning', 'brute-force', 'injection', 'overflow', 'backdoor', 
                       'spoofing', 'hijacking', 'tunneling', 'encryption', 'obfuscation'];
    
    // Create name by combining elements
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const technique = techniques[Math.floor(Math.random() * techniques.length)];
    
    // Determine complexity based on knowledge
    const knowledgeLevel = this.state.knowledgeBase[domain] || 0.1;
    const complexity = Math.ceil(1 + (knowledgeLevel * 9)); // Scale from 1-10
    
    // Generate random tags
    const numTags = 1 + Math.floor(Math.random() * 3);
    const tags = [domain];
    for (let i = 0; i < numTags; i++) {
      const tag = domains[Math.floor(Math.random() * domains.length)];
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
    
    // Advanced strategies have higher complexity but lower initial success rate
    const successRate = 0.3 + (Math.random() * 0.4);
    
    return {
      id: `strategy-${Date.now().toString(36)}`,
      name: `Advanced ${domain.charAt(0).toUpperCase() + domain.slice(1)} ${technique}`,
      description: `An evolved strategy that applies ${technique} techniques to ${domain} targets`,
      successRate,
      usageCount: 0,
      createdAt: new Date(),
      tags,
      complexity
    };
  }
  
  /**
   * Execute a hacking task using the neural network
   */
  public async executeHackingTask(task: HackingTask): Promise<HackingTask> {
    console.log(`Executing hacking task: ${task.id} - ${task.objective}`);
    
    // Mark task as in-progress
    task.status = 'in-progress';
    task.startTime = new Date();
    
    // Select best strategy for this task
    const strategy = this.selectBestStrategy(task);
    task.strategyUsed = strategy;
    
    try {
      // Simulate execution time
      const executionTime = 1000 + (strategy.complexity * 500);
      
      toast("Neural Hacker", {
        description: `Executing ${strategy.name}...`,
      });
      
      await new Promise(resolve => setTimeout(resolve, executionTime));
      
      // Determine success based on strategy success rate
      const successful = Math.random() < strategy.successRate;
      
      if (successful) {
        task.status = 'completed';
        task.result = `Task completed successfully using ${strategy.name}`;
        
        // Increment usage count and update last used date
        this.updateStrategyUsage(strategy.id);
        
        toast("Task Completed", {
          description: `${task.objective} completed successfully`,
        });
      } else {
        task.status = 'failed';
        task.result = `Task failed. ${strategy.name} was not effective.`;
        
        // Learn from failure by slightly decreasing success rate
        this.updateStrategySuccessRate(strategy.id, -0.02);
        
        toast("Task Failed", {
          description: `${task.objective} failed. Analyzing failure patterns...`,
        });
      }
      
      task.endTime = new Date();
      
      // Add to task history
      this.tasks.push(task);
      
      // Sometimes trigger learning after task completion
      if (Math.random() < 0.2) {
        this.trainNetwork();
      }
      
      return task;
    } catch (error) {
      console.error(`Error executing task ${task.id}:`, error);
      task.status = 'failed';
      task.result = 'Internal error during execution';
      task.endTime = new Date();
      return task;
    }
  }
  
  /**
   * Select the best strategy for a given task
   */
  private selectBestStrategy(task: HackingTask): Strategy {
    // Extract keywords from task objective
    const keywords = task.objective.toLowerCase().split(' ');
    
    // Score each strategy based on tags matching keywords and success rate
    const scoredStrategies = this.state.strategies.map(strategy => {
      let score = strategy.successRate * 2; // Base score from success rate
      
      // Boost score if tags match keywords in objective
      strategy.tags.forEach(tag => {
        if (keywords.some(keyword => keyword.includes(tag))) {
          score += 0.3;
        }
      });
      
      // Adjust score based on task difficulty and strategy complexity
      const complexityMatch = Math.max(0, 1 - Math.abs(task.difficulty - strategy.complexity) / 5);
      score += complexityMatch * 0.5;
      
      return {
        strategy,
        score
      };
    });
    
    // Sort by score and return the best strategy
    scoredStrategies.sort((a, b) => b.score - a.score);
    return scoredStrategies[0].strategy;
  }
  
  /**
   * Update strategy usage statistics
   */
  private updateStrategyUsage(strategyId: string) {
    const strategyIndex = this.state.strategies.findIndex(s => s.id === strategyId);
    if (strategyIndex >= 0) {
      this.state.strategies[strategyIndex].usageCount++;
      this.state.strategies[strategyIndex].lastUsed = new Date();
      this.saveState();
    }
  }
  
  /**
   * Update strategy success rate
   */
  private updateStrategySuccessRate(strategyId: string, delta: number) {
    const strategyIndex = this.state.strategies.findIndex(s => s.id === strategyId);
    if (strategyIndex >= 0) {
      const newRate = this.state.strategies[strategyIndex].successRate + delta;
      this.state.strategies[strategyIndex].successRate = Math.max(0.01, Math.min(0.99, newRate));
      this.saveState();
    }
  }
  
  /**
   * Get network state
   */
  public getNetworkState(): NeuralNetworkState {
    return this.state;
  }
  
  /**
   * Get available strategies
   */
  public getStrategies(): Strategy[] {
    return this.state.strategies;
  }
  
  /**
   * Get task history
   */
  public getTaskHistory(): HackingTask[] {
    return this.tasks;
  }
  
  /**
   * Reset the neural network (for testing)
   */
  public resetNetwork() {
    localStorage.removeItem('neural-network-state');
    this.initializeDefaultState();
    this.tasks = [];
    toast("Neural Network Reset", {
      description: "Neural network has been reset to initial state",
    });
  }
  
  /**
   * Toggle evolution mode
   */
  public toggleEvolution(enabled: boolean) {
    this.evolutionEnabled = enabled;
    toast("Neural Evolution", {
      description: enabled ? "Autonomous evolution enabled" : "Autonomous evolution disabled",
    });
  }
}

export const neuralNetworkService = new NeuralNetworkService();
