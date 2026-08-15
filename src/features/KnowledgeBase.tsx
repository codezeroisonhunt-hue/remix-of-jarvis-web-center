
import React, { useState } from 'react';
import { Book, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface KnowledgeBaseProps {
  knowledgeItems?: KnowledgeItem[];
  onSearch?: (query: string) => void;
  onAddItem?: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ 
  knowledgeItems = [],
  onSearch,
  onAddItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Book className="mr-2 h-4 w-4" /> Knowledge Base
        </CardTitle>
        <CardDescription>Access JARVIS's extensive knowledge repository</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              className="pl-8 bg-black/40 border-jarvis/20 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            className="bg-jarvis hover:bg-jarvis/90"
          >
            Search
          </Button>
          {onAddItem && (
            <Button 
              variant="outline" 
              onClick={onAddItem}
              className="border-jarvis/30 text-jarvis"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {knowledgeItems.length === 0 ? (
            <p className="text-gray-400 text-sm">No knowledge items found. Try searching or adding new items.</p>
          ) : (
            knowledgeItems.map(item => (
              <div 
                key={item.id} 
                className="bg-black/40 border border-jarvis/20 rounded-md p-3 hover:border-jarvis/50 transition-colors cursor-pointer"
              >
                <h4 className="font-medium text-white mb-1">{item.title}</h4>
                <p className="text-gray-300 text-sm line-clamp-2">{item.content}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-jarvis/30 text-jarvis">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
