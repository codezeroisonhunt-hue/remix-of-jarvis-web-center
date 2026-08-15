
import type { GeneratedImage } from './imageGenerationService';

/**
 * Check if an image likely matches the prompt that was used to generate it.
 * In a real implementation, this would use image recognition or visual AI analysis.
 * This mock version does simple text matching.
 */
export const checkImageMatchesPrompt = (image: GeneratedImage): boolean => {
  if (!image?.prompt || !image?.url) return false;
  
  const normalizedPrompt = image.prompt.toLowerCase();
  const imageUrl = image.url.toLowerCase();
  
  // Check for known entities in the URL
  const knownEntities = [
    'narendra modi', 'modi', 'trump', 'biden', 'obama', 'musk',
    'taj mahal', 'eiffel tower', 'statue of liberty', 'great wall'
  ];
  
  // If prompt contains a known entity, check if the URL seems to match it
  for (const entity of knownEntities) {
    if (normalizedPrompt.includes(entity)) {
      // For known entities, we'll validate if the image URL contains markers for that entity
      // In a mock system, we might have specifically added markers to the URL
      
      // If URL contains relevant terms or entity identifiers, consider it a match
      if (imageUrl.includes(entity.replace(/\s+/g, '-')) || 
          imageUrl.includes(encodeURIComponent(entity)) ||
          imageUrl.includes('&entity=') && imageUrl.includes(entity.charAt(0))) {
        return true;
      }
    }
  }
  
  // Check for potential matches in URL
  const promptKeywords = normalizedPrompt
    .split(/\s+/)
    .filter(word => word.length > 3) // Only consider significant words
    .map(word => word.replace(/[^a-z]/g, '')); // Remove non-alphabetic chars
  
  // Count how many keywords from prompt appear in the URL
  const matchingKeywords = promptKeywords.filter(keyword => {
    return imageUrl.includes(keyword) || 
           // Check for hyphenated or encoded versions
           imageUrl.includes(keyword.replace(/\s+/g, '-')) || 
           imageUrl.includes(encodeURIComponent(keyword));
  });
  
  // Consider it a match if at least 25% of keywords are found in URL
  // or if there are style indicators that match
  return (
    matchingKeywords.length > 0 && matchingKeywords.length / promptKeywords.length >= 0.25
  ) || (
    // Style indicators
    (image.style && normalizedPrompt.includes(image.style)) ||
    (image.style && imageUrl.includes(image.style))
  );
};

/**
 * Get confidence level for image match (0-100)
 */
export const getImageMatchConfidence = (image: GeneratedImage): number => {
  if (!image?.prompt || !image?.url) return 0;
  
  const normalizedPrompt = image.prompt.toLowerCase();
  const imageUrl = image.url.toLowerCase();
  
  // Check for named entities
  const namedEntityMatches = [
    'narendra modi', 'modi', 'trump', 'biden', 'obama', 'musk',
    'taj mahal', 'eiffel tower', 'statue of liberty', 'great wall'
  ].some(entity => 
    normalizedPrompt.includes(entity) && 
    (imageUrl.includes(entity.replace(/\s+/g, '-')) || 
     imageUrl.includes(encodeURIComponent(entity)))
  );
  
  if (namedEntityMatches) {
    return 95; // High confidence for named entity matches
  }
  
  // Extract keywords from prompt
  const promptKeywords = normalizedPrompt
    .split(/\s+/)
    .filter(word => word.length > 3)
    .map(word => word.replace(/[^a-z]/g, ''));
  
  // Count matches in URL
  const matchingKeywords = promptKeywords.filter(keyword => {
    return imageUrl.includes(keyword) || 
           imageUrl.includes(keyword.replace(/\s+/g, '-')) || 
           imageUrl.includes(encodeURIComponent(keyword));
  });
  
  if (promptKeywords.length === 0) return 50; // Default medium confidence
  
  // Calculate match percentage
  const matchPercentage = (matchingKeywords.length / promptKeywords.length) * 100;
  
  // Add bonus for style match
  const styleBonus = (image.style && normalizedPrompt.includes(image.style)) ? 20 : 0;
  
  // Return final confidence score (capped at 100)
  return Math.min(matchPercentage + styleBonus, 100);
};
