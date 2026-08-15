
import React from 'react';

const ArcReactorBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-[-1]">
      <div className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] animate-reactor-rotate opacity-20">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-[40px] border-[#FFD700]/20 rounded-full" />
        
        {/* Inner Rings */}
        <div className="absolute inset-[80px] border-[20px] border-[#B30000]/30 rounded-full animate-reactor-pulse" />
        <div className="absolute inset-[120px] border-[10px] border-[#FFD700]/40 rounded-full animate-spin-reverse" />
        
        {/* Core */}
        <div className="absolute inset-[160px] bg-gradient-to-r from-[#B30000]/50 to-[#FFD700]/50 rounded-full animate-reactor-pulse">
          {/* Inner Core Elements */}
          <div className="absolute inset-[40px] border-[15px] border-[#B30000]/60 rounded-full" />
          <div className="absolute inset-[80px] bg-[#FFD700]/70 rounded-full animate-reactor-glow" />
        </div>

        {/* Decorative Lines */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-[#B30000]/0 to-[#FFD700]/30"
            style={{
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: '0 50%'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArcReactorBackground;
