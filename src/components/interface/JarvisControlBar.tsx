
import React from 'react';
import ControlPanel from '@/components/ControlPanel';

interface ControlOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

interface JarvisControlBarProps {
  controlOptions: ControlOption[];
  onToggle: (id: string) => void;
}

const JarvisControlBar: React.FC<JarvisControlBarProps> = ({
  controlOptions,
  onToggle
}) => {
  return (
    <div className="p-4 z-10">
      <ControlPanel 
        options={controlOptions}
        onToggle={onToggle}
      />
    </div>
  );
};

export default JarvisControlBar;
