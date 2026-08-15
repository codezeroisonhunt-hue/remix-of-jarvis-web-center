
import React, { useEffect, useRef } from 'react';
import ArcReactor from '@/components/background/ArcReactor';

interface JarvisBackgroundProps {
  hackerModeActive: boolean;
}

const JarvisBackground: React.FC<JarvisBackgroundProps> = ({ hackerModeActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Advanced particle system for normal mode
  useEffect(() => {
    if (hackerModeActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
    }[] = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 3,
        speed: 0.2 + Math.random() * 0.8,
        opacity: 0.1 + Math.random() * 0.3,
        color: `rgba(51, 195, 240, ${0.3 + Math.random() * 0.7})`
      });
    }
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        
        // Add glow
        ctx.shadowColor = 'rgba(51, 195, 240, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        
        // Reset shadow and opacity
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Move particle upward
        particle.y -= particle.speed;
        
        // Reset particle if it goes beyond screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      // Draw connections between nearby particles
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const opacity = 1 - distance / 150;
            ctx.strokeStyle = `rgba(51, 195, 240, ${opacity * 0.2})`;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(draw);
    };
    
    const animationId = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hackerModeActive]);
  
  // Hacker mode matrix effect
  useEffect(() => {
    if (!hackerModeActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const characters = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ0123456789";
    
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops: number[] = Array(columns).fill(1);
    
    const matrix = () => {
      // Black with opacity for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Green text
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Randomly reset drop position with some chance
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    const interval = setInterval(matrix, 40);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hackerModeActive]);

  return (
    <>
      {/* Background canvas for particle effects */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
    
      {/* Apply hacker background effects if in hacker mode */}
      {hackerModeActive && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 hacker-grid opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/20"></div>
          
          {/* Scan lines */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 50, 50, 0.1) 3px, transparent 3px)',
            backgroundSize: '100% 4px'
          }}></div>
          
          {/* Red alerts */}
          <div className="absolute top-0 right-0 p-4 text-red-500 text-xs font-mono animate-pulse">
            SECURITY BREACH DETECTED
          </div>
          <div className="absolute bottom-0 left-0 p-4 text-red-500 text-xs font-mono">
            TRACING...
          </div>
        </div>
      )}
      
      {/* Normal Jarvis background */}
      {!hackerModeActive && (
        <div className="absolute inset-0 z-0">
          {/* Dark background with subtle hex pattern */}
          <div className="absolute inset-0 bg-jarvis-bg hex-grid"></div>
          
          {/* Circular gradient in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] rounded-full bg-[#33C3F0]/5 blur-[100px]"></div>
          
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(51, 195, 240, 0.05) 25%, rgba(51, 195, 240, 0.05) 26%, transparent 27%, transparent 74%, rgba(51, 195, 240, 0.05) 75%, rgba(51, 195, 240, 0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Vertical lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(90deg, transparent 24%, rgba(51, 195, 240, 0.03) 25%, rgba(51, 195, 240, 0.03) 26%, transparent 27%, transparent 74%, rgba(51, 195, 240, 0.03) 75%, rgba(51, 195, 240, 0.03) 76%, transparent 77%, transparent)',
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Moving horizontal scan line */}
          <div className="absolute inset-0">
            <div className="hud-scan"></div>
          </div>
          
          {/* Tech circuit patterns in corners */}
          <div className="absolute top-0 left-0 w-64 h-64 opacity-20" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 800 800\'%3E%3Cg fill=\'none\' stroke=\'%231eaedb\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3Cpath d=\'M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382\'/%3E%3Cpath d=\'M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269\'/%3E%3C/g%3E%3Cg fill=\'%231eaedb\'%3E%3Ccircle cx=\'769\' cy=\'229\' r=\'5\'/%3E%3Ccircle cx=\'539\' cy=\'269\' r=\'5\'/%3E%3Ccircle cx=\'603\' cy=\'493\' r=\'5\'/%3E%3Ccircle cx=\'731\' cy=\'737\' r=\'5\'/%3E%3Ccircle cx=\'520\' cy=\'660\' r=\'5\'/%3E%3Ccircle cx=\'309\' cy=\'538\' r=\'5\'/%3E%3Ccircle cx=\'295\' cy=\'764\' r=\'5\'/%3E%3Ccircle cx=\'40\' cy=\'599\' r=\'5\'/%3E%3Ccircle cx=\'102\' cy=\'382\' r=\'5\'/%3E%3Ccircle cx=\'127\' cy=\'80\' r=\'5\'/%3E%3Ccircle cx=\'370\' cy=\'105\' r=\'5\'/%3E%3Ccircle cx=\'578\' cy=\'42\' r=\'5\'/%3E%3Ccircle cx=\'237\' cy=\'261\' r=\'5\'/%3E%3Ccircle cx=\'390\' cy=\'382\' r=\'5\'/%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
          
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 800 800\'%3E%3Cg fill=\'none\' stroke=\'%231eaedb\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3Cpath d=\'M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382\'/%3E%3Cpath d=\'M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269\'/%3E%3C/g%3E%3Cg fill=\'%231eaedb\'%3E%3Ccircle cx=\'769\' cy=\'229\' r=\'5\'/%3E%3Ccircle cx=\'539\' cy=\'269\' r=\'5\'/%3E%3Ccircle cx=\'603\' cy=\'493\' r=\'5\'/%3E%3Ccircle cx=\'731\' cy=\'737\' r=\'5\'/%3E%3Ccircle cx=\'520\' cy=\'660\' r=\'5\'/%3E%3Ccircle cx=\'309\' cy=\'538\' r=\'5\'/%3E%3Ccircle cx=\'295\' cy=\'764\' r=\'5\'/%3E%3Ccircle cx=\'40\' cy=\'599\' r=\'5\'/%3E%3Ccircle cx=\'102\' cy=\'382\' r=\'5\'/%3E%3Ccircle cx=\'127\' cy=\'80\' r=\'5\'/%3E%3Ccircle cx=\'370\' cy=\'105\' r=\'5\'/%3E%3Ccircle cx=\'578\' cy=\'42\' r=\'5\'/%3E%3Ccircle cx=\'237\' cy=\'261\' r=\'5\'/%3E%3Ccircle cx=\'390\' cy=\'382\' r=\'5\'/%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
      )}
      
      <ArcReactor size="large" intensity={hackerModeActive ? 'low' : 'high'} />
      
      {/* Atmospheric gradient overlay */}
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${
        hackerModeActive ? 'from-red-900/20' : 'from-[#1eaedb]/10'
      } to-transparent z-0`}></div>
    </>
  );
};

export default JarvisBackground;
