import { toast } from '@/components/ui/use-toast';

export interface NewsArticle {
  title: string;
  source: string;
  summary: string;
  url?: string;
  category: string;
  publishedAt: string;
}

export interface NewsQuery {
  category?: string;
  country?: string;
  topic?: string;
  count?: number;
}

// NewsAPI.org API key
const NEWS_API_KEY = 'b1953fe4e78644a29515ffa6d1d08fb7';

export const getNewsUpdates = async (query: NewsQuery = {}): Promise<NewsArticle[]> => {
  try {
    // Create the NewsAPI URL - Using a proxy to avoid CORS issues
    // Note: In production, this should be handled by a backend service
    let apiUrl = 'https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?';
    
    // Add parameters based on query
    const params = new URLSearchParams();
    
    if (query.category) {
      params.append('category', query.category);
    }
    
    if (query.country) {
      params.append('country', query.country);
    } else {
      // Default to US if no country specified
      params.append('country', 'us');
    }
    
    // Add the query parameter if topic is specified
    if (query.topic) {
      params.append('q', query.topic);
    }
    
    // Set page size (limit number of results)
    params.append('pageSize', String(query.count || 5));
    
    // Add the API key
    params.append('apiKey', NEWS_API_KEY);
    
    // Fetch the news from NewsAPI
    const response = await fetch(apiUrl + params.toString(), {
      headers: {
        'Origin': window.location.origin
      }
    });
    
    if (!response.ok) {
      throw new Error(`NewsAPI returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`);
    }
    
    // Map the API response to our NewsArticle interface
    return data.articles.map((article: any) => ({
      title: article.title,
      source: article.source.name,
      summary: article.description || 'No description available',
      url: article.url,
      category: query.category || 'general',
      publishedAt: article.publishedAt
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to mock data in case of error
    return getMockNewsData(query);
  }
};

// Mock news data for fallback
const getMockNewsData = (query: NewsQuery = {}): NewsArticle[] => {
  const mockNewsData: NewsArticle[] = [
    {
      title: "New Breakthrough in Quantum Computing",
      source: "Tech Today",
      summary: "Scientists have achieved a new milestone in quantum computing, demonstrating quantum supremacy for complex calculations.",
      category: "technology",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Global Climate Summit Reaches Agreement",
      source: "World News",
      summary: "World leaders have agreed on new measures to reduce carbon emissions during the latest climate summit.",
      category: "world",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Revolutionary AI Model Can Predict Protein Structures",
      source: "Science Daily",
      summary: "A new AI model can accurately predict protein structures, potentially accelerating drug discovery and biological research.",
      category: "science",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Stock Markets Show Strong Recovery",
      source: "Financial Times",
      summary: "Global markets rebounded today as investor confidence returned following positive economic indicators.",
      category: "business",
      publishedAt: new Date().toISOString()
    },
    {
      title: "New Space Telescope Captures Stunning Images",
      source: "Space News",
      summary: "The newly launched space telescope has sent back its first images, revealing unprecedented details of distant galaxies.",
      category: "science",
      publishedAt: new Date().toISOString()
    },
    {
      title: "India's Tech Sector Sees Unprecedented Growth",
      source: "India Today",
      summary: "India's technology sector has recorded its highest growth rate in five years, creating thousands of new jobs.",
      category: "technology",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Major Breakthrough in Renewable Energy Storage",
      source: "Green Tech",
      summary: "Researchers develop new battery technology that could revolutionize renewable energy storage capacity.",
      category: "technology",
      publishedAt: new Date().toISOString()
    },
    {
      title: "Indian Cricket Team Wins Major Tournament",
      source: "Sports Chronicle",
      summary: "India's national cricket team secured a decisive victory in the international championship.",
      category: "sports",
      publishedAt: new Date().toISOString()
    }
  ];
  
  let filteredNews = [...mockNewsData];
  
  // Filter by category if provided
  if (query.category) {
    filteredNews = filteredNews.filter(article => 
      article.category.toLowerCase() === query.category!.toLowerCase()
    );
  }
  
  // Filter for India news
  if (query.country === 'in') {
    filteredNews = filteredNews.filter(article => 
      article.title.toLowerCase().includes('india') || 
      article.summary.toLowerCase().includes('india') ||
      article.source.toLowerCase().includes('india')
    );
  }
  
  // Filter by topic if provided
  if (query.topic) {
    const topicLower = query.topic.toLowerCase();
    filteredNews = filteredNews.filter(article => 
      article.title.toLowerCase().includes(topicLower) || 
      article.summary.toLowerCase().includes(topicLower)
    );
  }
  
  // Limit the number of articles
  const count = query.count || 5;
  filteredNews = filteredNews.slice(0, count);
  
  return filteredNews;
};

export const parseNewsQuery = (query: string): NewsQuery => {
  const result: NewsQuery = {};
  
  // Check for category in the query
  if (query.includes("tech") || query.includes("technology")) {
    result.category = "technology";
  } else if (query.includes("world") || query.includes("global")) {
    result.category = "world";
  } else if (query.includes("science")) {
    result.category = "science";
  } else if (query.includes("business") || query.includes("finance")) {
    result.category = "business";
  } else if (query.includes("sports") || query.includes("sport")) {
    result.category = "sports";
  } else if (query.includes("health") || query.includes("medical")) {
    result.category = "health";
  } else if (query.includes("entertainment")) {
    result.category = "entertainment";
  }
  
  // Check for country in the query
  if (query.includes("india") || query.includes("indian")) {
    result.country = "in";
  } else if (query.includes("us") || query.includes("united states") || query.includes("america")) {
    result.country = "us";
  } else if (query.includes("uk") || query.includes("united kingdom") || query.includes("britain")) {
    result.country = "gb";
  }
  
  // Extract custom topic if present
  const topicMatch = query.match(/news\s+on\s+([a-zA-Z\s]+)|about\s+([a-zA-Z\s]+)/i);
  if (topicMatch) {
    result.topic = topicMatch[1] || topicMatch[2];
  }
  
  // Set count based on query
  if (query.includes("brief") || query.includes("summary")) {
    result.count = 3;
  } else if (query.includes("detail") || query.includes("full")) {
    result.count = 5;
  } else {
    result.count = 3; // Default
  }
  
  return result;
};

export const getNewsResponse = async (query: string): Promise<{text: string, articles: NewsArticle[]}> => {
  try {
    const parsedQuery = parseNewsQuery(query);
    const newsArticles = await getNewsUpdates(parsedQuery);
    
    let responseText = "";
    
    // Generate response based on query and results
    if (newsArticles.length === 0) {
      responseText = "I couldn't find any news matching your query at the moment.";
      return { text: responseText, articles: [] };
    }
    
    if (parsedQuery.topic) {
      responseText = `Here are the latest news about ${parsedQuery.topic}: `;
    } else if (parsedQuery.country === 'in') {
      responseText = "Here are the latest headlines from India: ";
    } else if (parsedQuery.category) {
      responseText = `Here are the latest ${parsedQuery.category} news updates: `;
    } else {
      responseText = "Here are today's top news stories: ";
    }
    
    newsArticles.forEach((article, index) => {
      responseText += `${index + 1}. ${article.title} from ${article.source}. ${article.summary} `;
    });
    
    return { text: responseText, articles: newsArticles };
  } catch (error) {
    console.error('Error getting news response:', error);
    return { 
      text: "I'm sorry, I couldn't retrieve the news updates at this time.", 
      articles: [] 
    };
  }
};
