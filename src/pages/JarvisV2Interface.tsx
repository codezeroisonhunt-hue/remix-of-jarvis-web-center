
import React, { useEffect } from 'react';
import JarvisV2 from '@/components/JarvisV2';
import { toast } from '@/components/ui/sonner';

const JarvisV2Interface = () => {
  useEffect(() => {
    toast("CODE ZERO AI Activated", {
      description: "Welcome to Jarvis V2: The Ghost AI. Enhanced intelligence and stealth capabilities.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/50">
        <h1 className="text-jarvis text-2xl font-bold">CODE ZERO</h1>
        <div className="text-xs text-jarvis/50">GHOST AI SYSTEM v2.0</div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="h-full bg-gradient-to-b from-jarvis/5 to-black/30 rounded-lg overflow-hidden border border-jarvis/10">
          <JarvisV2 className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default JarvisV2Interface;
