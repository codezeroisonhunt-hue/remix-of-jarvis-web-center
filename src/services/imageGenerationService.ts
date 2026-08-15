
// Types
import { toast } from '@/components/ui/use-toast';
import {
  MOCK_IMAGES,
  CREATIVE_COMBOS,
  STYLE_IMAGES,
  getRandomImage,
  getMockImageUrl,
  getNamedEntityImage
} from './imageMockData';
import { parseImageRequest } from './imagePromptParser';
import { checkImageMatchesPrompt } from './imagePromptChecker';

export interface ImageGenerationParams {
  prompt: string;
  style?: 'realistic' | 'anime' | '3d' | 'abstract' | 'painting' | 'pixel' | 'sci-fi' | 'fantasy' | 'portrait';
  resolution?: '512x512' | '768x768' | '1024x1024';
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2';
  enhancedAccuracy?: boolean;
  subjectFocus?: string;
  subjectAccuracy?: 'low' | 'medium' | 'high';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
  style?: string;
  resolution?: string;
}

// Re-export necessary functions for backward compatibility
export { parseImageRequest, checkImageMatchesPrompt };

export const generateImage = async (params: ImageGenerationParams): Promise<GeneratedImage> => {
  try {
    // Enhanced logging for debugging
    console.log(`Generating image with enhanced accuracy: ${params.enhancedAccuracy ? 'YES' : 'NO'}`);
    console.log(`Prompt: "${params.prompt}"`);
    console.log(`Subject focus: ${params.subjectFocus || 'None'}`);
    
    // Simulated loading time (slightly longer for "enhanced" generation)
    await new Promise(resolve => setTimeout(resolve, params.enhancedAccuracy ? 1800 : 1400));
    
    let imageUrl;
    
    // High accuracy mode for named entities
    if (params.subjectFocus && params.subjectAccuracy === 'high') {
      // Use our specialized function for known entities
      imageUrl = getNamedEntityImage(params.subjectFocus, params.style);
      
      if (imageUrl) {
        console.log(`Using specialized image for "${params.subjectFocus}": ${imageUrl}`);
      } else {
        console.log(`No specialized image found for "${params.subjectFocus}", falling back to standard methods`);
      }
    }
    
    // If no specialized image was found or no subject was specified
    if (!imageUrl) {
      // Check for special cases in prompt
      const lowerPrompt = params.prompt.toLowerCase();
      
      // Special handling for sunset over mountains
      if ((lowerPrompt.includes('sunset') && lowerPrompt.includes('mountain')) || 
          lowerPrompt.includes('sunset over mountain')) {
        imageUrl = CREATIVE_COMBOS['sunset over mountains'] || MOCK_IMAGES.sunset;
      } else {
        // Get mock image URL using normal logic
        imageUrl = getMockImageUrl(params.prompt, params.style);
      }
    }

    // Log the selected image
    console.log(`Selected image URL: ${imageUrl}`);

    // Preload the image to ensure it works
    await preloadImage(imageUrl);

    return {
      url: imageUrl,
      prompt: params.prompt,
      timestamp: new Date(),
      style: params.style,
      resolution: params.resolution
    };
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Fallback to a reliable default image on error
    const fallbackUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    
    toast({
      title: "Image Generation Notice",
      description: "Using fallback image. Original request may have had issues.",
      variant: "default"
    });
    
    return {
      url: fallbackUrl,
      prompt: params.prompt,
      timestamp: new Date(),
      style: params.style,
      resolution: params.resolution
    };
  }
};

// Helper function to preload images and ensure they are valid
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => {
      console.error(`Failed to load image: ${url}`);
      reject(new Error(`Failed to load image: ${url}`));
    };
  });
};
