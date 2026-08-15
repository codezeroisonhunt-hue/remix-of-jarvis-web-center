
export type OSINTSourceType = 'social' | 'news' | 'public_records' | 'web' | 'leaked_data';

export interface OSINTSearchParams {
  query: string;
  sources: OSINTSourceType[];
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all';
  location?: string;
  limit?: number;
}

export interface OSINTSearchResult {
  id: string;
  title: string;
  description: string;
  source: OSINTSourceType;
  sourceUrl: string;
  sourceName: string;
  timestamp: Date;
  confidence: number;
  entities?: OSINTEntity[];
  relationships?: OSINTRelationship[];
  metadata?: Record<string, any>;
  imageUrl?: string;
}

export interface OSINTEntity {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location' | 'event' | 'other';
  confidence: number;
  metadata?: Record<string, any>;
}

export interface OSINTRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: 'mentions' | 'involves' | 'located_at' | 'works_for' | 'related_to' | 'other';
  confidence: number;
  description?: string;
}

export interface EntityAnalysis {
  entity: OSINTEntity;
  mentionCount: number;
  sources: Set<string>;
  relatedEntities: {
    entity: OSINTEntity;
    relationshipType: string;
    strength: number;
  }[];
}

export interface OSINTAnalytics {
  topEntities: EntityAnalysis[];
  sourceDistribution: Record<OSINTSourceType, number>;
  timeSeries: {
    date: Date;
    count: number;
  }[];
  entityNetwork: {
    nodes: OSINTEntity[];
    links: OSINTRelationship[];
  };
}
