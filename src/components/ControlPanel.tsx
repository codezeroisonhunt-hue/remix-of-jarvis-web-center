
import React from 'react';
import { cn } from '@/lib/utils';
import { Brain, Mic, Sparkles, Cpu, Tv } from 'lucide-react';

export interface ControlOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

export interface ControlPanelProps {
  options: ControlOption[];
  onToggle: (id: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ options, onToggle }) => {
  return (
    <div className="jarvis-panel p-3 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onToggle(option.id)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-md transition-all duration-300 relative overflow-hidden group",
              option.active 
                ? "bg-jarvis/10 shadow-[0_0_10px_rgba(30,174,219,0.15)]" 
                : "bg-black/20 hover:bg-black/30"
            )}
          >
            {/* Background pulse effect when active */}
            {option.active && (
              <div className="absolute inset-0 bg-jarvis/5 animate-pulse-subtle"></div>
            )}
            
            {/* Icon wrapper */}
            <div className={cn(
              "relative w-10 h-10 mb-2 flex items-center justify-center rounded-full",
              option.active 
                ? "bg-gradient-to-br from-jarvisDark to-jarvis text-white" 
                : "bg-gray-800 text-gray-400"
            )}>
              {/* Animated border when active */}
              {option.active && (
                <div className="absolute -inset-1 rounded-full border border-jarvis/30 animate-spin-slow opacity-70"></div>
              )}
              
              {React.cloneElement(option.icon as React.ReactElement, { 
                className: cn(
                  "w-5 h-5",
                  option.active ? "animate-pulse-subtle" : ""
                )
              })}
            </div>
            
            {/* Label */}
            <span className={cn(
              "text-xs font-medium",
              option.active ? "text-jarvis" : "text-gray-400"
            )}>
              {option.label}
            </span>
            
            {/* Bottom active indicator */}
            <div className={cn(
              "absolute bottom-0 left-0 h-[2px] w-full bg-jarvis scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
              option.active ? "scale-x-100" : ""
            )}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
