
import React, { useState, useEffect } from 'react';
import { VoiceRecognition } from '@/features/VoiceRecognition';
import { NLP } from '@/features/NLP';
import { KnowledgeBase } from '@/features/KnowledgeBase';
import { TaskManagement } from '@/features/TaskManagement';
import { Automation } from '@/features/Automation';
import { PersonalAssistant } from '@/features/PersonalAssistant';
import { SearchEngineIntegration } from '@/features/SearchEngineIntegration';
import { Communication } from '@/features/Communication';
import { LearningModule } from '@/features/LearningModule';
import { Security } from '@/features/Security';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from '@/components/ui/use-toast';
import JarvisSidebar from '@/components/JarvisSidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock data for demonstration
const knowledgeItems = [
  {
    id: '1',
    title: 'Voice Commands',
    content: 'List of available voice commands and their functions in JARVIS.',
    tags: ['voice', 'commands', 'help']
  },
  {
    id: '2',
    title: 'Smart Home Integration',
    content: 'How to connect and control your smart home devices with JARVIS.',
    tags: ['smart home', 'iot', 'automation']
  }
];

const tasks = [
  {
    id: '1',
    title: 'Schedule meeting with development team',
    completed: false,
    dueDate: new Date(Date.now() + 86400000), // tomorrow
    priority: 'high' as const
  },
  {
    id: '2',
    title: 'Update security protocols',
    completed: true,
    priority: 'medium' as const
  },
  {
    id: '3',
    title: 'Run system diagnostic',
    completed: false,
    priority: 'low' as const
  }
];

const automationRules = [
  {
    id: '1',
    name: 'Morning Routine',
    description: 'Activate lights, check weather, and brief daily schedule at 7am',
    active: true,
    triggerType: 'time' as const,
    action: 'Multiple smart home actions'
  },
  {
    id: '2',
    name: 'Security Mode',
    description: 'Activate security system when leaving home',
    active: false,
    triggerType: 'event' as const,
    action: 'Enable security cameras and alarm'
  }
];

const reminders = [
  {
    id: '1',
    title: 'Take medication',
    time: new Date(Date.now() + 3600000), // 1 hour from now
    completed: false,
  }
];

const events = [
  {
    id: '1',
    title: 'Team Meeting',
    startTime: new Date(Date.now() + 7200000), // 2 hours from now
    endTime: new Date(Date.now() + 9000000), // 2.5 hours from now
    location: 'Conference Room B'
  },
  {
    id: '2',
    title: 'Project Deadline',
    startTime: new Date(Date.now() + 172800000), // 2 days from now
    location: 'Virtual'
  }
];

const securitySettings = [
  {
    id: '1',
    name: 'Two-Factor Authentication',
    description: 'Require a verification code in addition to your password when signing in',
    enabled: true,
    critical: true
  },
  {
    id: '2',
    name: 'Activity Logging',
    description: 'Keep a record of all actions performed while using JARVIS',
    enabled: true,
    critical: false
  },
  {
    id: '3',
    name: 'Biometric Authentication',
    description: 'Use facial recognition or fingerprint to access JARVIS',
    enabled: false,
    critical: false
  }
];

const userPreferences = [
  {
    id: '1',
    name: 'Preferred Temperature',
    value: '72°F',
    learningConfidence: 95
  },
  {
    id: '2',
    name: 'Morning Routine',
    value: 'News, Weather, Calendar',
    learningConfidence: 80
  },
  {
    id: '3',
    name: 'Work Hours',
    value: '9am - 5pm',
    learningConfidence: 65
  }
];

const insights = [
  {
    id: '1',
    title: 'Productivity Peak',
    description: 'You seem to be most productive between 10am and 12pm',
    category: 'Work Habits',
    importance: 85
  },
  {
    id: '2',
    title: 'Meeting Preferences',
    description: 'You prefer to schedule meetings in the afternoon',
    category: 'Work Habits',
    importance: 70
  },
  {
    id: '3',
    title: 'Content Interests',
    description: 'You frequently search for technology and science news',
    category: 'Interests',
    importance: 90
  }
];

