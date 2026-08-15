
import { getWeatherForecast } from './weatherService';
import { getNewsUpdates } from './newsService';
import { getCalendarEvents, getCurrentDate } from './timeCalendarService';

export interface DailyBriefing {
  greeting: string;
  date: string;
  weather: {
    location: string;
    condition: string;
    temperature: number;
    forecast: string;
  };
  calendar: {
    eventCount: number;
    nextEvent?: {
      title: string;
      time: string;
    };
  };
  news: {
    topHeadline: string;
    source: string;
  }[];
}

// Get time of day for appropriate greeting
const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

export const getDailyBriefing = async (): Promise<{text: string, briefing: DailyBriefing}> => {
  try {
    // Get weather data - pass a default location
    const weatherData = await getWeatherForecast({ location: "New York" });
    
    // Get calendar events
    const events = await getCalendarEvents();
    
    // Get news updates
    const newsArticles = await getNewsUpdates({ count: 3 });
    
    // Current date
    const currentDate = getCurrentDate();
    
    // Create briefing object
    const briefing: DailyBriefing = {
      greeting: getTimeBasedGreeting(),
      date: currentDate,
      weather: {
        location: weatherData.location.name, // Use name property instead of the entire object
        condition: weatherData.current.condition,
        temperature: weatherData.current.temp,
        forecast: weatherData.forecast[0].condition
      },
      calendar: {
        eventCount: events.length,
        nextEvent: events.length > 0 ? {
          title: events[0].title,
          time: events[0].time
        } : undefined
      },
      news: newsArticles.map(article => ({
        topHeadline: article.title,
        source: article.source
      }))
    };
    
    // Generate text response
    let responseText = `${briefing.greeting}. Today is ${briefing.date}. `;
    
    // Add weather info
    responseText += `Currently in ${briefing.weather.location}, it's ${briefing.weather.condition} with a temperature of ${briefing.weather.temperature}°F. `;
    
    // Add calendar info
    if (briefing.calendar.eventCount > 0) {
      responseText += `You have ${briefing.calendar.eventCount} event${briefing.calendar.eventCount > 1 ? 's' : ''} scheduled today. `;
      if (briefing.calendar.nextEvent) {
        responseText += `Your next event is ${briefing.calendar.nextEvent.title} at ${briefing.calendar.nextEvent.time}. `;
      }
    } else {
      responseText += `You have no events scheduled for today. `;
    }
    
    // Add news headlines
    responseText += `Here are today's top headlines: `;
    briefing.news.forEach((item, index) => {
      responseText += `${index + 1}. ${item.topHeadline} from ${item.source}. `;
    });
    
    return { text: responseText, briefing };
  } catch (error) {
    console.error('Error generating daily briefing:', error);
    return { 
      text: "I'm sorry, I couldn't generate your daily briefing at this time.", 
      briefing: {
        greeting: getTimeBasedGreeting(),
        date: getCurrentDate(),
        weather: {
          location: "Unknown",
          condition: "Unknown",
          temperature: 0,
          forecast: "Unknown"
        },
        calendar: {
          eventCount: 0
        },
        news: []
      }
    };
  }
};
