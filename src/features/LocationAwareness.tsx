
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWeatherContext } from './WeatherContext';

interface LocationAwarenessProps {
  userLocation: GeolocationPosition | null;
  isLoading: boolean;
  error: string | null;
  isHackerMode: boolean;
}

export const LocationAwareness: React.FC<LocationAwarenessProps> = ({
  userLocation,
  isLoading,
  error,
  isHackerMode
}) => {
  const [localTime, setLocalTime] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('Unknown');

  // Update local time every minute
  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString());
    };
    
    updateLocalTime();
    const interval = setInterval(updateLocalTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Get location name from coordinates using reverse geocoding
  useEffect(() => {
    if (userLocation) {
      const { latitude, longitude } = userLocation.coords;
      
      // Attempt to get location name
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`)
        .then(response => response.json())
        .then(data => {
          if (data && data.display_name) {
            // Extract city or locality from the address
            const parts = data.display_name.split(', ');
            setLocationName(parts[0] || parts[1] || data.display_name);
          }
        })
        .catch(err => {
          console.error('Error getting location name:', err);
          setLocationName('Unknown Location');
        });
    }
  }, [userLocation]);

  return (
    <Card className={`border-${isHackerMode ? 'red-500/30' : 'jarvis/30'} ${isHackerMode ? 'bg-black/20' : 'bg-black/10'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-white">
          <MapPin className="mr-2 h-4 w-4" />
          Location Awareness
        </CardTitle>
        <CardDescription className="text-gray-300">Current geographical context</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <div className="animate-spin h-5 w-5 border-2 border-jarvis rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{error}</span>
          </div>
        ) : userLocation ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">Current Location:</div>
                <Badge className={`bg-${isHackerMode ? 'red' : 'jarvis'}/20 text-white`}>
                  {locationName}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">Local Time:</div>
                <div className="flex items-center text-white">
                  <Clock className="h-3 w-3 mr-1 text-gray-300" />
                  <span className="text-sm">{localTime}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">Coordinates:</div>
                <div className="text-sm text-white">
                  {userLocation.coords.latitude.toFixed(4)}, {userLocation.coords.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-white">Location data unavailable</div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationAwareness;
