
import React, { useEffect, useRef } from 'react';

interface HologramEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const HologramEffect: React.FC<HologramEffectProps> = ({ 
  children, 
  className = '',
  intensity = 'medium'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create glitch effect periodically
    const glitchInterval = setInterval(() => {
      if (!containerRef.current) return;
      
      const glitch = document.createElement('div');
      glitch.className = 'hologram-glitch';
      glitch.style.top = `${Math.random() * 100}%`;
      glitch.style.width = '100%';
      glitch.style.height = `${1 + Math.random() * 3}px`;
      glitch.style.opacity = `${0.3 + Math.random() * 0.7}`;
      glitch.style.animationDuration = `${0.2 + Math.random() * 0.3}s`;
      containerRef.current.appendChild(glitch);
      
      // Remove glitch element after animation
      setTimeout(() => {
        glitch.remove();
      }, 500);
    }, intensity === 'high' ? 200 : intensity === 'medium' ? 500 : 1000);
    
    return () => {
      clearInterval(glitchInterval);
    };
  }, [intensity]);

  return (
    <div 
      ref={containerRef}
      className={`relative hologram-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate'
      }}
    >
      {/* Holographic container with 3D perspective */}
      <div className="relative overflow-hidden rounded-lg hologram-content" style={{
        transform: 'perspective(1000px) rotateX(2deg)',
        boxShadow: intensity === 'high' 
          ? '0 0 30px rgba(51, 195, 240, 0.7), 0 0 60px rgba(51, 195, 240, 0.3)' 
          : '0 0 20px rgba(51, 195, 240, 0.5), 0 0 40px rgba(51, 195, 240, 0.2)',
      }}>
        {/* Scan lines */}
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51, 195, 240, 0.2) 3px, transparent 3px)',
          backgroundSize: '100% 3px',
          zIndex: 2
        }}></div>
        
        {/* Main scan line effect */}
        <div className="absolute left-0 w-full h-[3px] bg-[#33C3F0]/50 hud-scan" style={{
          boxShadow: '0 0 15px rgba(51, 195, 240, 0.7), 0 0 30px rgba(51, 195, 240, 0.3)',
          filter: 'contrast(1.5) brightness(1.5)'
        }}></div>
        
        {/* Interference lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-[1px] w-full bg-[#33C3F0]"
              style={{
                top: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.3,
                boxShadow: '0 0 8px rgba(51, 195, 240, 0.8)',
                animation: `hologram-flicker ${1 + Math.random() * 2}s infinite ${Math.random()}s`,
                zIndex: 3
              }}
            ></div>
          ))}
        </div>
        
        {/* Edge glow effect */}
        <div className="absolute inset-0 pointer-events-none border border-[#33C3F0]/30"
             style={{ boxShadow: 'inset 0 0 10px rgba(51, 195, 240, 0.3)' }}></div>
        
        {/* 3D depth effect overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#33C3F0]/10 via-transparent to-[#33C3F0]/5"></div>
        
        {/* Content with holographic effect */}
        <div className="relative z-1 holographic-text">
          {children}
        </div>
        
        {/* Flickering effect */}
        <div className="absolute inset-0 bg-[#33C3F0]/5 animate-hologram-flicker pointer-events-none" style={{ mixBlendMode: 'overlay' }}></div>
      </div>
    </div>
  );
};

export default HologramEffect;
