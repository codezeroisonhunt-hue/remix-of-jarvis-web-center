
import { OSINTSearchParams, OSINTSearchResult, OSINTAnalytics, OSINTEntity, OSINTRelationship, EntityAnalysis } from '@/types/osint';
import { v4 as uuidv4 } from 'uuid';

// Mock API endpoints - in a real implementation, these would call actual APIs
const API_ENDPOINTS = {
  news: 'https://api.example.com/news-search',
  social: 'https://api.example.com/social-media-search',
  public_records: 'https://api.example.com/public-records',
  web: 'https://api.example.com/web-search',
  leaked_data: 'https://api.example.com/leaked-data',
};

// Sample news sources for mock data
const NEWS_SOURCES = [
  { name: 'CNN', domain: 'cnn.com' },
  { name: 'BBC', domain: 'bbc.com' },
  { name: 'Reuters', domain: 'reuters.com' },
  { name: 'Associated Press', domain: 'ap.org' },
  { name: 'Al Jazeera', domain: 'aljazeera.com' },
];

// Sample social media platforms for mock data
const SOCIAL_PLATFORMS = [
  { name: 'Twitter', domain: 'twitter.com' },
  { name: 'Reddit', domain: 'reddit.com' },
  { name: 'LinkedIn', domain: 'linkedin.com' },
  { name: 'Facebook', domain: 'facebook.com' },
];

// Sample entity types and names for generating mock relationships
const ENTITY_TYPES = ['person', 'organization', 'location', 'event'] as const;
const RELATIONSHIP_TYPES = ['mentions', 'involves', 'located_at', 'works_for', 'related_to'] as const;

/**
 * Search for OSINT data across multiple sources
 */
export const searchOSINTData = async (params: OSINTSearchParams): Promise<OSINTSearchResult[]> => {
  console.log('Searching OSINT data with params:', params);
  
  // In a real implementation, we would make actual API calls
  // For now, we'll generate mock data
  const results: OSINTSearchResult[] = [];
  
  // Add some delay to simulate API calls
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock results based on selected sources
  for (const source of params.sources) {
    const sourceResults = await mockSourceSearch(source, params);
    results.push(...sourceResults);
  }
  
  // Sort results by timestamp (newest first)
  results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return results;
};

/**
 * Generate mock search results for a specific source
 */
const mockSourceSearch = async (source: string, params: OSINTSearchParams): Promise<OSINTSearchResult[]> => {
  const results: OSINTSearchResult[] = [];
  const count = Math.floor(Math.random() * 5) + 3; // 3-7 results per source
  
  for (let i = 0; i < count; i++) {
    // Create entities related to the search query
    const entities = generateMockEntities(params.query, Math.floor(Math.random() * 3) + 1);
    
    // Create relationships between entities
    const relationships = generateMockRelationships(entities);
    
    let sourceName, sourceUrl, title, description, imageUrl;
    
    switch (source) {
      case 'news':
        const newsSource = NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)];
        sourceName = newsSource.name;
        sourceUrl = `https://${newsSource.domain}/article/${uuidv4().substring(0, 8)}`;
        title = generateNewsTitle(params.query);
        description = generateNewsDescription(params.query, entities);
        imageUrl = Math.random() > 0.3 ? `https://source.unsplash.com/random/300x200?${params.query.split(' ')[0]}` : undefined;
        break;
        
      case 'social':
        const platform = SOCIAL_PLATFORMS[Math.floor(Math.random() * SOCIAL_PLATFORMS.length)];
        sourceName = platform.name;
        sourceUrl = `https://${platform.domain}/user/post/${uuidv4().substring(0, 8)}`;
        title = generateSocialTitle(params.query);
        description = generateSocialDescription(params.query, entities);
        imageUrl = Math.random() > 0.7 ? `https://source.unsplash.com/random/300x200?${params.query.split(' ')[0]}` : undefined;
        break;
        
      case 'public_records':
        sourceName = "Public Records Database";
        sourceUrl = `https://public-records.example.gov/record/${uuidv4().substring(0, 8)}`;
        title = `Public Record: ${toTitleCase(params.query)}`;
        description = generatePublicRecordDescription(params.query, entities);
        break;
        
      case 'web':
        sourceName = `${params.query.split(' ')[0]}.${['com', 'org', 'net'][Math.floor(Math.random() * 3)]}`;
        sourceUrl = `https://www.${sourceName}/page/${uuidv4().substring(0, 8)}`;
        title = `${toTitleCase(params.query)} - Web Result`;
        description = generateWebDescription(params.query, entities);
        imageUrl = Math.random() > 0.5 ? `https://source.unsplash.com/random/300x200?${params.query.split(' ')[0]}` : undefined;
        break;
        
      case 'leaked_data':
        sourceName = "Data Breach Archive";
        sourceUrl = `https://leak-archive.example.com/leak/${uuidv4().substring(0, 8)}`;
        title = `Leaked Data Reference: ${toTitleCase(params.query)}`;
        description = generateLeakedDataDescription(params.query, entities);
        break;
        
      default:
        sourceName = "Unknown Source";
        sourceUrl = "https://example.com";
        title = `Result for: ${params.query}`;
        description = `Information related to ${params.query}`;
        break;
    }
    
    // Calculate a mock date within the requested timeframe
    const timestamp = calculateMockDate(params.timeframe || 'all');
    
    // Add the result
    results.push({
      id: uuidv4(),
      title,
      description,
      source: source as any,
      sourceName,
      sourceUrl,
      timestamp,
      confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0 confidence
      entities,
      relationships,
      imageUrl,
      metadata: {
        keywords: params.query.split(' '),
        relevanceScore: Math.random() * 0.5 + 0.5,
      }
    });
  }
  
  return results;
};

