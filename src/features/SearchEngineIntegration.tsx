
import React, { useState } from 'react';
import { Search, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: 'web' | 'news' | 'images';
}

interface SearchEngineProps {
  results?: SearchResult[];
  isSearching?: boolean;
  onSearch?: (query: string, source: string) => void;
}

export const SearchEngineIntegration: React.FC<SearchEngineProps> = ({ 
  results = [],
  isSearching = false,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('web');

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery, activeTab);
    }
  };

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Globe className="mr-2 h-4 w-4" /> Search Engine
        </CardTitle>
        <CardDescription>Search the web for information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the web..."
              className="pl-8 bg-black/40 border-jarvis/20 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            className="bg-jarvis hover:bg-jarvis/90"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 bg-black/50">
            <TabsTrigger 
              value="web"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              Web
            </TabsTrigger>
            <TabsTrigger 
              value="news"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              News
            </TabsTrigger>
            <TabsTrigger 
              value="images"
              className="data-[state=active]:bg-jarvis/20 data-[state=active]:text-jarvis"
            >
              Images
            </TabsTrigger>
          </TabsList>
          
          {['web', 'news', 'images'].map(tab => (
            <TabsContent key={tab} value={tab}>
              {isSearching ? (
                <div className="flex justify-center items-center p-8">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-jarvis rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-sm text-jarvis">Searching...</span>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-gray-400">No search results yet. Try searching for something.</p>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {results
                    .filter(result => result.source === tab)
                    .map(result => (
                      <div 
                        key={result.id} 
                        className="bg-black/40 border border-jarvis/20 rounded-md p-3"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-white">{result.title}</h4>
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-jarvis hover:text-jarvis/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">{result.snippet}</p>
                        <p className="text-gray-400 text-xs mt-1 truncate">{result.url}</p>
                      </div>
                    ))
                  }
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
