
// Weather service to fetch weather data from API
interface WeatherRequestOptions {
  location: string;
  units?: 'metric' | 'imperial';
}

interface WeatherForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon?: string;
  // Adding maxTemp for compatibility with WeatherWidget
  maxTemp?: number;
  // Adding date for compatibility with WeatherWidget
  date?: string;
}

interface WeatherResponse {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  location: {
    name: string;
    country: string;
    region?: string;
  };
  forecast?: WeatherForecastDay[];
}

// Export the WeatherData interface for use in other files
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  forecast: {
    day: string;
    temperature: number;
    condition: string;
    icon: string;
    maxTemp?: number;
    date?: string;
  }[];
}

// Function to get weather forecast based on location
export const getWeatherForecast = async (options: WeatherRequestOptions): Promise<WeatherResponse> => {
  try {
    // For now we'll use mock data as we don't have a real weather API key
    // In a real implementation, you would make a fetch request to a weather API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response
    return {
      current: {
        temp: 22,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        icon: "partly-cloudy"
      },
      location: {
        name: options.location,
        country: "United States",
        region: "New York"
      },
      forecast: [
        { day: "Today", temp: 22, condition: "Partly Cloudy", icon: "partly-cloudy" },
        { day: "Tomorrow", temp: 24, condition: "Sunny", icon: "sunny" },
        { day: "Wed", temp: 20, condition: "Rain", icon: "rain" },
        { day: "Thu", temp: 19, condition: "Cloudy", icon: "cloudy" },
        { day: "Fri", temp: 21, condition: "Partly Cloudy", icon: "partly-cloudy" }
      ]
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw new Error("Failed to fetch weather data");
  }
};

// Function to get weather by coordinates (latitude and longitude)
export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherResponse> => {
  try {
    // In a real implementation you would make a fetch request to a weather API with coordinates
    // For now we'll use mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Random weather conditions based on coordinates to simulate different locations
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Thunderstorm"];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Temperature varies based on latitude to simulate climate differences (roughly)
    const baseTemp = Math.abs(lat) > 45 ? 10 : Math.abs(lat) > 30 ? 18 : 25;
    const temperature = baseTemp + Math.floor(Math.random() * 10) - 5;
    
    return {
      current: {
        temp: temperature,
        condition: randomCondition,
        humidity: 40 + Math.floor(Math.random() * 40),
        windSpeed: 5 + Math.floor(Math.random() * 20),
        icon: randomCondition.toLowerCase().replace(' ', '-')
      },
      location: {
        name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
        country: "Unknown Location"
      },
      forecast: [
        { day: "Today", temp: temperature, condition: randomCondition },
        { day: "Tomorrow", temp: temperature + Math.floor(Math.random() * 6) - 3, condition: conditions[Math.floor(Math.random() * conditions.length)] },
        { day: "Wed", temp: temperature + Math.floor(Math.random() * 6) - 3, condition: conditions[Math.floor(Math.random() * conditions.length)] }
      ]
    };
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw new Error("Failed to fetch weather data for your location");
  }
};

// Get weather response for Jarvis chat
export const getWeatherResponse = async (message: string): Promise<{
  text: string;
  data: any;
}> => {
  try {
    // Extract location from message or use default
    const locationMatch = message.match(/weather (?:in|at|for) (.+?)(?:\?|$|\.)/i);
    const location = locationMatch ? locationMatch[1] : "New York";
    
    const weatherData = await getWeatherForecast({ location });
    
    // Format response text
    const responseText = `Current weather in ${weatherData.location.name}: ${weatherData.current.condition} with a temperature of ${Math.round(weatherData.current.temp)}°C. Humidity is at ${weatherData.current.humidity}% and wind speed is ${weatherData.current.windSpeed} km/h.`;
    
    return {
      text: responseText,
      data: weatherData
    };
  } catch (error) {
    console.error("Error generating weather response:", error);
    return {
      text: "I'm sorry, but I couldn't retrieve the weather information at this time.",
      data: null
    };
  }
};
