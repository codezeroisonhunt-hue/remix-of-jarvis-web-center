
import { toast } from '@/components/ui/use-toast';

// Define the Stability AI API key
const STABILITY_API_KEY = 'sk-cGMlowoFvQ1cHdIb7B2RDny9iRmngZylNw0RNaJ0UlGtIdzJ';

// API endpoint for text-to-image generation
const API_HOST = 'https://api.stability.ai';

export interface StabilityImageParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  cfgScale?: number;
  steps?: number;
  seed?: number;
  style?: string;
  engineId?: string;
}

export interface StabilityGeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
  width?: number;
  height?: number;
  style?: string;
  base64?: string;
}

// Error types that can occur with Stability API
enum StabilityErrorType {
  INSUFFICIENT_BALANCE = 'insufficient_balance',
  INVALID_API_KEY = 'invalid_api_key',
  RATE_LIMIT = 'rate_limit',
  OTHER = 'other'
}

/**
 * Generate an image using Stability AI's text-to-image API
 */
export const generateStabilityImage = async (params: StabilityImageParams): Promise<StabilityGeneratedImage> => {
  try {
    console.log("Generating image with Stability AI:", params);
    
    // Default parameters if not provided
    const engineId = params.engineId || "stable-diffusion-xl-1024-v1-0";
    const height = params.height || 1024;
    const width = params.width || 1024;
    const steps = params.steps || 30;
    const cfgScale = params.cfgScale || 7;
    const style = params.style || "enhance";
    
    const response = await fetch(
      `${API_HOST}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: params.prompt,
              weight: 1
            },
            ...(params.negativePrompt ? [{
              text: params.negativePrompt,
              weight: -1
            }] : [])
          ],
          cfg_scale: cfgScale,
          height,
          width,
          steps,
          style_preset: style,
          ...(params.seed ? { seed: params.seed } : {})
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Stability AI API error:', error);
      
      // Determine the type of error
      let errorType = StabilityErrorType.OTHER;
      if (error.name === 'insufficient_balance') {
        errorType = StabilityErrorType.INSUFFICIENT_BALANCE;
      } else if (error.name === 'unauthorized' || error.name === 'invalid_api_key') {
        errorType = StabilityErrorType.INVALID_API_KEY;
      } else if (error.name === 'rate_limit_exceeded') {
        errorType = StabilityErrorType.RATE_LIMIT;
      }
      
      // Show specific error message based on error type
      let errorMessage = error.message || 'Unknown error';
      switch (errorType) {
        case StabilityErrorType.INSUFFICIENT_BALANCE:
          errorMessage = 'Your Stability AI account has insufficient balance. Using fallback image generation.';
          break;
        case StabilityErrorType.INVALID_API_KEY:
          errorMessage = 'Invalid Stability AI API key. Using fallback image generation.';
          break;
        case StabilityErrorType.RATE_LIMIT:
          errorMessage = 'Rate limit exceeded for Stability AI. Using fallback image generation.';
          break;
      }
      
      throw new Error(`Stability AI API error: ${errorMessage}`);
    }
    
    const responseJSON = await response.json();
    console.log('Stability AI response:', responseJSON);
    
    if (!responseJSON.artifacts || responseJSON.artifacts.length === 0) {
      throw new Error('No images were generated');
    }
    
    // Get the first generated image
    const image = responseJSON.artifacts[0];
    
    // Convert base64 to URL
    const base64Data = image.base64;
    const imageUrl = `data:image/png;base64,${base64Data}`;
    
    return {
      url: imageUrl,
      prompt: params.prompt,
      timestamp: new Date(),
      width,
      height,
      style: params.style,
      base64: base64Data
    };
  } catch (error) {
    console.error('Error generating image with Stability AI:', error);
    
    // Show error toast
    toast({
      title: "Stability AI Generation Failed",
      description: error instanceof Error ? error.message : "Failed to generate image with Stability AI. Using fallback service.",
      variant: "destructive"
    });
    
    // Return a fallback image with a special property indicating it's a fallback
    return {
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      prompt: params.prompt,
      timestamp: new Date(),
      style: "fallback",
      width: params.width || 1024,
      height: params.height || 1024
    };
  }
};

// Extract image generation parameters from a natural language prompt
export const parseImagePrompt = (prompt: string): StabilityImageParams => {
  const params: StabilityImageParams = {
    prompt: prompt
  };
  
  // Extract style preferences
  if (/realistic|photo|photograph|real/i.test(prompt)) {
    params.style = 'photographic';
  } else if (/anime|cartoon|animated|manga/i.test(prompt)) {
    params.style = 'anime';
  } else if (/3d|three.dimensional|render/i.test(prompt)) {
    params.style = '3d-model';
  } else if (/digital art|digital painting/i.test(prompt)) {
    params.style = 'digital-art';
  } else if (/oil painting|painting/i.test(prompt)) {
    params.style = 'enhance';
  } else {
    // Default style
    params.style = 'enhance';
  }
  
  // Extract aspect ratio or dimension preferences
  if (/landscape|wide|panoramic/i.test(prompt)) {
    params.width = 1024;
    params.height = 768;
  } else if (/portrait|tall/i.test(prompt)) {
    params.width = 768;
    params.height = 1024;
  } else if (/square/i.test(prompt)) {
    params.width = 1024;
    params.height = 1024;
  }
  
  console.log("Parsed image parameters:", params);
  return params;
};

// Integrate with existing image service
export const isImageGenerationPrompt = (prompt: string): boolean => {
  const lowerPrompt = prompt.toLowerCase();
  return (
    lowerPrompt.includes('generate image') || 
    lowerPrompt.includes('create image') || 
    lowerPrompt.includes('make image') ||
    lowerPrompt.includes('draw') ||
    lowerPrompt.includes('show me') ||
    (lowerPrompt.includes('generate') && lowerPrompt.includes('picture')) ||
    (lowerPrompt.includes('create') && lowerPrompt.includes('picture'))
  );
};

// Extract the actual image prompt from a command
export const extractImagePrompt = (command: string): string => {
  const promptRegex = /^(?:create|generate|make|draw|show me|show|paint|illustrate)(?:\s+an|\s+a)?(?:\s+image|picture)?(?:\s+of|about|showing)?\s+(.+)$/i;
  const match = command.match(promptRegex);
  return match ? match[1].trim() : command.trim();
};
