
import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  sender: string;
  subject?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'email' | 'chat' | 'call';
}

interface CommunicationProps {
  messages?: Message[];
  onSearch?: (query: string, type: string) => void;
  onComposeMessage?: (type: string) => void;
}

export const Communication: React.FC<CommunicationProps> = ({ 
  messages = [],
  onSearch,
  onComposeMessage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('email');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, activeTab);
    }
  };

  const filteredMessages = messages.filter(msg => msg.type === activeTab);
  const unreadCount = filteredMessages.filter(msg => !msg.read).length;

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Mail className="mr-2 h-4 w-4" /> Communication
        </CardTitle>
        <CardDescription>Manage emails, messages, and calls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="relative flex-grow mr-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}s...`}
              className="pl-8 bg-black/40 border-jarvis/20 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          {onComposeMessage && (
            <Button 
              onClick={() => onComposeMessage(activeTab)}
              className="bg-jarvis hover:bg-jarvis/90"
            >
              Compose
            </Button>
          )}
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 bg-black/50">
            <TabsTrigger 
              value="email"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis relative"
            >
              <Mail className="h-4 w-4 mr-1" /> Email
              {unreadCount > 0 && activeTab === 'email' && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-jarvis text-white">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="chat"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              <MessageSquare className="h-4 w-4 mr-1" /> Chat
            </TabsTrigger>
            <TabsTrigger 
              value="call"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              <Phone className="h-4 w-4 mr-1" /> Calls
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">
                {filteredMessages.length} {activeTab}
                {filteredMessages.length !== 1 ? 's' : ''}
                {unreadCount > 0 && (
                  <span className="ml-2 text-jarvis">({unreadCount} unread)</span>
                )}
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Filter className="h-3 w-3 mr-1" /> Filter
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-jarvis/30 scrollbar-track-transparent">
              {filteredMessages.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No {activeTab}s to display.
                </p>
              ) : (
                filteredMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`bg-black/40 border ${message.read ? 'border-jarvis/20' : 'border-jarvis/40'} rounded-md p-3`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`font-medium ${message.read ? 'text-white' : 'text-jarvis'}`}>
                        {message.sender}
                        {!message.read && (
                          <Badge className="ml-2 bg-jarvis text-xs">New</Badge>
                        )}
                      </h4>
                      <span className="text-gray-400 text-xs">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {message.subject && (
                      <p className="text-gray-300 text-sm font-medium mt-1">{message.subject}</p>
                    )}
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">{message.content}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
