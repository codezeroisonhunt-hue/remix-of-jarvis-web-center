
import React from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface EmotionData {
  joy: number;
  surprise: number;
  anger: number;
  sadness: number;
  [key: string]: number; // Allow for other emotion types
}

export interface SentimentData {
  score: number;
  comparative?: number;
  type: string;
}

interface EmotionalIntelligenceProps {
  emotions?: EmotionData | null;
  sentiment?: SentimentData | null;
  isProcessing?: boolean;
}

export const EmotionalIntelligence: React.FC<EmotionalIntelligenceProps> = ({
  emotions = null,
  sentiment = null,
  isProcessing = false
}) => {
  // Helper function to get color based on emotion intensity
  const getEmotionColor = (value: number) => {
    if (value > 0.7) return 'bg-red-500';
    if (value > 0.4) return 'bg-yellow-500';
    return 'bg-blue-400';
  };
  
  // Helper function to get color for sentiment
  const getSentimentColor = (type: string) => {
    if (type === 'positive') return 'text-green-400';
    if (type === 'negative') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Heart className="mr-2 h-4 w-4" /> Emotional Intelligence
        </CardTitle>
        <CardDescription>Sentiment and emotion analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!sentiment && !emotions && !isProcessing ? (
          <Alert className="bg-jarvis/5 border-jarvis/20">
            <AlertDescription>
              No emotional data available. Analyze text to detect emotions and sentiment.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-jarvis">Processing emotional data...</span>
              </div>
            )}
            
            {sentiment && !isProcessing && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Sentiment Analysis:</h4>
                <div className="flex items-center space-x-2">
                  <div className={`text-lg font-medium ${getSentimentColor(sentiment.type)}`}>
                    {sentiment.type.charAt(0).toUpperCase() + sentiment.type.slice(1)}
                  </div>
                  <div className="text-sm text-gray-400">
                    (Score: {Math.round(sentiment.score * 100)}%)
                  </div>
                </div>
              </div>
            )}
            
            {emotions && !isProcessing && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Emotional Profile:</h4>
                <div className="space-y-2">
                  {Object.entries(emotions).map(([emotion, value]) => (
                    <div key={emotion} className="grid grid-cols-6 gap-2 items-center">
                      <div className="text-sm capitalize col-span-1">{emotion}</div>
                      <div className="w-full bg-black/40 rounded-full h-2.5 col-span-4">
                        <div 
                          className={`h-2.5 rounded-full ${getEmotionColor(value)}`} 
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 col-span-1">
                        {Math.round(value * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
