
import React, { useEffect, useState } from 'react';
import { hackerModeLines } from '../../services/hackerModeService';
import HackingTools from './HackingTools';

interface HackerModeProps {
  isActive: boolean;
}

const HackerModeEnhanced: React.FC<HackerModeProps> = ({ isActive }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showTools, setShowTools] = useState(false);
  const [progressStage, setProgressStage] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setLines([]);
      setShowTools(false);
      setProgressStage(0);
      return;
    }

    // Display hacker text first, then show tools
    const addLines = async () => {
      const newLines: string[] = [];
      
      // Stage 1: Initial access lines
      setProgressStage(1);
      for (const line of hackerModeLines) {
        newLines.push(line);
        setLines([...newLines]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      
      // Stage 2: System access
      setProgressStage(2);
      const systemAccessLines = [
        ">> SYSTEM ACCESS GRANTED",
        ">> BYPASSING KERNEL SECURITY...",
        ">> OBTAINING ROOT PRIVILEGES...",
        ">> ROOT ACCESS: GRANTED",
        ">> DISABLING SYSTEM LOGS AND TRACES"
      ];
      
      for (const line of systemAccessLines) {
        newLines.push(line);
        setLines([...newLines]);
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      
      // Stage 3: Tool initialization
      setProgressStage(3);
      const toolInitLines = [
        ">> INITIALIZING ADVANCED HACKING SUITE",
        ">> LOADING MODULES...",
        ">> NETWORK SCANNER: READY",
        ">> VULNERABILITY SCANNER: READY",
        ">> PASSWORD CRACKER: READY",
        ">> DATABASE BREACHER: READY",
        ">> FIREWALL BYPASS: READY",
        ">> REVERSE SHELL: READY",
        ">> SOCIAL ENGINEERING TOOLKIT: READY",
        ">> WIRELESS ATTACK FRAMEWORK: READY",
        ">> RANSOMWARE SIMULATOR: READY",
        ">> PHISHING ENGINE: READY",
        ">> DARK WEB SCANNER: READY",
        ">> BINARY ANALYSIS TOOLS: READY",
        ">> FORENSIC TOOLKIT: READY",
        ">> ADVANCED HACKING SUITE LOADED",
        ">> EXECUTE? [Y/N]",
        ">> Y",
        ">> EXECUTING..."
      ];
      
      for (const line of toolInitLines) {
        newLines.push(line);
        setLines([...newLines]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      
      // Show tools after text animation completes
      setProgressStage(4);
      setShowTools(true);
    };

    addLines();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="font-mono text-xs text-green-400 bg-black/80 p-4 rounded-md border border-green-500/30 overflow-auto max-h-[600px] animate-fade-in">
      {/* Progress bar showing hacking stages */}
      <div className="mb-4 bg-black/50 rounded-full h-1.5 overflow-hidden border border-green-500/20">
        <div 
          className="bg-green-500 h-full transition-all duration-300"
          style={{ width: `${(progressStage / 4) * 100}%` }}
        />
      </div>
      
      {/* Status indicator */}
      <div className="mb-4 text-xs flex items-center justify-between">
        <div>
          <span className="text-gray-400">STATUS:</span>{" "}
          <span className={`${progressStage >= 4 ? 'text-green-500' : 'text-yellow-400'}`}>
            {progressStage >= 4 ? 'SYSTEM COMPROMISED' : 'INFILTRATION IN PROGRESS'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">STAGE:</span>{" "}
          <span className="text-green-500">{progressStage}/4</span>
        </div>
      </div>
      
      <div className="mb-4">
        {lines.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      
      <HackingTools active={showTools} />
    </div>
  );
};

export default HackerModeEnhanced;
