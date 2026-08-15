
import React, { useState } from 'react';
import JarvisHeader from '@/components/interface/JarvisHeader';
import OSINTDashboard from '@/components/osint/OSINTDashboard';
import OSINTSearchForm from '@/components/osint/OSINTSearchForm';
import OSINTResultsViewer from '@/components/osint/OSINTResultsViewer';
import JarvisBackground from '@/components/interface/JarvisBackground';
import { useJarvisSystem } from '@/hooks/useJarvisSystem';
import { OSINTSearchResult, OSINTSearchParams } from '@/types/osint';
import { searchOSINTData } from '@/services/osintService';
import { toast } from '@/components/ui/use-toast';

const OSINTSearch = () => {
  const { hackerModeActive, isMuted, toggleMute } = useJarvisSystem();
  const [searchResults, setSearchResults] = useState<OSINTSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['news', 'social']);
  const [activeView, setActiveView] = useState<'results' | 'dashboard'>('results');

  const handleSearch = async (params: OSINTSearchParams) => {
    try {
      setIsSearching(true);
      toast({
        title: "OSINT Search Initiated",
        description: `Searching for "${params.query}" across ${params.sources.join(', ')} sources`,
      });
      
      const results = await searchOSINTData(params);
      setSearchResults(results);
      
      toast({
        title: "OSINT Search Complete",
        description: `Found ${results.length} results`,
      });
    } catch (error) {
      console.error("OSINT search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to complete OSINT search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-jarvis-bg text-white relative overflow-hidden">
      <JarvisBackground hackerModeActive={hackerModeActive} />
      
      <JarvisHeader 
        hackerModeActive={hackerModeActive} 
        activeAssistant="jarvis" 
        toggleMute={toggleMute}
        isMuted={isMuted}
      />

      <div className="flex-1 p-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          <div className="lg:col-span-1 glass-morphism p-4 rounded-lg">
            <OSINTSearchForm 
              isSearching={isSearching}
              onSearch={handleSearch}
              selectedSources={selectedSources}
              setSelectedSources={setSelectedSources}
            />
          </div>
          
          <div className="lg:col-span-3 glass-morphism p-4 rounded-lg h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-jarvis">OSINT Intelligence</h2>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveView('results')}
                  className={`px-3 py-1 rounded ${activeView === 'results' ? 'bg-jarvis text-black' : 'bg-black/30 hover:bg-jarvis/40'}`}
                >
                  Results
                </button>
                <button 
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-1 rounded ${activeView === 'dashboard' ? 'bg-jarvis text-black' : 'bg-black/30 hover:bg-jarvis/40'}`}
                >
                  Dashboard
                </button>
              </div>
            </div>
            
            <div className="h-[calc(100%-3rem)] overflow-auto">
              {activeView === 'results' ? (
                <OSINTResultsViewer results={searchResults} isLoading={isSearching} />
              ) : (
                <OSINTDashboard results={searchResults} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OSINTSearch;
