
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Sketch: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    // Define the p5 sketch
    const sketch = (p: p5) => {
      // Setup the canvas
      p.setup = () => {
        const width = sketchRef.current?.clientWidth || window.innerWidth;
        const height = sketchRef.current?.clientHeight || window.innerHeight;
        p.createCanvas(width, height);
      };

      // Draw function runs continuously
      p.draw = () => {
        p.background(0, 10);
        
        // Create a cool holographic effect
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        
        // Draw concentric circles
        for (let i = 0; i < 50; i++) {
          const size = i * 20 * (1 + Math.sin(p.frameCount * 0.01) * 0.2);
          const alpha = p.map(i, 0, 50, 255, 0);
          p.noFill();
          p.stroke(0, 200, 255, alpha);
          p.strokeWeight(1 + Math.sin(p.frameCount * 0.05 + i * 0.1) * 0.5);
          p.ellipse(centerX, centerY, size, size);
        }
        
        // Draw particles
        for (let i = 0; i < 100; i++) {
          const angle = i * Math.PI * 2 / 100 + p.frameCount * 0.01;
          const radius = 100 + Math.sin(p.frameCount * 0.05 + i * 0.1) * 50;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          p.fill(0, 200, 255, 200);
          p.noStroke();
          p.ellipse(x, y, 5, 5);
        }
        
        // Draw holographic text
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(30);
        p.fill(0, 200, 255, 150 + Math.sin(p.frameCount * 0.05) * 100);
        p.text("JARVIS HOLOGRAM", centerX, centerY);
      };

      // Handle window resize
      p.windowResized = () => {
        const width = sketchRef.current?.clientWidth || window.innerWidth;
        const height = sketchRef.current?.clientHeight || window.innerHeight;
        p.resizeCanvas(width, height);
      };
    };

    // Create a new p5 instance
    if (sketchRef.current && !p5Instance.current) {
      p5Instance.current = new p5(sketch, sketchRef.current);
    }

    // Cleanup
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  return <div ref={sketchRef} className="w-full h-full"></div>;
};

export default P5Sketch;
