
import OpenAI from 'openai';

// Initialize OpenAI client with API key if available
let openai: OpenAI | null = null;
try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && apiKey !== 'dummy-key') {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
} catch (error) {
  console.warn('Failed to initialize OpenAI client:', error);
}

// Define the EmotionData type
export type EmotionData = {
  dominant: string;
  joy: number;
  surprise: number;
  anger: number;
  sadness: number;
  neutral: number;
};

// Define the SentimentData type
export type SentimentData = {
  score: number;  // -1 (negative) to 1 (positive)
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
  type: string;  // Added for compatibility with existing code
};

// Function to analyze emotion in text using OpenAI or a fallback mechanism
export const analyzeEmotion = async (text: string): Promise<EmotionData> => {
  try {
    // If OpenAI client is available, use it
    if (openai) {
      const prompt = `Analyze the sentiment of the following text and provide a breakdown of the emotions detected.
        Text: "${text}"
        Respond with a JSON object that includes the dominant emotion and the intensity of each emotion (joy, surprise, anger, sadness, neutral) as a percentage.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI trained to analyze emotions in text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message?.content;

      if (content) {
        try {
          const emotionData = JSON.parse(content);
          return {
            dominant: emotionData.dominant || "neutral",
            joy: emotionData.joy || 0,
            surprise: emotionData.surprise || 0,
            anger: emotionData.anger || 0,
            sadness: emotionData.sadness || 0,
            neutral: emotionData.neutral || 0,
          };
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          return createMockEmotionData(text);
        }
      } else {
        console.warn("No content in OpenAI completion");
        return createMockEmotionData(text);
      }
    } else {
      // Use mock data if OpenAI is not available
      console.info("OpenAI client not available, using mock emotion data");
      return createMockEmotionData(text);
    }
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return createMockEmotionData(text);
  }
};

// Function to create mock emotion data
function createMockEmotionData(text: string): EmotionData {
  // Simple keyword-based detection for mock results
  const lowerText = text.toLowerCase();
  
  // Default emotion distribution
  let dominant = "neutral";
  const emotions = {
    joy: 0.1,
    surprise: 0.1,
    anger: 0.1,
    sadness: 0.1,
    neutral: 0.6
  };

  // Adjust based on keywords
  if (lowerText.includes('happy') || lowerText.includes('glad') || lowerText.includes('excited')) {
    dominant = "joy";
    emotions.joy = 0.7;
    emotions.neutral = 0.2;
    emotions.surprise = 0.1;
  } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('unhappy')) {
    dominant = "sadness";
    emotions.sadness = 0.7;
    emotions.neutral = 0.2;
    emotions.joy = 0.1;
  } else if (lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('furious')) {
    dominant = "anger";
    emotions.anger = 0.7;
    emotions.neutral = 0.2;
    emotions.surprise = 0.1;
  } else if (lowerText.includes('wow') || lowerText.includes('amazing') || lowerText.includes('unexpected')) {
    dominant = "surprise";
    emotions.surprise = 0.7;
    emotions.joy = 0.2;
    emotions.neutral = 0.1;
  }
  
  return {
    dominant,
    joy: emotions.joy,
    surprise: emotions.surprise,
    anger: emotions.anger,
    sadness: emotions.sadness,
    neutral: emotions.neutral
  };
}

// Create alias for analyzeEmotion for backward compatibility
export const analyzeTextEmotions = analyzeEmotion;

// Analyze emotions from facial expressions data
export const analyzeEmotions = (faceData: any): EmotionData => {
  // Extract emotions from face data
  const expressions = faceData.expressions || {};
  
  // Find the dominant emotion
  const emotions = Object.entries(expressions);
  const dominant = emotions.reduce(
    (max, [emotion, score]) => (score > max[1] ? [emotion, score] : max),
    ['neutral', 0]
  )[0];
  
  return {
    dominant,
    joy: expressions.happy || 0,
    surprise: expressions.surprised || 0,
    anger: expressions.angry || 0,
    sadness: expressions.sad || 0,
    neutral: expressions.neutral || 0
  };
};

// Analyze sentiment from text
export const analyzeSentiment = (text: string): SentimentData => {
  // Simple sentiment analysis (in a real app, this would use a proper NLP service)
  const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'like', 'best'];
  const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'hate', 'dislike', 'worst'];
  
  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  const total = positiveScore + negativeScore;
  if (total === 0) {
    return { score: 0, label: 'neutral', confidence: 0.5, type: 'neutral' };
  }
  
  const score = (positiveScore - negativeScore) / total;
  let label: 'positive' | 'negative' | 'neutral' = 'neutral';
  
  if (score > 0.2) label = 'positive';
  else if (score < -0.2) label = 'negative';
  
  const confidence = Math.abs(score) * 0.8 + 0.2;
  
  return { score, label, confidence, type: label };
};

// Analyze face attributes (age, gender)
export const analyzeFaceAttributes = async (faceData: any) => {
  // Simulate analysis with mock data (in a real app, this would use ML models)
  return {
    age: Math.floor(Math.random() * 40) + 20,  // Random age between 20-60
    gender: Math.random() > 0.5 ? 'Male' : 'Female'
  };
};

// Object detection in images
export const detectObjects = async (videoElement: HTMLVideoElement) => {
  // Simulate object detection with mock data (in a real app, this would use ML models)
  const mockObjects = [
    { 
      class: 'person', 
      confidence: 0.95, 
      bbox: [0.1, 0.2, 0.3, 0.5] as [number, number, number, number]
    },
    { 
      class: 'chair', 
      confidence: 0.85, 
      bbox: [0.6, 0.7, 0.2, 0.3] as [number, number, number, number] 
    }
  ];
  
  // Randomly include or exclude objects
  return mockObjects.filter(() => Math.random() > 0.3);
};

// Initialize face detection and object detection models
export const initializeModels = async (): Promise<boolean> => {
  // Simulate model initialization (in a real app, this would load actual ML models)
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 1000);
  });
};
