
import { useState, useCallback, useEffect } from 'react';
import { analyzeTextEmotions, analyzeSentiment, EmotionData, SentimentData } from '@/services/emotionalIntelligenceService';

export const useEmotionalIntelligence = () => {
  const [emotions, setEmotions] = useState<EmotionData | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [history, setHistory] = useState<{
    text: string;
    emotions: EmotionData;
    sentiment: SentimentData;
    timestamp: Date;
  }[]>([]);

  // Process text to detect emotions and sentiment
  const processText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    // Use await to resolve the promise before setting state
    const detectedEmotions = await analyzeTextEmotions(text);
    const detectedSentiment = analyzeSentiment(text);
    
    setEmotions(detectedEmotions);
    setSentiment(detectedSentiment);
    
    setHistory(prev => {
      const newHistory = [
        ...prev,
        { 
          text, 
          emotions: detectedEmotions, 
          sentiment: detectedSentiment,
          timestamp: new Date()
        }
      ];
      // Keep the history to a reasonable size
      if (newHistory.length > 20) {
        return newHistory.slice(-20);
      }
      return newHistory;
    });
    
    return { 
      emotions: detectedEmotions, 
      sentiment: detectedSentiment 
    };
  }, []);

  // Get dominant emotion over time
  const getDominantEmotion = useCallback(() => {
    if (history.length === 0) return null;
    
    const emotionCounts: Record<string, number> = {};
    history.forEach(entry => {
      const dominant = entry.emotions.dominant;
      emotionCounts[dominant] = (emotionCounts[dominant] || 0) + 1;
    });
    
    let maxEmotion = '';
    let maxCount = 0;
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxEmotion = emotion;
        maxCount = count;
      }
    });
    
    return maxEmotion;
  }, [history]);

  // Get average sentiment over time
  const getAverageSentiment = useCallback(() => {
    if (history.length === 0) return null;
    
    const total = history.reduce((sum, entry) => sum + entry.sentiment.score, 0);
    return total / history.length;
  }, [history]);

  return {
    emotions,
    sentiment,
    history,
    processText,
    getDominantEmotion,
    getAverageSentiment
  };
};
