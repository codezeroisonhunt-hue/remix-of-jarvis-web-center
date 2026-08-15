
import { useEffect } from 'react';
import HackerModeEffects, { GlitchText, AutoTypeText } from './HackerModeEffects';
import HackerSoundEffects from './HackerSoundEffects';
import { useHackerEffects } from '../../contexts/HackerEffectsContext';
import { Terminal } from 'lucide-react';

interface EnhancedHackerModeProps {
  isActive: boolean;
  terminalText?: string;
}

const EnhancedHackerMode = ({ isActive, terminalText }: EnhancedHackerModeProps) => {
  const { activateEffects, deactivateEffects, playCommandTick } = useHackerEffects();

  useEffect(() => {
    if (isActive) {
      activateEffects();
    } else {
      deactivateEffects();
    }

    return () => {
      deactivateEffects();
    };
  }, [isActive, activateEffects, deactivateEffects]);

  // Play tick sound when new terminal text appears
  useEffect(() => {
    if (terminalText && isActive) {
      playCommandTick();
    }
  }, [terminalText, isActive, playCommandTick]);

  if (!isActive) return null;

  return (
    <div className="relative">
      {/* Visual Effects */}
      <HackerModeEffects isActive={isActive} />
      
      {/* Sound Effects */}
      <HackerSoundEffects isActive={isActive} />
      
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 text-[#39ff14]">
        <Terminal size={18} />
        <GlitchText text="JARVIS TERMINAL v2.5.0" className="font-mono text-sm" />
      </div>
      
      {/* Terminal Content */}
      {terminalText && (
        <div className="font-mono text-sm text-[#39ff14] bg-black/80 p-3 rounded-md border border-[#39ff14]/30">
          <AutoTypeText text={terminalText} speed={25} />
        </div>
      )}
    </div>
  );
};

export default EnhancedHackerMode;
