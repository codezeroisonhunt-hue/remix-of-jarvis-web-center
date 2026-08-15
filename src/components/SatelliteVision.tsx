
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Satellite, MapPin, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from './ui/sonner';
import { getSatelliteData } from '@/services/starkTechService';

interface SatelliteVisionProps {
  initialLocation?: string;
}

const SatelliteVision: React.FC<SatelliteVisionProps> = ({ initialLocation }) => {
  const [location, setLocation] = useState<string>(initialLocation || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleViewSatellite = () => {
    if (!location.trim()) {
      toast("Please provide a location to view");
      return;
    }
    
    setIsLoading(true);
    
    // Use the existing starkTechService to fetch satellite data
    getSatelliteData(location)
      .then(() => {
        // Navigate to the satellite surveillance page with the location as a query parameter
        navigate(`/satellite?location=${encodeURIComponent(location)}`);
      })
      .catch((error) => {
        console.error("Error fetching satellite data:", error);
        toast("Error loading satellite data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const openFullSatelliteView = () => {
    navigate('/satellite');
  };
  
  return (
    <Card className="bg-black/50 border-jarvis/20 overflow-hidden">
      <CardHeader className="bg-black/70 border-b border-jarvis/20 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="h-4 w-4 text-jarvis" />
            <CardTitle className="text-sm font-medium text-jarvis">Satellite Vision</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-jarvis hover:bg-jarvis/20" onClick={openFullSatelliteView}>
            <Eye className="h-4 w-4 mr-1" />
            Full View
          </Button>
        </div>
        <CardDescription className="text-xs text-gray-400">
          View satellite imagery of any location
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (e.g., New York)"
              className="w-full pl-8 pr-3 py-2 bg-black/40 border border-jarvis/30 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-jarvis/50"
            />
          </div>
          <Button 
            onClick={handleViewSatellite} 
            disabled={isLoading || !location.trim()} 
            className="bg-jarvis hover:bg-jarvis/80 text-black"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-t-2 border-black rounded-full"></div>
            ) : (
              <Satellite className="h-4 w-4 mr-1" />
            )}
            View
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-black/70 border-t border-jarvis/20 p-2">
        <p className="text-xs text-gray-400">Voice Command: "Show satellite view of [location]"</p>
      </CardFooter>
    </Card>
  );
};

export default SatelliteVision;
