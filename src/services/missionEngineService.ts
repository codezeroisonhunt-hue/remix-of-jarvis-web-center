import { securityTools } from './securityTools';
import { toast } from '@/components/ui/sonner';

export type MissionStatus = 'idle' | 'running' | 'completed' | 'failed';
export type MissionPriority = 'low' | 'medium' | 'high' | 'critical';
export type MissionType = 'recon' | 'osint' | 'tracking' | 'surveillance' | 'custom';

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  priority: MissionPriority;
  status: MissionStatus;
  steps: MissionStep[];
  target: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  logs: MissionLog[];
}

export interface MissionStep {
  id: string;
  name: string;
  description: string;
  status: MissionStatus;
  action: () => Promise<any>;
  result?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface MissionLog {
  timestamp: Date;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
  data?: any;
}

export interface MissionEngine {
  createMission: (params: CreateMissionParams) => Mission;
  startMission: (id: string) => Promise<boolean>;
  pauseMission: (id: string) => boolean;
  abortMission: (id: string) => boolean;
  getMission: (id: string) => Mission | undefined;
  getAllMissions: () => Mission[];
  getActiveMissions: () => Mission[];
  clearCompletedMissions: () => void;
  logMissionActivity: (missionId: string, log: Omit<MissionLog, 'timestamp'>) => void;
}

export interface CreateMissionParams {
  name: string;
  description: string;
  type: MissionType;
  priority: MissionPriority;
  target: string;
  steps?: Omit<MissionStep, 'id' | 'status' | 'result' | 'error' | 'startedAt' | 'completedAt'>[];
}

class MissionEngineService implements MissionEngine {
  private missions: Mission[] = [];
  private missionRunnersMap: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    console.log('Mission Engine initialized');
    // Restore missions from storage if needed
  }

