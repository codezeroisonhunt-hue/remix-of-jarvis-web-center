
import React, { useState, useRef, useEffect } from 'react';
import P5Sketch from './P5Sketch';
import ThreeScene from './ThreeScene';
import { X, RotateCcw, Maximize2, Minimize2, Settings, Code, Eye } from 'lucide-react';
import HologramEffect from '@/components/ui/hologram-effect';
import JarvisVisualizer from '@/components/JarvisVisualizer';

interface HologramScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const HologramScreen: React.FC<HologramScreenProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'p5' | 'three'>('three');
  const [showIntro, setShowIntro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Show introduction animation when opened
  useEffect(() => {
    if (isOpen) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  if (!isOpen) return null;
  
  // JARVIS hologram readout data
  const mockData = {
    systemStatus: "OPERATIONAL",
    cpuUsage: "32%",
    memoryUsage: "48%",
    temperature: "36.7°C",
    networkStatus: "SECURE",
    coordinates: { lat: 34.05, lng: -118.25 },
    timestamp: new Date().toISOString()
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col">
      {showIntro ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <HologramEffect intensity="high">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-wider mb-4">JARVIS HOLOGRAM</h1>
              <div className="text-xl">Initializing Advanced Interface...</div>
              <div className="mt-2 text-sm opacity-70">Quantum Rendering Engine v4.2</div>
              <JarvisVisualizer className="mt-6" complexity="advanced" />
              
              {/* Animated loading indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#33C3F0] rounded-full"
                    style={{
                      animation: `pulse 1s ease-in-out ${i * 0.2}s infinite alternate`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </HologramEffect>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center p-3 border-b border-jarvis/30 bg-black/80">
            <h2 className="text-xl font-semibold text-jarvis flex items-center gap-2">
              <Eye className="w-5 h-5" />
              JARVIS Holographic Interface
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-hidden border border-jarvis/30">
                <button 
                  onClick={() => setActiveTab('p5')}
                  className={`px-3 py-1.5 text-sm flex items-center gap-1 ${activeTab === 'p5' ? 'bg-jarvis/20 text-jarvis' : 'bg-black/40 text-gray-400'}`}
                >
                  <Code size={14} />
                  P5.js
                </button>
                <button 
                  onClick={() => setActiveTab('three')}
                  className={`px-3 py-1.5 text-sm flex items-center gap-1 ${activeTab === 'three' ? 'bg-jarvis/20 text-jarvis' : 'bg-black/40 text-gray-400'}`}
                >
                  <Maximize2 size={14} />
                  Three.js
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-1.5 rounded-full hover:bg-jarvis/20 text-gray-400 hover:text-jarvis transition-colors"
                  title="Toggle info panel"
                >
                  <Settings size={18} />
                </button>
                
                <button
                  onClick={() => setRotationSpeed(prev => prev === 1 ? 2 : 1)}
                  className="p-1.5 rounded-full hover:bg-jarvis/20 text-gray-400 hover:text-jarvis transition-colors"
                  title="Adjust rotation speed"
                >
                  <RotateCcw size={18} />
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-full hover:bg-jarvis/20 text-gray-400 hover:text-jarvis transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                
                <button 
                  onClick={onClose} 
                  className="p-1.5 rounded-full hover:bg-black/40 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close hologram"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            {/* Main hologram container */}
            <div className="absolute inset-0">
              {activeTab === 'p5' ? (
                <P5Sketch />
              ) : (
                <ThreeScene rotationSpeed={rotationSpeed} />
              )}
            </div>
            
            {/* Info panel */}
            {showInfo && (
              <div className="absolute top-4 left-4 p-4 bg-black/60 backdrop-blur-lg border border-jarvis/30 rounded-lg w-64 text-sm">
                <h3 className="text-jarvis mb-2">System Information</h3>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-400">{mockData.systemStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU:</span>
                    <span>{mockData.cpuUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span>{mockData.memoryUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span>{mockData.temperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span className="text-green-400">{mockData.networkStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Render Engine:</span>
                    <span>{activeTab === 'three' ? 'Three.js' : 'P5.js'}</span>
                  </div>
                </div>
                
                {/* Rotation speed slider */}
                <div className="mt-4">
                  <label className="text-xs text-gray-400 block">Rotation Speed</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-jarvis/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
            
            {/* Overlay hologram effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Scan lines */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(51, 195, 240, 0.1) 3px, transparent 3px)',
                backgroundSize: '100% 3px'
              }}></div>
              
              {/* Edge glow */}
              <div className="absolute inset-0 border border-jarvis/30" 
                   style={{ boxShadow: 'inset 0 0 20px rgba(51, 195, 240, 0.3)' }}>
              </div>
              
              {/* Corner elements for HUD feel */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-jarvis/50"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-jarvis/50"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-jarvis/50"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-jarvis/50"></div>
              
              {/* Status indicators */}
              <div className="absolute bottom-4 left-4">
                <JarvisVisualizer isActive={true} amplitude={15} className="w-40" />
              </div>
              
              {/* Coordinates display */}
              <div className="absolute top-4 right-4 text-xs text-jarvis font-mono flex flex-col items-end">
                <div>COORDINATES: {mockData.coordinates.lat}°N / {mockData.coordinates.lng}°W</div>
                <div className="mt-1">SYSTEM: {mockData.systemStatus}</div>
                <div className="mt-1">RENDER ENGINE: {activeTab.toUpperCase()}</div>
                
                {/* Time display */}
                <div className="mt-4 text-[10px] opacity-70">{new Date().toLocaleTimeString()}</div>
              </div>
              
              {/* Moving scan line */}
              <div className="absolute left-0 w-full h-[2px] bg-[rgba(51,195,240,0.5)] hud-scan"></div>
              
              {/* Data stream display */}
              <div className="absolute bottom-4 right-4 max-w-[200px] text-right">
                <div className="text-[10px] font-mono text-jarvis/50 whitespace-nowrap overflow-hidden">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="truncate">
                      {(Math.random().toString(36) + '00000000000000000').slice(2, 12 + i)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HologramScreen;
