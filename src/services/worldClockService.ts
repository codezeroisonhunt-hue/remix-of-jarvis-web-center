
interface WorldClockResponse {
  location: string;
  time: string;
  date: string;
  timezone: string;
  utcOffset: string;
  dayPeriod: string; // morning, afternoon, evening, night
}

interface TimeZoneMapping {
  [key: string]: string;
}

// Common city to timezone mappings
const cityTimezoneMap: TimeZoneMapping = {
  'new york': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'toronto': 'America/Toronto',
  'london': 'Europe/London',
  'berlin': 'Europe/Berlin',
  'paris': 'Europe/Paris',
  'rome': 'Europe/Rome',
  'madrid': 'Europe/Madrid',
  'amsterdam': 'Europe/Amsterdam',
  'zurich': 'Europe/Zurich',
  'moscow': 'Europe/Moscow',
  'dubai': 'Asia/Dubai',
  'mumbai': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'bangalore': 'Asia/Kolkata',
  'beijing': 'Asia/Shanghai',
  'shanghai': 'Asia/Shanghai',
  'hong kong': 'Asia/Hong_Kong',
  'tokyo': 'Asia/Tokyo',
  'seoul': 'Asia/Seoul',
  'singapore': 'Asia/Singapore',
  'sydney': 'Australia/Sydney',
  'melbourne': 'Australia/Melbourne',
  'auckland': 'Pacific/Auckland',
  'hawaii': 'Pacific/Honolulu',
  'johannesburg': 'Africa/Johannesburg',
  'cairo': 'Africa/Cairo',
  'lagos': 'Africa/Lagos',
  'nairobi': 'Africa/Nairobi'
};

// Country to timezone mappings (for general country queries)
const countryTimezoneMap: TimeZoneMapping = {
  'usa': 'America/New_York',
  'united states': 'America/New_York',
  'uk': 'Europe/London',
  'united kingdom': 'Europe/London',
  'england': 'Europe/London',
  'germany': 'Europe/Berlin',
  'france': 'Europe/Paris',
  'italy': 'Europe/Rome',
  'spain': 'Europe/Madrid',
  'russia': 'Europe/Moscow',
  'india': 'Asia/Kolkata',
  'china': 'Asia/Shanghai',
  'japan': 'Asia/Tokyo',
  'south korea': 'Asia/Seoul',
  'australia': 'Australia/Sydney',
  'new zealand': 'Pacific/Auckland',
  'brazil': 'America/Sao_Paulo',
  'mexico': 'America/Mexico_City',
  'canada': 'America/Toronto',
  'south africa': 'Africa/Johannesburg',
  'egypt': 'Africa/Cairo'
};

// Check if a message is a world clock query
export const isWorldClockQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  return (
    (lowerMessage.includes('time') || lowerMessage.includes('clock')) &&
    (lowerMessage.includes('in') || lowerMessage.includes('at')) &&
    (
      Object.keys(cityTimezoneMap).some(city => lowerMessage.includes(city)) ||
      Object.keys(countryTimezoneMap).some(country => lowerMessage.includes(country))
    )
  );
};

// Extract location from query
export const extractLocationFromQuery = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  // Try to match cities first (more specific)
  for (const city of Object.keys(cityTimezoneMap)) {
    if (lowerMessage.includes(city)) {
      return city;
    }
  }
  
  // Then try countries
  for (const country of Object.keys(countryTimezoneMap)) {
    if (lowerMessage.includes(country)) {
      return country;
    }
  }
  
  return null;
};

// Get timezone for a location
export const getTimezoneForLocation = (location: string): string | null => {
  const lowerLocation = location.toLowerCase();
  
  return cityTimezoneMap[lowerLocation] || countryTimezoneMap[lowerLocation] || null;
};

// Get current time for a specific timezone
export const getCurrentTimeForTimezone = (timezone: string): WorldClockResponse => {
  try {
    const now = new Date();
    
    // Create formatter for the specific timezone
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const timeString = timeFormatter.format(now);
    const dateString = dateFormatter.format(now);
    
    // Get UTC offset
    const options = Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long'
    }).resolvedOptions();
    
    // Get city/country name from timezone
    const location = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
    
    // Determine day period
    const hour = new Date(dateString + ' ' + timeString).getHours();
    let dayPeriod = '';
    
    if (hour >= 5 && hour < 12) {
      dayPeriod = 'morning';
    } else if (hour >= 12 && hour < 17) {
      dayPeriod = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      dayPeriod = 'evening';
    } else {
      dayPeriod = 'night';
    }
    
    return {
      location,
      time: timeString,
      date: dateString,
      timezone,
      utcOffset: options.timeZone,
      dayPeriod
    };
  } catch (error) {
    console.error('Error getting time for timezone:', error);
    throw new Error(`Could not get time for ${timezone}`);
  }
};

// Process a world clock query
export const processWorldClockQuery = (message: string): WorldClockResponse | null => {
  try {
    // Extract location from query
    const location = extractLocationFromQuery(message);
    if (!location) return null;
    
    // Get timezone for location
    const timezone = getTimezoneForLocation(location);
    if (!timezone) return null;
    
    // Get current time for timezone
    return getCurrentTimeForTimezone(timezone);
  } catch (error) {
    console.error('Error processing world clock query:', error);
    return null;
  }
};
