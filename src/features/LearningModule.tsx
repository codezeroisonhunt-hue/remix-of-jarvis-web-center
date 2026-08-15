
import React from 'react';
import { Layers, TrendingUp, Award, List } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserPreference {
  id: string;
  name: string;
  value: string;
  learningConfidence: number; // 0-100
}

interface LearningInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  importance: number; // 0-100
}

interface LearningModuleProps {
  userPreferences?: UserPreference[];
  insights?: LearningInsight[];
  overallLearningProgress?: number;
}

export const LearningModule: React.FC<LearningModuleProps> = ({ 
  userPreferences = [],
  insights = [],
  overallLearningProgress = 0
}) => {
  // Group insights by category
  const categoryGroups = insights.reduce<Record<string, LearningInsight[]>>((acc, insight) => {
    acc[insight.category] = acc[insight.category] || [];
    acc[insight.category].push(insight);
    return acc;
  }, {});

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Layers className="mr-2 h-4 w-4" /> Learning Module
        </CardTitle>
        <CardDescription>Adapts and learns from your preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white">Learning Progress</span>
            <span className="text-jarvis">{overallLearningProgress}%</span>
          </div>
          <Progress 
            value={overallLearningProgress} 
            className="h-2 bg-black/50" 
          />
        </div>
        
        <Tabs defaultValue="preferences">
          <TabsList className="grid grid-cols-2 bg-black/50">
            <TabsTrigger 
              value="preferences"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              <List className="h-4 w-4 mr-1" /> Preferences
            </TabsTrigger>
            <TabsTrigger 
              value="insights"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              <TrendingUp className="h-4 w-4 mr-1" /> Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="mt-2 space-y-2">
            {userPreferences.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No preferences learned yet. Interact more to train the system.
              </p>
            ) : (
              userPreferences.map(pref => (
                <div 
                  key={pref.id} 
                  className="bg-black/40 border border-jarvis/20 rounded-md p-2"
                >
                  <div className="flex justify-between mb-1">
                    <h4 className="text-white text-sm">{pref.name}</h4>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full ${
                        pref.learningConfidence > 80 ? 'bg-green-400' : 
                        pref.learningConfidence > 40 ? 'bg-yellow-400' : 
                        'bg-red-400'
                      } mr-1`}></div>
                      <span className="text-gray-400 text-xs">{pref.learningConfidence}%</span>
                    </div>
                  </div>
                  <p className="text-jarvis text-sm">{pref.value}</p>
                </div>
              ))
            )}
            
            <div className="pt-2">
              <p className="text-xs text-gray-400">
                JARVIS learns your preferences over time by analyzing your interactions. 
                Confidence scores indicate how certain JARVIS is about each preference.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-2">
            <div className="space-y-4">
              {Object.keys(categoryGroups).length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No insights available yet. Continue using JARVIS to generate insights.
                </p>
              ) : (
                Object.entries(categoryGroups).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-medium text-jarvis flex items-center mb-2">
                      <Award className="h-4 w-4 mr-1" />
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {items.map(insight => (
                        <div 
                          key={insight.id} 
                          className="bg-black/40 border border-jarvis/20 rounded-md p-2"
                        >
                          <div className="flex justify-between mb-1">
                            <h5 className="text-white text-sm">{insight.title}</h5>
                            <span className="text-xs bg-jarvis/20 text-jarvis px-1.5 py-0.5 rounded-full">
                              {insight.importance}%
                            </span>
                          </div>
                          <p className="text-gray-300 text-xs">{insight.description}</p>
                        </div>
                      ))}
                    </div>
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