// Main component
const FeaturesOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('voice');
  const [transcribedText, setTranscribedText] = useState('');
  const [nlpData, setNlpData] = useState({
    entities: [],
    intents: [],
    sentiment: 0,
    isProcessing: false
  });
  
  // Use the speech recognition hook
  const { isListening } = useSpeechRecognition();

  const handleTranscription = (text: string) => {
    setTranscribedText(text);
    
    // Simulate NLP processing
    if (text) {
      setNlpData(prev => ({ ...prev, isProcessing: true }));
      
      // Simulate processing delay
      setTimeout(() => {
        // Simple mock NLP analysis
        const mockEntities = [];
        if (text.toLowerCase().includes('tomorrow')) {
          mockEntities.push({ type: 'DATE', text: 'tomorrow', confidence: 0.95 });
        }
        if (text.toLowerCase().includes('meeting')) {
          mockEntities.push({ type: 'EVENT', text: 'meeting', confidence: 0.88 });
        }
        
        const mockIntents = [
          { 
            name: text.toLowerCase().includes('schedule') ? 'schedule_event' : 
                  text.toLowerCase().includes('weather') ? 'weather_query' : 
                  'general_query',
            confidence: 0.82
          }
        ];
        
        // Simple sentiment - positive words increase score, negative words decrease
        let sentimentScore = 0;
        const positiveWords = ['good', 'great', 'excellent', 'happy', 'like', 'love'];
        const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'hate', 'dislike'];
        
        const words = text.toLowerCase().split(' ');
        words.forEach(word => {
          if (positiveWords.includes(word)) sentimentScore += 0.2;
          if (negativeWords.includes(word)) sentimentScore -= 0.2;
        });
        
        setNlpData({
          entities: mockEntities,
          intents: mockIntents,
          sentiment: sentimentScore,
          isProcessing: false
        });
      }, 1000);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast({
      title: `${value.charAt(0).toUpperCase() + value.slice(1)} Feature`,
      description: `Now viewing the ${value} feature of JARVIS.`,
    });
  };

  return (
    <div className="flex h-screen bg-jarvis-bg text-white">
      <JarvisSidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-jarvis">JARVIS Features Overview</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 gap-2 mb-8 bg-black/50 p-1">
            <TabsTrigger value="voice" className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis">
              Voice Recognition
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis">
              AI Intelligence
            </TabsTrigger>
            <TabsTrigger value="assistant" className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis">
              Personal Assistant
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis">
              Learning
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis">
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="voice" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VoiceRecognition onTranscription={handleTranscription} />
              <NLP 
                analyzedText={transcribedText} 
                entities={nlpData.entities}
                intents={nlpData.intents}
                sentiment={nlpData.sentiment}
                isProcessing={nlpData.isProcessing}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KnowledgeBase knowledgeItems={knowledgeItems} />
              <SearchEngineIntegration />
            </div>
          </TabsContent>
          
          <TabsContent value="assistant" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaskManagement tasks={tasks} />
              <Automation automationRules={automationRules} />
              <PersonalAssistant reminders={reminders} events={events} />
              <Communication />
            </div>
          </TabsContent>
          
          <TabsContent value="learning" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LearningModule 
                userPreferences={userPreferences} 
                insights={insights}
                overallLearningProgress={75} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Security 
                securitySettings={securitySettings}
                securityScore={85}
                passwordStrength="strong"
                lastLoginDate={new Date()}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 bg-black/30 border border-jarvis/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Badge className="bg-jarvis text-white mr-2">Beta</Badge>
            <h2 className="text-lg font-semibold">JARVIS AI Features Dashboard</h2>
          </div>
          <p className="text-gray-300">
            This dashboard showcases the 10 core features of the JARVIS AI system. 
            Explore each tab to see the capabilities and interact with different modules.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Voice recognition feature is {isListening ? 'currently active' : 'ready to use'}.
            Try saying a command to see the NLP analysis in action.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesOverview;
