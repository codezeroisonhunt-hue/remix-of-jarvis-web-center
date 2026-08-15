import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { removeBackground, loadImage } from '../utils/imageUtils';

interface JarvisFaceAIProps {
  isSpeaking: boolean;
  className?: string;
}

const JarvisFaceAI: React.FC<JarvisFaceAIProps> = ({ isSpeaking, className }) => {
  const eyeLeftRef = useRef<HTMLDivElement>(null);
  const eyeRightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Process the image on component mount
  useEffect(() => {
    const processImage = async () => {
      try {
        // Fetch the original image
        const response = await fetch('/lovable-uploads/00ddfeb8-acf7-4356-9166-884c0b47bcaf.png');
        const imageBlob = await response.blob();
        
        // Load the image
        const img = await loadImage(imageBlob);
        
        // Remove background
        const processedBlob = await removeBackground(img);
        
        // Create URL for the processed image
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedImageUrl(processedUrl);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    };

    processImage();
  }, []);

  // Handle eye tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !eyeLeftRef.current || !eyeRightRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate angle between mouse and center
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      
      // Maximum movement radius in pixels
      const radius = 3;
      
      // Calculate eye movement
      const moveX = Math.cos(angle) * radius;
      const moveY = Math.sin(angle) * radius;

      [eyeLeftRef.current, eyeRightRef.current].forEach(eye => {
        if (eye) {
          eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add blinking animation
  useEffect(() => {
    const blink = () => {
      if (eyeLeftRef.current && eyeRightRef.current) {
        [eyeLeftRef.current, eyeRightRef.current].forEach(eye => {
          eye.style.transform = 'scaleY(0.1)';
          setTimeout(() => {
            if (eye) eye.style.transform = 'scaleY(1)';
          }, 100);
        });
      }
    };

    const blinkInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to blink
        blink();
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Handle face rotation
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !faceRef.current) return;

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setRotation(prev => ({
        x: (prev.x + deltaY * 0.5) % 360,
        y: (prev.y + deltaX * 0.5) % 360
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, lastMousePos]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-[200px] mx-auto transition-all duration-700 cursor-move",
        isSpeaking && "animate-breathe",
        className
      )}
    >
      {/* Enhanced glow effect when speaking */}
      <div className={cn(
        "absolute -inset-4 bg-jarvis/20 rounded-full blur-xl transition-opacity duration-500",
        isSpeaking ? "opacity-100" : "opacity-0"
      )} />
      
      <div 
        ref={faceRef}
        className="relative transition-transform"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {processedImageUrl ? (
          <div className="relative">
            <img 
              src={processedImageUrl}
              alt="JARVIS Face"
              className={cn(
                "w-full relative z-10 transition-transform duration-300",
                isSpeaking && "animate-subtle-bounce"
              )}
              style={{ backfaceVisibility: 'visible' }}
            />
            {/* Speaking animation rings */}
            {isSpeaking && (
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 rounded-full animate-ping-slow bg-jarvis/10" />
                <div className="absolute inset-0 rounded-full animate-ping-slow delay-300 bg-jarvis/5" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full animate-pulse bg-jarvis/20 rounded-full" />
        )}

        {/* Enhanced eyes with glow effect */}
        <div className="absolute top-[40%] left-[35%] w-3 h-3 z-20">
          <div 
            ref={eyeLeftRef}
            className={cn(
              "w-full h-full rounded-full bg-jarvis shadow-[0_0_8px_rgba(14,165,233,0.8)] transition-all duration-100",
              isSpeaking && "animate-pulse-subtle"
            )}
          />
        </div>
        <div className="absolute top-[40%] right-[35%] w-3 h-3 z-20">
          <div 
            ref={eyeRightRef}
            className={cn(
              "w-full h-full rounded-full bg-jarvis shadow-[0_0_8px_rgba(14,165,233,0.8)] transition-all duration-100",
              isSpeaking && "animate-pulse-subtle"
            )}
          />
        </div>
      </div>
      
      {/* Enhanced ripple effect when speaking */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full animate-ping bg-jarvis/20" />
          <div className="absolute inset-0 rounded-full animate-pulse bg-jarvis/10" />
        </>
      )}
    </div>
  );
};

export default JarvisFaceAI;
