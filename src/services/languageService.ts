
/**
 * Language detection service
 * Detects the language of the input text and returns the language code
 */

// Support for multiple languages with their codes and names
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

// Simple language detection patterns (for demo purposes)
const languagePatterns: Record<string, string[]> = {
  en: ['the', 'is', 'are', 'what', 'when', 'how', 'why', 'you', 'hello', 'thanks'],
  es: ['el', 'la', 'los', 'es', 'son', 'que', 'cuando', 'como', 'hola', 'gracias'],
  fr: ['le', 'la', 'les', 'est', 'sont', 'que', 'quand', 'comment', 'bonjour', 'merci'],
  de: ['der', 'die', 'das', 'ist', 'sind', 'wenn', 'wie', 'warum', 'hallo', 'danke'],
  it: ['il', 'la', 'i', 'è', 'sono', 'quando', 'come', 'perché', 'ciao', 'grazie'],
};

/**
 * Detects the language of the input text
 * @param text The text to detect the language for
 * @returns The ISO 639-1 language code (e.g., 'en', 'es', 'fr')
 */
export const detectLanguage = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) {
    return 'en'; // Default to English for empty text
  }

  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\s+/);
  
  // Count matches for each language
  const scores: Record<string, number> = {};
  Object.keys(languagePatterns).forEach(langCode => {
    scores[langCode] = 0;
    
    languagePatterns[langCode].forEach(pattern => {
      words.forEach(word => {
        if (word === pattern) {
          scores[langCode] += 1;
        }
      });
    });
    
    // Normalize by pattern count
    scores[langCode] /= languagePatterns[langCode].length;
  });
  
  // Find the language with the highest score
  let detectedLanguage = 'en'; // Default to English
  let highestScore = 0;
  
  Object.entries(scores).forEach(([langCode, score]) => {
    if (score > highestScore) {
      highestScore = score;
      detectedLanguage = langCode;
    }
  });
  
  // If confidence is too low, default to English
  if (highestScore < 0.1) {
    return 'en';
  }
  
  return detectedLanguage;
};