  public createMission(params: CreateMissionParams): Mission {
    const id = `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create default steps based on mission type if none provided
    const steps = params.steps?.map(step => ({
      ...step,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: 'idle' as MissionStatus,
    })) || this.getDefaultStepsForMissionType(params.type, params.target);
    
    const mission: Mission = {
      id,
      ...params,
      status: 'idle',
      steps,
      createdAt: new Date(),
      updatedAt: new Date(),
      logs: [
        {
          timestamp: new Date(),
          message: `Mission "${params.name}" created`,
          level: 'info'
        }
      ]
    };
    
    this.missions.push(mission);
    return mission;
  }

  public async startMission(id: string): Promise<boolean> {
    const mission = this.getMission(id);
    if (!mission || mission.status === 'running') return false;
    
    mission.status = 'running';
    mission.updatedAt = new Date();
    this.logMissionActivity(id, {
      message: `Mission "${mission.name}" started`,
      level: 'info'
    });
    
    // Start mission runner
    const runner = setTimeout(() => this.runMissionSteps(id), 0);
    this.missionRunnersMap.set(id, runner);
    
    toast(`Mission ${mission.name}`, {
      description: "Mission activated. Running in stealth mode...",
    });
    
    return true;
  }

  public pauseMission(id: string): boolean {
    const mission = this.getMission(id);
    if (!mission || mission.status !== 'running') return false;
    
    const runner = this.missionRunnersMap.get(id);
    if (runner) {
      clearTimeout(runner);
      this.missionRunnersMap.delete(id);
    }
    
    mission.status = 'idle';
    mission.updatedAt = new Date();
    this.logMissionActivity(id, {
      message: `Mission "${mission.name}" paused`,
      level: 'info'
    });
    
    toast(`Mission ${mission.name}`, {
      description: "Mission paused. Awaiting further instructions.",
    });
    
    return true;
  }

  public abortMission(id: string): boolean {
    const mission = this.getMission(id);
    if (!mission) return false;
    
    const runner = this.missionRunnersMap.get(id);
    if (runner) {
      clearTimeout(runner);
      this.missionRunnersMap.delete(id);
    }
    
    mission.status = 'failed';
    mission.updatedAt = new Date();
    this.logMissionActivity(id, {
      message: `Mission "${mission.name}" aborted`,
      level: 'warning'
    });
    
    toast(`Mission ${mission.name}`, {
      description: "Mission aborted. All operations terminated.",
    });
    
    return true;
  }

  public getMission(id: string): Mission | undefined {
    return this.missions.find(mission => mission.id === id);
  }

  public getAllMissions(): Mission[] {
    return [...this.missions];
  }

  public getActiveMissions(): Mission[] {
    return this.missions.filter(mission => mission.status === 'running');
  }

  public clearCompletedMissions(): void {
    this.missions = this.missions.filter(mission => 
      mission.status !== 'completed' && mission.status !== 'failed'
    );
  }

  public logMissionActivity(missionId: string, log: Omit<MissionLog, 'timestamp'>): void {
    const mission = this.getMission(missionId);
    if (!mission) return;
    
    const fullLog: MissionLog = {
      ...log,
      timestamp: new Date(),
    };
    
    mission.logs.push(fullLog);
    mission.updatedAt = new Date();
    
    // If it's an error or warning, also show a toast
    if (log.level === 'error' || log.level === 'warning') {
      toast(`Mission ${mission.name}`, {
        description: log.message,
      });
    }
    
    console.log(`[Mission: ${mission.name}] ${log.message}`);
  }

  private async runMissionSteps(missionId: string): Promise<void> {
    const mission = this.getMission(missionId);
    if (!mission) return;
    
    for (const step of mission.steps) {
      if (mission.status !== 'running') break; // Mission was paused or aborted
      if (step.status === 'completed') continue; // Skip completed steps
      
      try {
        step.status = 'running';
        step.startedAt = new Date();
        
        this.logMissionActivity(missionId, {
          message: `Executing step: ${step.name}`,
          level: 'info'
        });
        
        // Execute step action
        const result = await step.action();
        step.result = result;
        step.status = 'completed';
        step.completedAt = new Date();
        
        this.logMissionActivity(missionId, {
          message: `Step completed: ${step.name}`,
          level: 'success',
          data: result
        });
      } catch (error) {
        step.status = 'failed';
        step.error = error instanceof Error ? error.message : String(error);
        
        this.logMissionActivity(missionId, {
          message: `Step failed: ${step.name} - ${step.error}`,
          level: 'error',
          data: error
        });
        
        // Abort mission if a step fails
        mission.status = 'failed';
        mission.updatedAt = new Date();
        
        toast(`Mission ${mission.name}`, {
          description: `Mission failed: ${step.error}`,
        });
        
        return;
      }
    }
    
    // Check if all steps completed successfully
    const allCompleted = mission.steps.every(step => step.status === 'completed');
    if (allCompleted && mission.status === 'running') {
      mission.status = 'completed';
      mission.completedAt = new Date();
      mission.updatedAt = new Date();
      
      this.logMissionActivity(missionId, {
        message: `Mission "${mission.name}" completed successfully`,
        level: 'success'
      });
      
      toast(`Mission ${mission.name}`, {
        description: "Mission completed successfully.",
      });
    }
  }

  private getDefaultStepsForMissionType(type: MissionType, target: string): MissionStep[] {
    switch(type) {
      case 'recon':
        return [
          {
            id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: 'IP Analysis',
            description: 'Analyze IP information',
            status: 'idle',
            action: async () => {
              // This would use actual security tools in a real implementation
              return securityTools.scanNetwork(target);
            }
          },
          {
            id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: 'Port Scan',
            description: 'Scan for open ports',
            status: 'idle',
            action: async () => {
              return securityTools.portScan(target, '1-1000');
            }
          },
          {
            id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: 'Service Detection',
            description: 'Identify running services',
            status: 'idle',
            action: async () => {
              // In a real implementation, this would scan detected ports
              return securityTools.serviceDetection(target, 80);
            }
          }
        ];
      case 'osint':
        return [
          {
            id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: 'DNS Records',
            description: 'Retrieve DNS records',
            status: 'idle',
            action: async () => {
              return securityTools.analyzeDNSSecurity(target);
            }
          }
        ];
      // Add more default steps for other mission types
      default:
        return [];
    }
  }
}

export const missionEngine = new MissionEngineService();

// Example mission creation
// const newMission = missionEngine.createMission({
//   name: 'Reconnaissance Alpha',
//   description: 'Basic recon of target system',
//   type: 'recon',
//   priority: 'medium',
//   target: '192.168.1.1'
// });
// missionEngine.startMission(newMission.id);