/**
 * Generate analytics from OSINT search results
 */
export const analyzeOSINTData = (results: OSINTSearchResult[]): OSINTAnalytics => {
  // Extract all entities from the results
  const allEntities = results.flatMap(r => r.entities || []);
  const allRelationships = results.flatMap(r => r.relationships || []);
  
  // Count entity mentions
  const entityMentions = new Map<string, number>();
  allEntities.forEach(entity => {
    entityMentions.set(entity.id, (entityMentions.get(entity.id) || 0) + 1);
  });
  
  // Count sources per entity
  const entitySources = new Map<string, Set<string>>();
  results.forEach(result => {
    (result.entities || []).forEach(entity => {
      if (!entitySources.has(entity.id)) {
        entitySources.set(entity.id, new Set());
      }
      entitySources.get(entity.id)?.add(result.sourceName);
    });
  });
  
  // Build entity analysis
  const entityAnalysis = new Map<string, EntityAnalysis>();
  allEntities.forEach(entity => {
    if (!entityAnalysis.has(entity.id)) {
      entityAnalysis.set(entity.id, {
        entity,
        mentionCount: entityMentions.get(entity.id) || 0,
        sources: entitySources.get(entity.id) || new Set(),
        relatedEntities: [],
      });
    }
  });
  
  // Add relationships to entity analysis
  allRelationships.forEach(rel => {
    const sourceEntity = entityAnalysis.get(rel.sourceEntityId);
    const targetEntity = entityAnalysis.get(rel.targetEntityId);
    
    if (sourceEntity && targetEntity) {
      const targetEntityObj = targetEntity.entity;
      
      // Check if this relationship is already in the array
      const existing = sourceEntity.relatedEntities.find(r => r.entity.id === targetEntityObj.id);
      
      if (existing) {
        // Increase the strength of the existing relationship
        existing.strength += rel.confidence;
      } else {
        // Add a new related entity
        sourceEntity.relatedEntities.push({
          entity: targetEntityObj,
          relationshipType: rel.type,
          strength: rel.confidence,
        });
      }
    }
  });
  
  // Count results by source
  const sourceDistribution: Record<string, number> = {};
  results.forEach(result => {
    sourceDistribution[result.source] = (sourceDistribution[result.source] || 0) + 1;
  });
  
  // Create time series data
  const resultsByDay = new Map<string, number>();
  results.forEach(result => {
    const dateKey = result.timestamp.toISOString().split('T')[0];
    resultsByDay.set(dateKey, (resultsByDay.get(dateKey) || 0) + 1);
  });
  
  const timeSeries = Array.from(resultsByDay.entries())
    .map(([dateStr, count]) => ({
      date: new Date(dateStr),
      count,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Extract top entities
  const topEntities = Array.from(entityAnalysis.values())
    .sort((a, b) => b.mentionCount - a.mentionCount)
    .slice(0, 10);
  
  return {
    topEntities,
    sourceDistribution: sourceDistribution as any,
    timeSeries,
    entityNetwork: {
      nodes: allEntities,
      links: allRelationships,
    },
  };
};

// Helper functions for generating mock data
function generateMockEntities(query: string, count: number): OSINTEntity[] {
  const entities: OSINTEntity[] = [];
  
  // Always include an entity related to the search query
  entities.push({
    id: uuidv4(),
    name: toTitleCase(query),
    type: ENTITY_TYPES[Math.floor(Math.random() * ENTITY_TYPES.length)],
    confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0 confidence
  });
  
  // Generate additional random entities
  for (let i = 1; i < count; i++) {
    const entityType = ENTITY_TYPES[Math.floor(Math.random() * ENTITY_TYPES.length)];
    let name = "";
    
    switch (entityType) {
      case 'person':
        const firstNames = ['John', 'Jane', 'Alex', 'Maria', 'Li', 'Ahmed', 'Carlos', 'Priya'];
        const lastNames = ['Smith', 'Johnson', 'Wang', 'Garcia', 'Patel', 'Kim', 'Müller', 'Nguyen'];
        name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        break;
        
      case 'organization':
        const orgTypes = ['Inc.', 'LLC', 'Corporation', 'Foundation', 'Group', 'Association'];
        const orgPrefix = ['Global', 'National', 'International', 'United', 'Advanced', 'Superior'];
        name = `${orgPrefix[Math.floor(Math.random() * orgPrefix.length)]} ${toTitleCase(query)} ${orgTypes[Math.floor(Math.random() * orgTypes.length)]}`;
        break;
        
      case 'location':
        const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Cairo', 'Mumbai', 'São Paulo'];
        name = cities[Math.floor(Math.random() * cities.length)];
        break;
        
      case 'event':
        const eventTypes = ['Conference', 'Meeting', 'Summit', 'Announcement', 'Launch', 'Investigation'];
        name = `${query} ${eventTypes[Math.floor(Math.random() * eventTypes.length)]} ${2020 + Math.floor(Math.random() * 5)}`;
        break;
        
      default:
        name = `Entity related to ${query}`;
    }
    
    entities.push({
      id: uuidv4(),
      name,
      type: entityType,
      confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0 confidence
    });
  }
  
  return entities;
}

function generateMockRelationships(entities: OSINTEntity[]): OSINTRelationship[] {
  const relationships: OSINTRelationship[] = [];
  
  if (entities.length <= 1) {
    return [];
  }
  
  // Create some relationships between entities
  for (let i = 0; i < entities.length - 1; i++) {
    const sourceEntity = entities[i];
    const targetEntity = entities[i + 1];
    
    const relationshipType = RELATIONSHIP_TYPES[Math.floor(Math.random() * RELATIONSHIP_TYPES.length)];
    
    relationships.push({
      id: uuidv4(),
      sourceEntityId: sourceEntity.id,
      targetEntityId: targetEntity.id,
      type: relationshipType,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0 confidence
      description: generateRelationshipDescription(sourceEntity, targetEntity, relationshipType),
    });
    
    // Occasionally add an extra relationship
    if (Math.random() > 0.7 && entities.length > 2) {
      // Pick a random entity that's not the source or target
      let extraEntityIndex = Math.floor(Math.random() * entities.length);
      while (extraEntityIndex === i || extraEntityIndex === i + 1) {
        extraEntityIndex = Math.floor(Math.random() * entities.length);
      }
      
      const extraEntity = entities[extraEntityIndex];
      const extraRelationshipType = RELATIONSHIP_TYPES[Math.floor(Math.random() * RELATIONSHIP_TYPES.length)];
      
      relationships.push({
        id: uuidv4(),
        sourceEntityId: sourceEntity.id,
        targetEntityId: extraEntity.id,
        type: extraRelationshipType,
        confidence: Math.random() * 0.3 + 0.6, // 0.6-0.9 confidence
        description: generateRelationshipDescription(sourceEntity, extraEntity, extraRelationshipType),
      });
    }
  }
  
  return relationships;
}

function generateRelationshipDescription(source: OSINTEntity, target: OSINTEntity, type: string): string {
  switch (type) {
    case 'mentions':
      return `${source.name} directly mentions ${target.name}`;
      
    case 'involves':
      return `${source.name} is involved with ${target.name}`;
      
    case 'located_at':
      return `${source.name} is located at ${target.name}`;
      
    case 'works_for':
      return `${source.name} works for ${target.name}`;
      
    case 'related_to':
      return `${source.name} is related to ${target.name}`;
      
    default:
      return `${source.name} is connected to ${target.name}`;
  }
}

function generateNewsTitle(query: string): string {
  const templates = [
    'Breaking: {Query} Developments Unveiled in New Report',
    'Experts Analyze Recent {Query} Findings',
    'New Investigation Reveals {Query} Connections',
    '{Query} Story Gains Attention as Details Emerge',
    'Analysis: What the Latest {Query} Report Means',
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace('{Query}', toTitleCase(query));
}

function generateNewsDescription(query: string, entities: OSINTEntity[]): string {
  const entityMentions = entities.map(e => e.name).join(', ');
  
  const templates = [
    `A recent report on ${query} has revealed new connections involving ${entityMentions}. Experts are analyzing the implications.`,
    `Sources confirm new developments in the ${query} situation, with key figures including ${entityMentions}.`,
    `An investigation into ${query} has uncovered previously unknown details related to ${entityMentions}.`,
    `Analysis of ${query} documents shows significant links to ${entityMentions}, according to reliable sources.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateSocialTitle(query: string): string {
  const templates = [
    'Trending discussion on {Query}',
    'Viral post about {Query} gaining attention',
    'User shares insights on {Query}',
    '{Query} becomes hot topic in online communities',
    'Social media analysis of {Query} conversations',
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace('{Query}', query);
}

function generateSocialDescription(query: string, entities: OSINTEntity[]): string {
  const person = entities.find(e => e.type === 'person')?.name || 'User';
  
  const templates = [
    `"This is what they don't tell you about ${query}..." - viral post by ${person} gaining significant engagement.`,
    `Online discussion of ${query} reveals connections to ${entities.map(e => e.name).join(', ')}.`,
    `${person}'s post about ${query} has been shared over 5,000 times in the past 24 hours.`,
    `Trending hashtag #${query.replace(/\s+/g, '')} shows increasing activity related to ${entities.map(e => e.name).join(', ')}.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generatePublicRecordDescription(query: string, entities: OSINTEntity[]): string {
  const location = entities.find(e => e.type === 'location')?.name || 'the specified location';
  const person = entities.find(e => e.type === 'person')?.name;
  const org = entities.find(e => e.type === 'organization')?.name;
  
  const templates = [
    `Public record documents related to ${query} filed in ${location}.`,
    `Official ${query} records show connections between ${entities.map(e => e.name).join(', ')}.`,
    `${person ? `${person} appears in ` : ''}Public ${query} documentation in ${location} archives.`,
    `${org ? `${org} is mentioned in ` : ''}Government records pertaining to ${query}.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateWebDescription(query: string, entities: OSINTEntity[]): string {
  const templates = [
    `Webpage containing information about ${query} and mentions of ${entities.map(e => e.name).join(', ')}.`,
    `Website analysis reveals ${query}-related content with references to ${entities.map(e => e.name).join(', ')}.`,
    `Web crawler detected ${query} information on this page, with connections to ${entities.map(e => e.name).join(', ')}.`,
    `This website contains significant information about ${query} that matches search parameters.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateLeakedDataDescription(query: string, entities: OSINTEntity[]): string {
  const templates = [
    `Leaked documents mention ${query} in connection with ${entities.map(e => e.name).join(', ')}.`,
    `Data breach archives contain references to ${query} and associated entities.`,
    `Confidential information related to ${query} was exposed in a security breach.`,
    `Analysis of leaked data reveals previously unknown connections between ${query} and ${entities.map(e => e.name).join(', ')}.`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function calculateMockDate(timeframe: string): Date {
  const now = new Date();
  const result = new Date(now);
  
  switch (timeframe) {
    case 'day':
      result.setHours(now.getHours() - Math.floor(Math.random() * 24));
      break;
      
    case 'week':
      result.setDate(now.getDate() - Math.floor(Math.random() * 7));
      break;
      
    case 'month':
      result.setDate(now.getDate() - Math.floor(Math.random() * 30));
      break;
      
    case 'year':
      result.setMonth(now.getMonth() - Math.floor(Math.random() * 12));
      break;
      
    default:
      // For 'all', generate a date up to 3 years in the past
      result.setFullYear(now.getFullYear() - Math.floor(Math.random() * 3));
      result.setMonth(now.getMonth() - Math.floor(Math.random() * 12));
      break;
  }
  
  return result;
}

function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
