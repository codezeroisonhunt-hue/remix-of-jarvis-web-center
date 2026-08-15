
import React, { useState } from 'react';
import { CalendarDays, Bell, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Reminder {
  id: string;
  title: string;
  time: Date;
  completed: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  location?: string;
}

interface PersonalAssistantProps {
  reminders?: Reminder[];
  events?: CalendarEvent[];
  onAddReminder?: () => void;
  onAddEvent?: () => void;
  onSetReminder?: (reminder: Reminder) => void;
}

export const PersonalAssistant: React.FC<PersonalAssistantProps> = ({ 
  reminders = [],
  events = [],
  onAddReminder,
  onAddEvent
}) => {
  const formatEventTime = (event: CalendarEvent) => {
    const startTime = event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = event.endTime ? event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };
  
  const formatReminderTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const today = new Date();
  const todayEvents = events.filter(event => 
    event.startTime.toDateString() === today.toDateString()
  );
  
  const upcomingReminders = reminders.filter(reminder => 
    !reminder.completed && reminder.time >= today
  ).sort((a, b) => a.time.getTime() - b.time.getTime());

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <User className="mr-2 h-4 w-4" /> Personal Assistant
        </CardTitle>
        <CardDescription>Reminders, calendar management, and daily briefings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calendar">
          <TabsList className="grid grid-cols-2 mb-4 bg-black/50">
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              <CalendarDays className="h-4 w-4 mr-1" /> Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="reminders"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              <Bell className="h-4 w-4 mr-1" /> Reminders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white">Today's Events</h3>
              {onAddEvent && (
                <Button 
                  size="sm" 
                  onClick={onAddEvent}
                  className="bg-jarvis hover:bg-jarvis/90"
                >
                  Add Event
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {todayEvents.length === 0 ? (
                <p className="text-gray-400 text-sm">No events scheduled for today.</p>
              ) : (
                todayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="bg-black/40 border border-jarvis/20 rounded-md p-2"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white">{event.title}</h4>
                      <span className="text-jarvis text-xs">{formatEventTime(event)}</span>
                    </div>
                    {event.location && (
                      <p className="text-gray-400 text-xs mt-1">{event.location}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white">Upcoming Reminders</h3>
              {onAddReminder && (
                <Button 
                  size="sm" 
                  onClick={onAddReminder}
                  className="bg-jarvis hover:bg-jarvis/90"
                >
                  Add Reminder
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {upcomingReminders.length === 0 ? (
                <p className="text-gray-400 text-sm">No upcoming reminders.</p>
              ) : (
                upcomingReminders.map(reminder => (
                  <div 
                    key={reminder.id} 
                    className="bg-black/40 border border-jarvis/20 rounded-md p-2 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-2 text-jarvis" />
                      <span className="text-white">{reminder.title}</span>
                    </div>
                    <span className="text-jarvis text-xs">{formatReminderTime(reminder.time)}</span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 bg-jarvis/10 rounded-md p-3 border border-jarvis/20">
          <div className="flex items-center mb-2">
            <MessageSquare className="h-4 w-4 mr-2 text-jarvis" />
            <h3 className="text-sm font-medium text-white">Daily Briefing</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Good morning! You have 3 events today and 2 pending reminders. 
            The weather is 72°F and sunny. Your first meeting starts in 45 minutes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
