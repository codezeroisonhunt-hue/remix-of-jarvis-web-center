
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Loader } from 'lucide-react';

interface JarvisCoreProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
}

const JarvisCore: React.FC<JarvisCoreProps> = ({
  isSpeaking,
  isListening,
  isProcessing,
}) => {
  const coreRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Advanced particle system effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 300;
    canvas.height = 300;
    
    // Center point
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Particle properties
    const particles: {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
      opacity: number;
    }[] = [];
    
    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 20 + Math.random() * 80,
        speed: 0.005 + Math.random() * 0.01,
        size: 1 + Math.random() * 2,
        color: `rgba(51, 195, 240, ${0.4 + Math.random() * 0.6})`,
        opacity: 0.1 + Math.random() * 0.9
      });
    }
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        // Update position
        particle.angle += particle.speed * (isProcessing ? 2 : 1);
        
        const x = centerX + Math.cos(particle.angle) * particle.radius;
        const y = centerY + Math.sin(particle.angle) * particle.radius;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = (isSpeaking || isListening) 
          ? particle.color
          : particle.color.replace('240', '220').replace('0.4', '0.2');
          
        ctx.globalAlpha = (isSpeaking || isListening || isProcessing) 
          ? particle.opacity 
          : particle.opacity * 0.6;
          
        ctx.fill();
        
        // Draw connection to center occasionally
        if (Math.random() > 0.97) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(51, 195, 240, ${particle.opacity * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      
      // Add rays from center when active
      if (isSpeaking || isListening || isProcessing) {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x2 = centerX + Math.cos(angle) * 150;
          const y2 = centerY + Math.sin(angle) * 150;
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(51, 195, 240, ${Math.random() * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      
      requestAnimationFrame(drawParticles);
    };
    
    const animationId = requestAnimationFrame(drawParticles);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isSpeaking, isListening, isProcessing]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Canvas for particle effects */}
      <canvas 
        ref={canvasRef} 
        className="absolute w-full h-full pointer-events-none"
        style={{ opacity: 0.7 }}
      />
      
      {/* Base core glow */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-jarvis/10 blur-xl transition-opacity duration-500",
        (isSpeaking || isListening) && "opacity-100",
        !isSpeaking && !isListening && "opacity-40"
      )} />

      {/* Dynamic rings */}
      <div className={cn(
        "absolute w-full h-full rounded-full border-2 border-jarvis/30 z-10",
        (isSpeaking || isListening) && "animate-ping-slow"
      )} />
      <div className={cn(
        "absolute w-[90%] h-[90%] rounded-full border border-jarvis/20 z-10",
        isProcessing && "animate-spin-slow"
      )} />
      
      {/* Decorative elements */}
      <div className="absolute w-full h-full pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const size = i % 3 === 0 ? 4 : 2;
          return (
            <div 
              key={i}
              className="absolute bg-jarvis/50"
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                top: `${50 + Math.sin(angle) * 45}%`,
                left: `${50 + Math.cos(angle) * 45}%`,
                boxShadow: '0 0 5px rgba(51, 195, 240, 0.5)'
              }}
            />
          );
        })}
      </div>
      
      {/* Rotate line elements */}
      <div className="absolute w-full h-full animate-spin-slow" style={{ animationDuration: '20s' }}>
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <div 
              key={i}
              className="absolute bg-jarvis/30"
              style={{
                width: '100%',
                height: '1px',
                top: '50%',
                transformOrigin: 'center',
                transform: `rotate(${angle}rad)`,
                boxShadow: '0 0 5px rgba(51, 195, 240, 0.3)'
              }}
            />
          );
        })}
      </div>
      
      {/* Central core */}
      <div ref={coreRef} className="relative w-32 h-32 z-20">
        <div className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-r from-jarvis/20 to-jarvis/30 backdrop-blur-sm",
          (isSpeaking || isListening) && "animate-pulse"
        )}>
          <div className="absolute inset-0 flex items-center justify-center">
            {isProcessing ? (
              <Loader className="w-8 h-8 text-jarvis animate-spin" />
            ) : (
              <div className={cn(
                "w-16 h-16 rounded-full bg-jarvis/30 flex items-center justify-center",
                (isSpeaking || isListening) && "animate-pulse"
              )}>
                <div className="w-12 h-12 rounded-full bg-jarvis/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-jarvis/50 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white/90 animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Energy particles */}
      {(isSpeaking || isListening) && (
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-jarvis rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6,
                boxShadow: '0 0 8px rgba(51, 195, 240, 0.8)'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Pulse rings */}
      <div 
        className={`absolute w-full h-full rounded-full border border-jarvis/20 ${(isSpeaking || isListening || isProcessing) ? 'animate-ping-slow' : ''}`}
        style={{animationDuration: '4s'}}
      />
      <div 
        className={`absolute w-[80%] h-[80%] rounded-full border border-jarvis/20 ${(isSpeaking || isListening || isProcessing) ? 'animate-ping-slow' : ''}`}
        style={{animationDuration: '3s', animationDelay: '0.5s'}}
      />
    </div>
  );
};

export default JarvisCore;
