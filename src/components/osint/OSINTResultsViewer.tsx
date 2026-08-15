
import React, { useState } from 'react';
import { OSINTSearchResult } from '@/types/osint';
import { Newspaper, Globe, Database, FileSearch, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface OSINTResultsViewerProps {
  results: OSINTSearchResult[];
  isLoading: boolean;
}

const OSINTResultsViewer: React.FC<OSINTResultsViewerProps> = ({ results, isLoading }) => {
  const [selectedResult, setSelectedResult] = useState<OSINTSearchResult | null>(null);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'social':
        return <Globe className="w-4 h-4" />;
      case 'news':
        return <Newspaper className="w-4 h-4" />;
      case 'public_records':
        return <Database className="w-4 h-4" />;
      case 'leaked_data':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileSearch className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <div className="md:col-span-1 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-jarvis/20 rounded-lg p-3 bg-black/30">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full bg-jarvis/20" />
                  <Skeleton className="h-5 w-28 bg-jarvis/20" />
                </div>
                <Skeleton className="h-4 w-full mt-2 bg-jarvis/20" />
                <Skeleton className="h-4 w-2/3 mt-2 bg-jarvis/20" />
                <div className="flex justify-between mt-3">
                  <Skeleton className="h-4 w-20 bg-jarvis/20" />
                  <Skeleton className="h-4 w-16 bg-jarvis/20" />
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-2 rounded-lg border border-jarvis/20 p-4 bg-black/40 hidden md:block">
            <Skeleton className="h-7 w-64 bg-jarvis/20" />
            <Skeleton className="h-4 w-full mt-4 bg-jarvis/20" />
            <Skeleton className="h-4 w-full mt-2 bg-jarvis/20" />
            <Skeleton className="h-4 w-2/3 mt-2 bg-jarvis/20" />
            <div className="mt-6">
              <Skeleton className="h-6 w-40 bg-jarvis/20" />
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Skeleton className="h-8 w-full bg-jarvis/20 rounded-md" />
                <Skeleton className="h-8 w-full bg-jarvis/20 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <FileSearch className="w-16 h-16 text-jarvis/50 mb-4" />
        <h3 className="text-lg font-medium text-white">No Results Found</h3>
        <p className="text-gray-400 text-center max-w-md mt-2">
          Try broadening your search terms, changing the data sources, or expanding the time range.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className="md:col-span-1">
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="pr-3 space-y-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedResult?.id === result.id
                      ? 'border-jarvis/70 bg-black/50'
                      : 'border-jarvis/20 bg-black/30 hover:bg-black/40'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {getSourceIcon(result.source)}
                    <span className="text-xs text-jarvis/80">{result.sourceName}</span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2">{result.title}</h3>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">{result.description}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getConfidenceColor(result.confidence)}`}
                    >
                      {Math.floor(result.confidence * 100)}% match
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="md:col-span-2 rounded-lg border border-jarvis/20 p-4 bg-black/40">
          {selectedResult ? (
            <div className="h-full">
              <h2 className="text-xl font-semibold text-jarvis">{selectedResult.title}</h2>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1 text-sm text-gray-300">
                  {getSourceIcon(selectedResult.source)}
                  <span>{selectedResult.sourceName}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-300">
                  {new Date(selectedResult.timestamp).toLocaleDateString()}
                </span>
                <span className="text-gray-500">•</span>
                <Badge 
                  variant="secondary" 
                  className={`${getConfidenceColor(selectedResult.confidence)}`}
                >
                  {Math.floor(selectedResult.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-200">{selectedResult.description}</p>
                
                {selectedResult.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={selectedResult.imageUrl} 
                      alt={selectedResult.title} 
                      className="rounded-md max-h-48 object-cover"
                    />
                  </div>
                )}
              </div>
              
              {selectedResult.entities && selectedResult.entities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2">Identified Entities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedResult.entities.map(entity => (
                      <div 
                        key={entity.id} 
                        className="bg-black/30 rounded-md p-2 border border-jarvis/20"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{entity.name}</span>
                          <Badge variant="outline">{entity.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedResult.relationships && selectedResult.relationships.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Relationships</h3>
                  <div className="space-y-2">
                    {selectedResult.relationships.map(rel => {
                      const source = selectedResult.entities?.find(e => e.id === rel.sourceEntityId)?.name || 'Entity';
                      const target = selectedResult.entities?.find(e => e.id === rel.targetEntityId)?.name || 'Entity';
                      
                      return (
                        <div 
                          key={rel.id}
                          className="bg-black/30 rounded-md p-2 border border-jarvis/20"
                        >
                          <p className="text-sm">{rel.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <a 
                  href={selectedResult.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-jarvis hover:underline text-sm flex items-center"
                >
                  View original source
                  <Globe className="ml-1 w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <FileSearch className="w-16 h-16 text-jarvis/50 mb-4" />
              <h3 className="text-lg font-medium">Select a result to view details</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getConfidenceColor(confidence: number): string {
  if (confidence > 0.8) return 'text-green-400';
  if (confidence > 0.5) return 'text-yellow-400';
  return 'text-red-400';
}

export default OSINTResultsViewer;
