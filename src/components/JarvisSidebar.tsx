
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Image, Terminal, Settings, Layers, Satellite } from "lucide-react";
import { cn } from "../lib/utils";
import FaceDetection from "@/features/FaceDetection";

interface JarvisSidebarProps {
  onEmotionDetected?: (emotion: string) => void;
}

const JarvisSidebar: React.FC<JarvisSidebarProps> = ({ onEmotionDetected }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/interface", icon: <Home className="w-5 h-5" /> },
    { name: "Terminal", path: "/", icon: <Terminal className="w-5 h-5" /> },
    { name: "Image Gen", path: "/image-generation", icon: <Image className="w-5 h-5" /> },
    { name: "Satellite", path: "/satellite", icon: <Satellite className="w-5 h-5" /> },
    { name: "Features", path: "/features", icon: <Layers className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen w-16 bg-black/20 backdrop-blur-lg border-r border-white/10 flex flex-col items-center py-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "w-10 h-10 mb-4 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all",
            isActive(item.path) && "bg-white/10 text-white"
          )}
          title={item.name}
        >
          {item.icon}
        </Link>
      ))}
      
      {/* Pass the onEmotionDetected prop to FaceDetection */}
      {onEmotionDetected && (
        <div className="mt-4">
          <FaceDetection onEmotionDetected={onEmotionDetected} />
        </div>
      )}
    </div>
  );
};

export default JarvisSidebar;
