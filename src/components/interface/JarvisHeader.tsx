
import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Image, Terminal, Volume2, VolumeX } from 'lucide-react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import UserProfileButton from '@/components/auth/UserProfileButton';
import { useAuth } from '@/contexts/AuthContext';

interface JarvisHeaderProps {
  hackerModeActive: boolean;
  activeAssistant: string;
  toggleMute: () => void;
  isMuted: boolean;
}

const JarvisHeader: React.FC<JarvisHeaderProps> = ({
  hackerModeActive,
  activeAssistant,
  toggleMute,
  isMuted
}) => {
  const { user } = useAuth();

  return (
    <div className={`w-full jarvis-panel flex items-center justify-between p-3 ${hackerModeActive ? 'border-red-500/20' : 'border-jarvis/20'}`}>
      <div className="flex items-center">
        <div className={`text-xl font-bold ${hackerModeActive ? 'hacker-text' : 'text-jarvis text-glow'} mr-2`}>JARVIS</div>
        <div className={`text-xs uppercase ${hackerModeActive ? 'bg-red-900/20 text-red-400' : 'bg-jarvis/20 text-jarvis'} px-2 py-0.5 rounded`}>
          {hackerModeActive ? 'v2.0 SECURE' : 'v2.0'}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link to="/images" className={`flex items-center ${hackerModeActive ? 'text-red-400 hover:text-red-300' : 'text-jarvis hover:text-jarvis/80'} transition-colors`}>
          <Image className="h-4 w-4 mr-1" />
          <span className="text-sm">Image Studio</span>
        </Link>
        <div className="flex items-center text-sm">
          <div className={`h-2 w-2 rounded-full mr-2 ${hackerModeActive ? 'bg-red-500 animate-pulse' : 'bg-jarvis'}`}></div>
          <span className={hackerModeActive ? 'text-red-400' : 'text-jarvis'}>System Online</span>
        </div>
        {activeAssistant !== 'jarvis' && (
          <div className="flex items-center text-sm">
            <Bot className={`h-3 w-3 mr-1 ${hackerModeActive ? 'text-red-400' : 'text-jarvis'}`} />
            <span className={`${hackerModeActive ? 'text-red-400' : 'text-jarvis'} capitalize`}>{activeAssistant} enabled</span>
          </div>
        )}
        {hackerModeActive && (
          <div className="flex items-center text-sm">
            <Terminal className="h-3 w-3 mr-1 text-red-400" />
            <span className="text-red-400 animate-pulse">HACKER MODE</span>
          </div>
        )}
        <button 
          onClick={toggleMute}
          className={hackerModeActive ? 'text-red-400 hover:text-red-300 transition-colors' : 'text-jarvis hover:text-jarvis/80 transition-colors'}
        >
          {isMuted ? 
            <VolumeX className="h-4 w-4" /> : 
            <Volume2 className="h-4 w-4" />
          }
        </button>
        
        {/* Authentication UI */}
        {user ? (
          <UserProfileButton />
        ) : (
          <GoogleSignInButton variant="outline" size="sm" />
        )}
      </div>
    </div>
  );
};

export default JarvisHeader;
