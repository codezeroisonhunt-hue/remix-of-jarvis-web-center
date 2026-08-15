
// Mock image data for development and testing
// This would be replaced with real API calls in production

// Collection of mock images by category
export const MOCK_IMAGES = {
  // Various categories
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  mountain: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  sunset: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  forest: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  city: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  space: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  food: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  robot: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  cyberpunk: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  neon: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  fantasy: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  dragon: "https://images.unsplash.com/photo-1577368211130-4baa6e866b9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  unicorn: "https://images.unsplash.com/photo-1518798337062-7e89f7b44c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
};

// Key creative combinations that should be matched specifically
export const CREATIVE_COMBOS = {
  "sunset over mountains": "https://images.unsplash.com/photo-1529963183134-61a90db47bd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "cyberpunk city": "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "neon lights": "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "disco fish": "https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&sat=30",
  "robot meditation": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "magical forest": "https://images.unsplash.com/photo-1440342359743-84fcb8c860e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "glowing mushrooms": "https://images.unsplash.com/photo-1516248282803-7cc50389cca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
};

// Style-specific image sets for consistent style matching
export const STYLE_IMAGES = {
  realistic: {
    landscape: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    animal: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  anime: {
    landscape: "https://images.unsplash.com/photo-1623275055422-10c2903521c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  "3d": {
    landscape: "https://images.unsplash.com/photo-1620063633168-8b1f26ced98d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/photo-1601532481863-f5cba84c7243?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  abstract: {
    landscape: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/photo-1552083974-186346191183?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  painting: {
    landscape: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  pixel: {
    landscape: "https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/photo-1633344512977-b5b5310a01cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  "sci-fi": {
    landscape: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  fantasy: {
    landscape: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    portrait: "https://images.unsplash.com/photo-1580983230786-f03676a7ade6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
};

// Named entity images - specific images for known entities
const NAMED_ENTITY_IMAGES = {
  // Political figures and celebrities
  "narendra modi": "https://images.unsplash.com/photo-1590075865003-e48277b7ripx?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "modi": "https://images.unsplash.com/photo-1590075865003-e48277b7ripx?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "donald trump": "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "trump": "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "joe biden": "https://images.unsplash.com/photo-1609949258495-e9a5748da7b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "biden": "https://images.unsplash.com/photo-1609949258495-e9a5748da7b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "barack obama": "https://images.unsplash.com/photo-1580130732478-4e339fb6836f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "obama": "https://images.unsplash.com/photo-1580130732478-4e339fb6836f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "elon musk": "https://images.unsplash.com/photo-1571132554361-6b726fbcea15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "musk": "https://images.unsplash.com/photo-1571132554361-6b726fbcea15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  
  // Landmarks
  "taj mahal": "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "eiffel tower": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "statue of liberty": "https://images.unsplash.com/photo-1546155590-43f75860e37a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "great wall of china": "https://images.unsplash.com/photo-1508804052814-cd3ba865a116?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
};

// Special styled images for named entities (e.g., anime style celebrity)
const STYLED_ENTITY_IMAGES = {
  "narendra modi": {
    "anime": "https://images.unsplash.com/photo-1590075865003-e48277b7ripx?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&styled=anime",
    "portrait": "https://images.unsplash.com/photo-1590075865003-e48277b7ripx?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&q=90",
    "painting": "https://images.unsplash.com/photo-1590075865003-e48277b7ripx?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80&styled=painting"
  }
};

/**
 * Get an image URL for a named entity
 */
export const getNamedEntityImage = (entity: string, style?: string): string | null => {
  const normalizedEntity = entity.toLowerCase().trim();
  
  // Check for styled entity image first
  if (style && 
      STYLED_ENTITY_IMAGES[normalizedEntity] && 
      STYLED_ENTITY_IMAGES[normalizedEntity][style]) {
    return STYLED_ENTITY_IMAGES[normalizedEntity][style];
  }
  
  // Fall back to standard entity image
  if (NAMED_ENTITY_IMAGES[normalizedEntity]) {
    return NAMED_ENTITY_IMAGES[normalizedEntity];
  }
  
  return null; // No specific image found
};

/**
 * Get a random image URL from mock data
 */
export const getRandomImage = (): string => {
  const keys = Object.keys(MOCK_IMAGES);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return MOCK_IMAGES[randomKey];
};

/**
 * Get a mock image URL based on prompt and style
 */
export const getMockImageUrl = (prompt: string, style?: string): string => {
  // Normalize the prompt
  const normalizedPrompt = prompt.toLowerCase();
  
  // First check for exact creative combo matches
  for (const [key, url] of Object.entries(CREATIVE_COMBOS)) {
    if (normalizedPrompt.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // Next, check for specific subject matches
  for (const [key, url] of Object.entries(MOCK_IMAGES)) {
    if (normalizedPrompt.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // If we have a style, try to match based on content type + style
  if (style && STYLE_IMAGES[style]) {
    // Determine if the prompt is more likely to be a landscape or portrait
    if (normalizedPrompt.includes('person') || 
        normalizedPrompt.includes('portrait') || 
        normalizedPrompt.includes('face') ||
        normalizedPrompt.includes('woman') ||
        normalizedPrompt.includes('man')) {
      return STYLE_IMAGES[style].portrait || getRandomImage();
    } else {
      return STYLE_IMAGES[style].landscape || getRandomImage();
    }
  }
  
  // Fallback to a random image
  return getRandomImage();
};
