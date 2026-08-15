
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { OSINTSearchParams, OSINTSourceType } from '@/types/osint';
import { Search, Filter, Calendar } from 'lucide-react';

interface OSINTSearchFormProps {
  isSearching: boolean;
  onSearch: (params: OSINTSearchParams) => Promise<void>;
  selectedSources: string[];
  setSelectedSources: React.Dispatch<React.SetStateAction<string[]>>;
}

const OSINTSearchForm: React.FC<OSINTSearchFormProps> = ({
  isSearching,
  onSearch,
  selectedSources,
  setSelectedSources,
}) => {
  const [query, setQuery] = useState('');
  const [timeframe, setTimeframe] = useState<string>('month');
  const [location, setLocation] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sourceOptions = [
    { id: 'social', label: 'Social Media' },
    { id: 'news', label: 'News Sources' },
    { id: 'public_records', label: 'Public Records' },
    { id: 'web', label: 'Web Search' },
    { id: 'leaked_data', label: 'Leaked Data' },
  ];

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(s => s !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    const params: OSINTSearchParams = {
      query: query.trim(),
      sources: selectedSources as OSINTSourceType[],
      timeframe: timeframe as any,
    };
    
    if (location.trim()) {
      params.location = location.trim();
    }
    
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-jarvis">OSINT Search</h2>
      
      <div className="space-y-2">
        <Label htmlFor="query">Search Query</Label>
        <div className="flex space-x-2">
          <Input
            id="query"
            placeholder="Enter name, keyword, or phrase..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-black/30 border-jarvis/30 focus:border-jarvis text-white"
            required
          />
          <Button 
            type="submit" 
            disabled={isSearching || !query.trim()} 
            className={`${isSearching ? 'bg-jarvis/50' : 'bg-jarvis hover:bg-jarvis/80'} text-black`}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
      
      <div className="pt-2 border-t border-jarvis/20">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          <Filter className="w-4 h-4" />
          Data Sources
        </h3>
        <div className="space-y-1.5">
          {sourceOptions.map((source) => (
            <div key={source.id} className="flex items-center">
              <Checkbox
                id={`source-${source.id}`}
                checked={selectedSources.includes(source.id)}
                onCheckedChange={() => handleSourceToggle(source.id)}
                className="border-jarvis/50 data-[state=checked]:bg-jarvis data-[state=checked]:text-black"
              />
              <Label
                htmlFor={`source-${source.id}`}
                className="ml-2 text-sm font-medium"
              >
                {source.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-2 border-t border-jarvis/20">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Time Range
        </h3>
        <Select 
          value={timeframe} 
          onValueChange={setTimeframe}
        >
          <SelectTrigger className="w-full bg-black/30 border-jarvis/30 text-white">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Past 24 Hours</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Button
          type="button"
          variant="link"
          className="text-jarvis p-0 text-sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide advanced options" : "Show advanced options"}
        </Button>
      </div>
      
      {showAdvanced && (
        <div className="space-y-3 pt-2 border-t border-jarvis/20">
          <div>
            <Label htmlFor="location">Geographic Location</Label>
            <Input
              id="location"
              placeholder="City, Country, or Region..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-black/30 border-jarvis/30 focus:border-jarvis text-white"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default OSINTSearchForm;
