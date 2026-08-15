
import React from 'react';

interface IronManBackgroundProps {
  isGlowing?: boolean;
  hackerMode?: boolean;
}

const IronManBackground: React.FC<IronManBackgroundProps> = ({ isGlowing, hackerMode = false }) => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className={`w-full h-full flex items-center justify-center ${isGlowing ? 'animate-pulse' : ''}`}>
        <div 
          className={`relative w-48 h-48 ${
            isGlowing 
              ? hackerMode 
                ? 'filter hue-rotate-[330deg] saturate-[1.5] brightness-[1.2] shadow-[0_0_15px_rgba(255,0,0,0.7)]' 
                : 'reactor-glow'
              : ''
          }`}
        >
          <img 
            src="/lovable-uploads/00ddfeb8-acf7-4356-9166-884c0b47bcaf.png"
            alt="Reactor Core"
            className="w-full h-full object-contain"
            style={{
              filter: hackerMode ? 'hue-rotate(330deg) saturate(1.5)' : 'none'
            }}
          />
        </div>
      </div>
      
      {hackerMode && (
        <>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHN0eWxlPgogICAgICAubGluZXMgewogICAgICAgICBzdHJva2U6IHJlZDsKICAgICAgICAgc3Ryb2tlLXdpZHRoOiAwLjU7CiAgICAgICAgIG9wYWNpdHk6IDAuMTsKICAgICAgfQogICAgPC9zdHlsZT4KPC9kZWZzPgo8ZyBjbGFzcz0ibGluZXMiPgogICAgPGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIC8+CiAgICA8bGluZSB4MT0iMCIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCIgLz4KICAgIDxsaW5lIHgxPSI1MCUiIHkxPSIwIiB4Mj0iNTAlIiB5Mj0iMTAwJSIgLz4KICAgIDxsaW5lIHgxPSIwIiB5MT0iNTAlIiB4Mj0iMTAwJSIgeTI9IjUwJSIgLz4KPC9nPgo8L3N2Zz4=')]"
            style={{ opacity: 0.15 }}
          ></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-[1px] w-full bg-red-500/40 absolute animate-wave" 
                style={{ 
                  animation: 'wave 2s linear infinite',
                  top: '50%',
                  boxShadow: '0 0 8px rgba(255, 0, 0, 0.8)'
                }}></div>
          </div>
        </>
      )}
    </div>
  );
};

export default IronManBackground;
