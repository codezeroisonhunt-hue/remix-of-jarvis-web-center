
import React, { useEffect, useState } from 'react';
import { getWeatherForecast, WeatherData } from '@/services/weatherService';
import { CloudSun, CloudRain, Sun, Cloud, Plus, Trash2 } from 'lucide-react';
import { useWeatherContext } from '@/features/WeatherContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return <CloudRain className="h-8 w-8 text-[#33c3f0]" />;
  } else if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
    return <Sun className="h-8 w-8 text-yellow-400" />;
  } else if (lowerCondition.includes('cloud') && lowerCondition.includes('part')) {
    return <CloudSun className="h-8 w-8 text-[#33c3f0]" />;
  } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return <Cloud className="h-8 w-8 text-gray-300" />;
  }

  // Default icon
  return <CloudSun className="h-8 w-8 text-[#33c3f0]" />;
};

interface WeatherWidgetProps {
  isCompact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ isCompact = false }) => {
  const { 
    weather, 
    fetchWeather, 
    isLoading, 
    error,
    subscribedLocations,
    subscribeToLocation,
    unsubscribeFromLocation
  } = useWeatherContext();
  const [newLocation, setNewLocation] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Ask for user geolocation on mount
    if (!navigator.geolocation) {
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Fetch weather for current location
        await fetchWeather(position.coords.latitude, position.coords.longitude);
        
        // Also subscribe to current location for updates
        const locationString = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
        await subscribeToLocation(locationString);
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, [fetchWeather, subscribeToLocation]);

  const handleSubscribeLocation = () => {
    if (newLocation.trim()) {
      subscribeToLocation(newLocation.trim());
      setNewLocation('');
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20 flex justify-center items-center">
        <span className="text-[#33c3f0] text-sm">Loading weather data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20 flex flex-col items-center justify-center">
        <span className="text-red-400 text-sm">{error}</span>
      </div>
    );
  }

  if (!weather) return null;

  if (isCompact) {
    return (
      <div className="weather-widget-compact bg-black/40 p-3 rounded-lg border border-[#33c3f0]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(weather.condition)}
            <div className="ml-2">
              <div className="text-lg font-bold text-white">
                {weather.temperature}°C
              </div>
              <div className="text-xs text-[#33c3f0]/80">{weather.location}</div>
            </div>
          </div>
          <div className="text-sm text-gray-300">{weather.condition}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium">Weather</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Plus className="h-4 w-4 text-[#33c3f0]" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 border-[#33c3f0]/30">
            <DialogHeader>
              <DialogTitle>Add Weather Location</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2 mt-2">
              <Input 
                placeholder="Enter city or coordinates"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="bg-black/40 border-[#33c3f0]/30"
              />
              <Button 
                onClick={handleSubscribeLocation}
                disabled={!newLocation.trim()}
                className="bg-[#33c3f0] text-black hover:bg-[#33c3f0]/80"
              >
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center mb-4">
        {getWeatherIcon(weather.condition)}
        <div className="ml-3">
          <div className="text-2xl font-bold">{weather.temperature}°C</div>
          <div className="text-sm text-gray-300">{weather.condition}</div>
          <div className="text-xs text-[#33c3f0]/70">{weather.location}</div>
        </div>
      </div>

      {weather.forecast && (
        <div className="flex justify-between">
          {weather.forecast.slice(0, 4).map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-400">{day.day}</div>
              <div className="my-1">{getWeatherIcon(day.condition)}</div>
              <div className="text-xs font-medium">{day.temperature}°C</div>
            </div>
          ))}
        </div>
      )}
      
      {subscribedLocations.length > 0 && (
        <div className="mt-4 border-t border-[#33c3f0]/10 pt-3">
          <h4 className="text-xs text-[#33c3f0]/70 mb-2">Subscribed Locations</h4>
          <div className="flex flex-wrap gap-2">
            {subscribedLocations.map(location => (
              <div 
                key={location}
                className="bg-black/30 px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-[#33c3f0]/20"
              >
                <span className="text-white/80">{location}</span>
                <button
                  onClick={() => unsubscribeFromLocation(location)}
                  className="text-red-400/80 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
