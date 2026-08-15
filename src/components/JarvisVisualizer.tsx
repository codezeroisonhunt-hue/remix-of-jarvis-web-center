
import React, { useEffect, useRef, useState } from 'react';

interface JarvisVisualizerProps {
  isActive?: boolean;
  amplitude?: number;
  className?: string;
  complexity?: 'simple' | 'advanced';
  color?: string;
}

const JarvisVisualizer: React.FC<JarvisVisualizerProps> = ({ 
  isActive = true, 
  amplitude = 35,
  className = '',
  complexity = 'advanced',
  color = 'rgba(51, 195, 240, 0.8)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 80 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const updateDimensions = () => {
      if (canvas.parentElement) {
        const { width } = canvas.parentElement.getBoundingClientRect();
        canvas.width = width;
        canvas.height = 80;
        setDimensions({ width, height: 80 });
      }
    };
    
    // Initial setup
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    let animationId: number;
    let phase = 0;
    
    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw waveform
      const centerY = canvas.height / 2;
      const segmentWidth = complexity === 'advanced' ? 1 : 2;
      const segments = Math.floor(canvas.width / segmentWidth);
      
      // Create multiple layers for advanced mode
      if (complexity === 'advanced') {
        // First layer - main waveform
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let i = 0; i < segments; i++) {
          const x = i * segmentWidth;
          const waveAmplitude = isActive ? amplitude : 5;
          const frequency = isActive ? 0.03 : 0.01;
          const noise = isActive ? Math.random() * 5 : 0;
          
          const y = centerY + 
            Math.sin(i * frequency + phase) * waveAmplitude + 
            Math.sin(i * 0.02 - phase * 2) * (waveAmplitude / 3) +
            noise;
          
          ctx.lineTo(x, y);
        }
        
        // Create gradient for main wave
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, color.replace('0.8', '0.5'));
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, color.replace('0.8', '0.5'));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Second layer - mirror wave with offset
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let i = 0; i < segments; i++) {
          const x = i * segmentWidth;
          const waveAmplitude = isActive ? amplitude * 0.7 : 3;
          const frequency = isActive ? 0.02 : 0.01;
          
          const y = centerY - 
            Math.sin(i * frequency + phase * 1.3) * waveAmplitude - 
            Math.sin(i * 0.015 - phase) * (waveAmplitude / 2);
          
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = color.replace('0.8', '0.3');
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Third layer - central fine line
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let i = 0; i < segments; i++) {
          const x = i * segmentWidth;
          const y = centerY + 
            Math.sin(i * 0.05 - phase * 3) * (amplitude * 0.2);
          
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = color.replace('0.8', '0.9');
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add data points for tech feel
        if (isActive) {
          for (let i = 0; i < 8; i++) {
            const x = Math.random() * canvas.width;
            const y = centerY + (Math.random() - 0.5) * amplitude * 1.5;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            // Add connecting line from point to center
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, centerY);
            ctx.strokeStyle = color.replace('0.8', '0.3');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
      } else {
        // Simple mode - just one waveform
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let i = 0; i < segments; i++) {
          const x = i * segmentWidth;
          const waveAmplitude = isActive ? amplitude : 5;
          const frequency = isActive ? 0.03 : 0.01;
          const noise = isActive ? Math.random() * 5 : 0;
          
          const y = centerY + 
            Math.sin(i * frequency + phase) * waveAmplitude + 
            Math.sin(i * 0.02 - phase * 2) * (waveAmplitude / 3) +
            noise;
          
          ctx.lineTo(x, y);
        }
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(51, 195, 240, 0.5)');
        gradient.addColorStop(0.5, 'rgba(51, 195, 240, 0.8)');
        gradient.addColorStop(1, 'rgba(51, 195, 240, 0.5)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = 'rgba(51, 195, 240, 0.8)';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }
      
      // Update phase for animation
      phase += isActive ? 0.05 : 0.02;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [isActive, amplitude, complexity, color]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ display: 'block' }} 
        width={dimensions.width} 
        height={dimensions.height}
      />
    </div>
  );
};

export default JarvisVisualizer;
