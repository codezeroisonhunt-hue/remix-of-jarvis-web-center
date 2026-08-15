
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export interface CalendarEvent {
  title: string;
  time: string;
  location?: string;
}

interface CalendarWidgetProps {
  events: CalendarEvent[];
  isCompact?: boolean;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events, isCompact = false }) => {
  if (isCompact) {
    const nextEvent = events && events.length > 0 ? events[0] : null;
    return (
      <div className="calendar-widget-compact bg-black/40 p-3 rounded-lg border border-[#33c3f0]/20">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-[#33c3f0]" />
          <div className="ml-2 text-sm">
            <span className="text-white font-medium">Next:</span>
            {nextEvent ? (
              <span className="text-gray-300 ml-1">{nextEvent.title} ({nextEvent.time})</span>
            ) : (
              <span className="text-gray-300 ml-1">No upcoming events</span>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="calendar-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#33c3f0] font-medium">Today's Schedule</h3>
        <span className="text-xs text-gray-300">{new Date().toLocaleDateString()}</span>
      </div>
      
      {events.length === 0 ? (
        <div className="text-sm text-gray-400 text-center py-2">No events scheduled for today</div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="border-l-2 border-[#33c3f0]/40 pl-3">
              <div className="text-sm font-medium text-white">{event.title}</div>
              <div className="text-xs text-gray-400 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{event.time}</span>
                {event.location && (
                  <span className="ml-2">• {event.location}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
