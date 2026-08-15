
import React, { useEffect, useRef } from 'react';

interface ArcReactorProps {
  size?: 'small' | 'medium' | 'large';
  intensity?: 'low' | 'high';
}

const ArcReactor: React.FC<ArcReactorProps> = ({ 
  size = 'medium', 
  intensity = 'high' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reactorSize = size === 'small' ? 120 : size === 'medium' ? 150 : 200;
  
  // Canvas animation for energy particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = reactorSize * 3;
    canvas.height = reactorSize * 3;
    
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      angle: number;
      distance: number;
      maxDistance: number;
    }[] = [];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * reactorSize * 0.75;
      
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * distance,
        y: canvas.height / 2 + Math.sin(angle) * distance,
        radius: 0.5 + Math.random() * 2,
        color: `rgba(51, 195, 240, ${0.3 + Math.random() * 0.7})`,
        speed: 0.3 + Math.random() * 0.8,
        angle: Math.random() * Math.PI * 2,
        distance,
        maxDistance: reactorSize * 0.75
      });
    }
    
    let animationFrame: number;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw outer glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        reactorSize * 0.5,
        canvas.width / 2,
        canvas.height / 2,
        reactorSize * 1.5
      );
      gradient.addColorStop(0, "rgba(51, 195, 240, 0.2)");
      gradient.addColorStop(1, "rgba(51, 195, 240, 0)");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, reactorSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.angle += particle.speed * 0.01;
        particle.x = canvas.width / 2 + Math.cos(particle.angle) * particle.distance;
        particle.y = canvas.height / 2 + Math.sin(particle.angle) * particle.distance;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        
        // Add glow effect
        ctx.shadowColor = 'rgba(51, 195, 240, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      animationFrame = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [reactorSize]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute"
        style={{
          width: reactorSize * 3,
          height: reactorSize * 3
        }}
      />
      
      <div className="relative">
        {/* Outer glow */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#33C3F0]/5 blur-[100px]"
          style={{
            width: `${reactorSize * 2}px`,
            height: `${reactorSize * 2}px`,
          }}
        ></div>
        
        {/* Middle glow */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#33C3F0]/10 blur-[50px]"
          style={{
            width: `${reactorSize * 1.3}px`,
            height: `${reactorSize * 1.3}px`,
          }}
        ></div>
        
        {/* Inner rings */}
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: `${reactorSize}px`,
            height: `${reactorSize}px`,
          }}
        >
          {/* Spinning outer ring */}
          <div className="absolute w-full h-full rounded-full border-2 border-[#33C3F0]/50 animate-spin-slow"></div>
          
          {/* Middle spinning ring */}
          <div 
            className="absolute rounded-full border border-[#33C3F0]/60" 
            style={{
              width: `${reactorSize * 0.8}px`, 
              height: `${reactorSize * 0.8}px`,
              animationDuration: '8s',
              transform: 'rotate(30deg)',
              animation: 'spin-slow 8s linear infinite reverse'
            }}
          ></div>
          
          {/* Inner ring */}
          <div 
            className="absolute rounded-full border border-[#33C3F0]/70"
            style={{
              width: `${reactorSize * 0.6}px`,
              height: `${reactorSize * 0.6}px`,
            }}
          ></div>
          
          {/* Core */}
          <div 
            className="absolute rounded-full bg-[#33C3F0]/30 reactor-glow"
            style={{
              width: `${reactorSize * 0.4}px`,
              height: `${reactorSize * 0.4}px`,
              boxShadow: intensity === 'high' 
                ? '0 0 30px rgba(51, 195, 240, 0.7), 0 0 60px rgba(51, 195, 240, 0.4)' 
                : '0 0 20px rgba(51, 195, 240, 0.6), 0 0 40px rgba(51, 195, 240, 0.3)'
            }}
          >
            <div 
              className="absolute rounded-full bg-[#33C3F0]/40"
              style={{
                inset: `${reactorSize * 0.1}px`,
                animation: 'pulse 2s infinite ease-in-out'
              }}
            ></div>
            <div 
              className="absolute rounded-full bg-white/90"
              style={{
                inset: `${reactorSize * 0.15}px`
              }}
            ></div>
          </div>
          
          {/* Energy beams */}
          <div className="absolute inset-0">
            {intensity === 'high' && (
              <>
                <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-[#33C3F0]/30 transform -translate-x-1/2 -translate-y-1/2 reactor-beam"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-[#33C3F0]/30 transform -translate-x-1/2 -translate-y-1/2 rotate-45 reactor-beam"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-[#33C3F0]/30 transform -translate-x-1/2 -translate-y-1/2 rotate-90 reactor-beam"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-[#33C3F0]/30 transform -translate-x-1/2 -translate-y-1/2 rotate-135 reactor-beam"></div>
              </>
            )}
          </div>
        </div>
        
        {/* Pulsing particles */}
        {Array.from({ length: intensity === 'high' ? 12 : 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#33C3F0]/70 rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              top: `${Math.sin(i * Math.PI / (intensity === 'high' ? 6 : 4)) * reactorSize * 0.9 + reactorSize * 1.5}px`,
              left: `${Math.cos(i * Math.PI / (intensity === 'high' ? 6 : 4)) * reactorSize * 0.9 + reactorSize * 1.5}px`,
              boxShadow: '0 0 8px rgba(51, 195, 240, 0.8)',
              animation: `pulse-reactor ${1 + i * 0.2}s infinite ease-in-out ${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ArcReactor;
