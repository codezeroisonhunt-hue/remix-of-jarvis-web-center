
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getWeatherForecast } from '@/services/weatherService';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  location?: string;
  forecast?: Array<{
    day: string;
    temperature: number;
    condition: string;
  }>;
}

interface WeatherContextType {
  weather: WeatherData | null;
  fetchWeather: (latitude: number, longitude: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  subscribedLocations: string[];
  subscribeToLocation: (location: string) => Promise<void>;
  unsubscribeFromLocation: (location: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeatherContext = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherContextProvider");
  }
  return context;
};

export const WeatherContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscribedLocations, setSubscribedLocations] = useState<string[]>([]);
  const [weatherChannel, setWeatherChannel] = useState<any>(null);

  // Initialize Supabase Realtime channel for weather updates
  useEffect(() => {
    const channel = supabase.channel('weather_updates', {
      config: {
        broadcast: { self: true },
      }
    });

    channel
      .on('broadcast', { event: 'weather_update' }, (payload) => {
        console.log('Received weather update:', payload);
        if (payload.payload && payload.payload.data) {
          const weatherData = payload.payload.data as WeatherData;
          
          // Only update if this is for a location we're subscribed to
          if (subscribedLocations.includes(weatherData.location || '')) {
            setWeather(weatherData);
            
            toast({
              title: "Weather Updated",
              description: `Weather for ${weatherData.location} updated: ${weatherData.temperature}°C, ${weatherData.condition}`,
            });
          }
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to weather updates channel');
          setWeatherChannel(channel);
        }
      });

    return () => {
      console.log('Removing weather channel');
      supabase.removeChannel(channel);
    };
  }, [subscribedLocations]);

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now using mock data with the coordinates
      console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}`);
      const locationString = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      const weatherResponse = await getWeatherForecast({ location: "New York" });
      
      // Convert from the existing format to our new format
      const weatherData: WeatherData = {
        temperature: weatherResponse.current.temp,
        condition: weatherResponse.current.condition,
        humidity: weatherResponse.current.humidity,
        windSpeed: weatherResponse.current.windSpeed,
        icon: weatherResponse.current.icon,
        location: locationString,
        forecast: weatherResponse.forecast?.map((day: any) => ({
          day: day.day,
          temperature: day.temp,
          condition: day.condition
        }))
      };
      
      setWeather(weatherData);
      
      // Broadcast weather update to all connected clients
      if (weatherChannel) {
        try {
          await weatherChannel.send({
            type: 'broadcast',
            event: 'weather_update',
            payload: { data: weatherData }
          });
        } catch (error) {
          console.error('Error broadcasting weather data:', error);
        }
      }
      
      toast({
        title: "Weather Updated",
        description: `Weather data updated for your location`,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data");
      toast({
        title: "Weather Error",
        description: "Could not retrieve weather data for your location",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [weatherChannel]);

  // Subscribe to weather updates for a specific location
  const subscribeToLocation = useCallback(async (location: string) => {
    if (subscribedLocations.includes(location)) return;
    
    setSubscribedLocations(prev => [...prev, location]);
    
    toast({
      title: "Weather Subscription Added",
      description: `You'll receive updates for ${location}`,
    });
    
    // Fetch initial weather for the location
    try {
      // This would normally use the location string to get coordinates
      // For demo, we'll use random coordinates
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      await fetchWeather(lat, lon);
    } catch (error) {
      console.error("Error fetching initial weather for location:", error);
    }
  }, [subscribedLocations, fetchWeather]);

  // Unsubscribe from weather updates for a specific location
  const unsubscribeFromLocation = useCallback((location: string) => {
    setSubscribedLocations(prev => prev.filter(loc => loc !== location));
    
    toast({
      title: "Weather Subscription Removed",
      description: `You'll no longer receive updates for ${location}`,
    });
  }, []);

  const value = {
    weather,
    fetchWeather,
    isLoading,
    error,
    subscribedLocations,
    subscribeToLocation,
    unsubscribeFromLocation
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
