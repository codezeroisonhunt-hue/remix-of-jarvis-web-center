
interface TimeResponse {
  text: string;
  data: {
    time?: string;
    date?: string;
    events?: CalendarEvent[];
  };
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
}

export const getTimeCalendarResponse = async (query: string): Promise<TimeResponse> => {
  const now = new Date();
  const lowerQuery = query.toLowerCase();
  
  try {
    // Time related queries
    if (lowerQuery.includes('time')) {
      const timeString = now.toLocaleTimeString();
      return {
        text: `The current time is ${timeString}.`,
        data: { time: timeString }
      };
    }
    
    // Date related queries
    if (lowerQuery.includes('date') || lowerQuery.includes('day') || lowerQuery.includes('today')) {
      const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      return {
        text: `Today is ${dateString}.`,
        data: { date: dateString }
      };
    }
    
    // Calendar/Schedule related queries
    if (lowerQuery.includes('schedule') || lowerQuery.includes('calendar') || 
        lowerQuery.includes('event') || lowerQuery.includes('meeting')) {
      
      // In a real implementation, this would fetch actual calendar data
      // For now, we'll return mock calendar data
      const events = getMockCalendarEvents();
      
      let response = "Here's your schedule for today: ";
      
      if (events.length === 0) {
        response = "You don't have any events scheduled for today.";
      } else {
        events.forEach((event, index) => {
          const startTime = event.start.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
          });
          response += `${index + 1}. ${event.title} at ${startTime}`;
          if (event.location) {
            response += ` (${event.location})`;
          }
          response += ". ";
        });
      }
      
      return {
        text: response,
        data: { events }
      };
    }
    
    // Default fallback
    return {
      text: `I'm not sure what time-related information you're looking for.`,
      data: {}
    };
    
  } catch (error) {
    console.error('Error processing time/calendar query:', error);
    return {
      text: `I apologize, but I couldn't retrieve that information right now.`,
      data: {}
    };
  }
};

// Add the missing exports that the dailyBriefingService is trying to use
export const getCalendarEvents = (): { title: string; time: string }[] => {
  // Get mock calendar events and format them for the daily briefing
  const events = getMockCalendarEvents();
  
  return events.map(event => ({
    title: event.title,
    time: event.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }));
};

export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Mock calendar data for demonstration purposes
const getMockCalendarEvents = (): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];
  
  // Only create events during working hours (9 AM to 6 PM)
  const workingHours = [];
  for (let i = 9; i <= 17; i++) {
    workingHours.push(i);
  }
  
  // Randomly decide if we should have events today (70% chance)
  if (Math.random() < 0.7) {
    // Add 1-4 random events
    const numberOfEvents = Math.floor(Math.random() * 4) + 1;
    
    for (let i = 0; i < numberOfEvents; i++) {
      // Pick a random hour in the working day for the event
      const availableHours = [...workingHours];
      const eventHourIndex = Math.floor(Math.random() * availableHours.length);
      const eventHour = availableHours[eventHourIndex];
      
      // Remove the hour so we don't schedule another event at the same time
      workingHours.splice(workingHours.indexOf(eventHour), 1);
      
      const startTime = new Date(today);
      startTime.setHours(eventHour);
      startTime.setMinutes(Math.random() < 0.5 ? 0 : 30);
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + (Math.random() < 0.5 ? 30 : 60));
      
      const eventTemplates = [
        {
          title: "Team Meeting",
          location: "Conference Room A",
          description: "Weekly team sync-up to discuss project progress."
        },
        {
          title: "Client Call",
          location: "Zoom",
          description: "Discussion about the upcoming product launch."
        },
        {
          title: "Project Review",
          location: "Meeting Room 3",
          description: "Review of the latest project milestones and deliverables."
        },
        {
          title: "Lunch with John",
          location: "Cafe Bistro",
          description: "Casual lunch meeting to catch up."
        },
        {
          title: "Interview Candidate",
          location: "HR Office",
          description: "Interview for the Senior Developer position."
        }
      ];
      
      const eventTemplate = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      
      events.push({
        title: eventTemplate.title,
        start: startTime,
        end: endTime,
        location: eventTemplate.location,
        description: eventTemplate.description
      });
    }
    
    // Sort events by start time
    events.sort((a, b) => a.start.getTime() - b.start.getTime());
  }
  
  return events;
};
