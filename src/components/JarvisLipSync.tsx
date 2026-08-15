
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface JarvisLipSyncProps {
  className?: string;
}

const JarvisLipSync: React.FC<JarvisLipSyncProps> = ({ className }) => {
  const lipRef = useRef<HTMLDivElement>(null);
  
  // Animation frames for different phonemes (mouth shapes)
  const lipShapes = {
    rest: { height: '2px', width: '20px' },
    a: { height: '8px', width: '20px' },
    e: { height: '5px', width: '25px' },
    i: { height: '4px', width: '15px' },
    o: { height: '10px', width: '20px' },
    u: { height: '6px', width: '12px' }
  };
  
  useEffect(() => {
    if (!lipRef.current) return;
    
    // Simple lip sync animation that cycles through different mouth shapes
    const animateLips = () => {
      const shapes = Object.values(lipShapes);
      let currentShapeIndex = 0;
      
      const interval = setInterval(() => {
        if (!lipRef.current) return;
        
        const currentShape = shapes[currentShapeIndex];
        lipRef.current.style.height = currentShape.height;
        lipRef.current.style.width = currentShape.width;
        
        currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
      }, 150); // Change mouth shape every 150ms
      
      return () => clearInterval(interval);
    };
    
    const cleanup = animateLips();
    return cleanup;
  }, []);
  
  return (
    <div className={cn("absolute z-10", className)} style={{ bottom: '40%', left: '50%', transform: 'translateX(-50%)' }}>
      <div 
        ref={lipRef}
        className="bg-jarvis rounded-full transition-all duration-100"
        style={{ 
          height: '2px', 
          width: '20px',
          boxShadow: '0 0 5px rgba(14,165,233,0.8)'
        }}
      ></div>
    </div>
  );
};

export default JarvisLipSync;
