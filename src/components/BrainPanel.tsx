
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, Zap, Bell, PieChart, List, Gauge, Star, CloudSun, MapPin } from 'lucide-react';
import { useJarvisChat } from './JarvisChatContext';
import { TaskList } from './TaskList';
import { EmotionalIntelligence } from '../features/EmotionalIntelligence';
import { NLP } from '../features/NLP';
import { WeatherContextProvider } from '../features/WeatherContext';
import { LocationAwareness } from '../features/LocationAwareness';

interface BrainPanelProps {
  isHackerMode?: boolean;
}

const BrainPanel: React.FC<BrainPanelProps> = ({ isHackerMode = false }) => {
  // Use try-catch to handle missing context
  let messages = [];
  try {
    const context = useJarvisChat();
    messages = context?.messages || [];
  } catch (error) {
    console.warn("JarvisChat context not available in BrainPanel, using default values");
  }
  
  const [cpuUsage, setCpuUsage] = React.useState(42);
  const [ramUsage, setRamUsage] = React.useState(35);
  const [networkUsage, setNetworkUsage] = React.useState(28);
  
  // Sample emotional data adapted to match the expected types
  const [emotionalData] = React.useState({
    emotions: {
      joy: 0.2,
      surprise: 0.1,
      anger: 0.05,
      sadness: 0.05
    },
    sentiment: {
      score: 0.3,
      comparative: 0.4,
      type: "positive"
    }
  });

  // User location state
  const [userLocation, setUserLocation] = React.useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  
  // Simulated system stats that update periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30);
      setRamUsage(Math.floor(Math.random() * 40) + 20);
      setNetworkUsage(Math.floor(Math.random() * 50) + 10);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Get user location if browser supports it
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLocationError(error.message);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setLocationError("Geolocation not supported by your browser");
    }
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* System Monitor Card */}
      <Card className={`${isHackerMode ? 'bg-black/80 border-red-500/20' : 'bg-black/40 border-jarvis/20'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`flex items-center text-lg ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
            <Gauge className="mr-2 h-5 w-5" /> System Monitor
          </CardTitle>
          <CardDescription>Resource utilization statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>CPU Usage</span>
              <span className={isHackerMode ? 'text-red-400' : 'text-jarvis'}>{cpuUsage}%</span>
            </div>
            <Progress value={cpuUsage} className={isHackerMode ? 'bg-red-900/20' : 'bg-jarvis/20'} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Memory Allocation</span>
              <span className={isHackerMode ? 'text-red-400' : 'text-jarvis'}>{ramUsage}%</span>
            </div>
            <Progress value={ramUsage} className={isHackerMode ? 'bg-red-900/20' : 'bg-jarvis/20'} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Network Activity</span>
              <span className={isHackerMode ? 'text-red-400' : 'text-jarvis'}>{networkUsage}%</span>
            </div>
            <Progress value={networkUsage} className={isHackerMode ? 'bg-red-900/20' : 'bg-jarvis/20'} />
          </div>
          
          <div className="mt-2 flex gap-2">
            <div className={`p-2 rounded-md ${isHackerMode ? 'bg-red-900/20 text-red-400' : 'bg-jarvis/20 text-jarvis'}`}>
              <span className="text-xs font-mono">PID: 8423</span>
            </div>
            <div className={`p-2 rounded-md ${isHackerMode ? 'bg-red-900/20 text-red-400' : 'bg-jarvis/20 text-jarvis'} animate-pulse`}>
              <span className="text-xs font-mono">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Core Intelligence Card */}
      <Card className={`${isHackerMode ? 'bg-black/80 border-red-500/20' : 'bg-black/40 border-jarvis/20'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`flex items-center text-lg ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
            <Brain className="mr-2 h-5 w-5" /> Core Intelligence
          </CardTitle>
          <CardDescription>JARVIS neural processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Neural Processing</span>
            <Loader2 
              className={`animate-spin ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`} 
              size={18} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Intelligence Capacity</span>
              <span className={isHackerMode ? 'text-red-400' : 'text-jarvis'}>87%</span>
            </div>
            <Progress value={87} className={isHackerMode ? 'bg-red-900/20' : 'bg-jarvis/20'} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Learning Module</span>
              <span className={isHackerMode ? 'text-red-400' : 'text-jarvis'}>64%</span>
            </div>
            <Progress value={64} className={isHackerMode ? 'bg-red-900/20' : 'bg-jarvis/20'} />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className={`p-2 rounded text-center ${isHackerMode ? 'bg-red-900/20 text-red-400' : 'bg-jarvis/20 text-jarvis'}`}>
              <Zap className="h-4 w-4 mx-auto mb-1" />
              <span className="text-xs">Decision Engine</span>
            </div>
            <div className={`p-2 rounded text-center ${isHackerMode ? 'bg-red-900/20 text-red-400' : 'bg-jarvis/20 text-jarvis'}`}>
              <Star className="h-4 w-4 mx-auto mb-1" />
              <span className="text-xs">Memory System</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Task Management */}
      <Card className={`${isHackerMode ? 'bg-black/80 border-red-500/20' : 'bg-black/40 border-jarvis/20'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`flex items-center text-lg ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
            <List className="mr-2 h-5 w-5" /> Task Management
          </CardTitle>
          <CardDescription>Current tasks and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList isHackerMode={isHackerMode} />
        </CardContent>
      </Card>
      
      {/* Location Awareness & Weather Context */}
      <Card className={`${isHackerMode ? 'bg-black/80 border-red-500/20' : 'bg-black/40 border-jarvis/20'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`flex items-center text-lg ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
            <MapPin className="mr-2 h-5 w-5" /> Location Awareness
          </CardTitle>
          <CardDescription>Contextual location information</CardDescription>
        </CardHeader>
        <CardContent>
          <WeatherContextProvider>
            <LocationAwareness 
              userLocation={userLocation} 
              isLoading={isLoadingLocation}
              error={locationError}
              isHackerMode={isHackerMode}
            />
          </WeatherContextProvider>
        </CardContent>
      </Card>
      
      {/* Emotional Intelligence */}
      <Card className={`${isHackerMode ? 'bg-black/80 border-red-500/20' : 'bg-black/40 border-jarvis/20'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`flex items-center text-lg ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
            <PieChart className="mr-2 h-5 w-5" /> Emotional Intelligence
          </CardTitle>
          <CardDescription>Understanding emotional context</CardDescription>
        </CardHeader>
        <CardContent>
          <EmotionalIntelligence 
            emotions={emotionalData.emotions}
            sentiment={emotionalData.sentiment}
          />
        </CardContent>
      </Card>
      
      {/* Natural Language Processing */}
      <Card className={`${isHackerMode ? 'bg-black/80 border-red-500/20' : 'bg-black/40 border-jarvis/20'} md:col-span-2`}>
        <CardHeader className="pb-2">
          <CardTitle className={`flex items-center text-lg ${isHackerMode ? 'text-red-400' : 'text-jarvis'}`}>
            <Bell className="mr-2 h-5 w-5" /> Natural Language Processing
          </CardTitle>
          <CardDescription>Understanding and responding to language</CardDescription>
        </CardHeader>
        <CardContent>
          <NLP />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrainPanel;
