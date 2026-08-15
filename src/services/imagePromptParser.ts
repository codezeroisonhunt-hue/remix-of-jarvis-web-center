
import { ImageGenerationParams } from "./imageGenerationService";

// Enhanced style & image parameter parsing from prompt/user input.
export const parseImageRequest = (input: string): ImageGenerationParams => {
  const promptRegex = /^(?:create|generate|make|draw|show|paint|illustrate)(?:\s+an|\s+a)?(?:\s+image|picture)?(?:\s+of|about|showing)?\s+(.+)$/i;
  const match = input.match(promptRegex);
  
  // Extract the core prompt, removing command words
  const prompt = match ? match[1] : input.replace(/^(create|generate|make|draw|show|paint|illustrate)(\s+an|\s+a)?\s*(image|picture)?\s*(of|about|showing)?\s*/i, '');
  
  // Create base params object
  const params: ImageGenerationParams = {
    prompt,
    enhancedAccuracy: true, // Enable enhanced accuracy mode
  };
  
  // Check for named entities (people, landmarks, etc.)
  const namedEntities = detectNamedEntities(prompt);
  if (namedEntities.length > 0) {
    params.subjectFocus = namedEntities[0]; // Use the primary named entity as subject focus
    params.subjectAccuracy = "high"; // Request high accuracy for named entities
  }
  
  // Enhanced style detection
  if (/realistic|photo|photograph|real/i.test(input)) params.style = 'realistic';
  else if (/anime|cartoon|animated|manga/i.test(input)) params.style = 'anime';
  else if (/3d|three.dimensional|render|blender/i.test(input)) params.style = '3d';
  else if (/abstract|artistic|modern art/i.test(input)) params.style = 'abstract';
  else if (/painting|painted|oil|acrylic|watercolor/i.test(input)) params.style = 'painting';
  else if (/pixel|pixel art|pixelated|retro game/i.test(input)) params.style = 'pixel';
  else if (/sci[\s\-]?fi|science fiction|futuristic/i.test(input)) params.style = 'sci-fi';
  else if (/fantasy|mythical|magical|dragon|elf|wizard/i.test(input)) params.style = 'fantasy';
  else if (/portrait|headshot|face/i.test(input)) params.style = 'portrait';
  else if (/sunset|evening|dusk/i.test(input) && /mountain|hill|peak/i.test(input)) {
    // Special handling for sunset over mountains
    params.style = 'realistic';
  }

  // Check for resolution keywords
  if (/high(\s+)?(resolution|quality)|detailed|crisp/i.test(input)) params.resolution = '1024x1024';
  else if (/medium(\s+)?(resolution|quality)/i.test(input)) params.resolution = '768x768';
  else if (/low(\s+)?(resolution|quality)|small/i.test(input)) params.resolution = '512x512';

  // Check for aspect ratio keywords
  if (/wide|landscape|panorama|cinematic/i.test(input)) params.aspectRatio = '16:9';
  else if (/square/i.test(input)) params.aspectRatio = '1:1';
  else if (/portrait|vertical|tall/i.test(input)) {
    // Support both portrait aspect ratios
    if (/3:2|3by2/i.test(input)) params.aspectRatio = '3:2';
    else params.aspectRatio = '4:3';
  }

  console.log("Parsed image parameters:", params);
  return params;
};

// Function to detect named entities like people, landmarks, etc. in the prompt
function detectNamedEntities(prompt: string): string[] {
  const entities: string[] = [];
  
  // Common person detection - match known public figures, leaders, etc.
  const knownPeople = [
    'narendra modi', 'modi', 'donald trump', 'trump', 'joe biden', 'biden',
    'barack obama', 'obama', 'elon musk', 'musk', 'bill gates', 'gates',
    'mark zuckerberg', 'zuckerberg', 'jeff bezos', 'bezos',
    // Add more common names as needed
  ];
  
  // Check if prompt contains any known people
  for (const person of knownPeople) {
    if (prompt.toLowerCase().includes(person.toLowerCase())) {
      entities.push(person);
      break; // Found one match, that's enough
    }
  }
  
  // Famous landmarks
  const landmarks = ['taj mahal', 'eiffel tower', 'statue of liberty', 'great wall of china'];
  for (const landmark of landmarks) {
    if (prompt.toLowerCase().includes(landmark.toLowerCase())) {
      entities.push(landmark);
      break;
    }
  }
  
  return entities;
}
