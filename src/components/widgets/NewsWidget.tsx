
import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { NewsArticle, getNewsUpdates } from '@/services/newsService';
import { toast } from '@/components/ui/use-toast';

interface NewsWidgetProps {
  articles?: NewsArticle[];
  isCompact?: boolean;
  autoRefresh?: boolean;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ 
  articles: initialArticles, 
  isCompact = false,
  autoRefresh = true
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshProgress, setRefreshProgress] = useState<number>(100);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Auto refresh news every 3 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const refreshInterval = 180; // seconds
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    
    const startRefreshCycle = () => {
      setRefreshProgress(100);
      
      // Update progress bar
      progressTimer = setInterval(() => {
        setRefreshProgress(prev => {
          const newValue = prev - (100 / refreshInterval);
          return newValue < 0 ? 0 : newValue;
        });
      }, 1000);
      
      // Actual refresh
      timer = setTimeout(() => {
        fetchLatestNews();
        clearInterval(progressTimer);
        startRefreshCycle();
      }, refreshInterval * 1000);
    };
    
    startRefreshCycle();
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [autoRefresh]);
  
  // Fetch news data
  const fetchLatestNews = async () => {
    try {
      setLoading(true);
      const freshNews = await getNewsUpdates({ count: 5 });
      setArticles(freshNews);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast({
        title: "Error fetching news",
        description: "Could not retrieve the latest news. Using cached data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Force refresh news
  const handleRefresh = () => {
    setRefreshProgress(100);
    fetchLatestNews();
  };
  
  // Format relative time (like "2 mins ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  // Filter articles by category
  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);
  
  // Get unique categories
  const categories = ['all', ...new Set(articles.map(article => article.category).filter(Boolean))];
  
  // Initialize fetch if no articles provided
  useEffect(() => {
    if (!initialArticles || initialArticles.length === 0) {
      fetchLatestNews();
    }
  }, [initialArticles]);
  
  if (isCompact) {
    return (
      <div className="news-widget-compact bg-black/40 p-3 rounded-lg border border-[#33c3f0]/20 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Newspaper className="h-5 w-5 text-[#33c3f0]" />
            <div className="ml-2 text-sm">
              <span className="text-white font-medium">Latest:</span>
              {loading ? (
                <span className="text-gray-300 ml-1">Loading news...</span>
              ) : articles.length > 0 ? (
                <span className="text-gray-300 ml-1">{articles[0].title}</span>
              ) : (
                <span className="text-gray-300 ml-1">No news available</span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRefresh}>
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </Button>
        </div>
        
        {autoRefresh && (
          <Progress 
            value={refreshProgress} 
            className="h-1 bg-black/50 absolute bottom-0 left-0 right-0" 
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="news-widget bg-black/40 p-4 rounded-lg border border-[#33c3f0]/20 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Globe className="h-5 w-5 text-[#33c3f0] mr-2" />
          <h3 className="text-[#33c3f0] font-medium">Global News</h3>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-300">
          <Calendar className="h-3 w-3" />
          <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRefresh}>
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </Button>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex space-x-2 mb-3 overflow-x-auto scrollbar-thin pb-1">
        {categories.map((category) => (
          <button 
            key={category}
            className={`px-2 py-1 text-xs rounded-md ${
              activeCategory === category 
                ? 'bg-[#33c3f0]/20 text-[#33c3f0] border border-[#33c3f0]/30' 
                : 'bg-black/30 text-gray-300 hover:bg-black/40'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse flex flex-col w-full space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No news available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.slice(0, 5).map((article, index) => (
            <div key={index} className="border-b border-gray-700 pb-2 last:border-0">
              <div className="text-sm font-medium text-white">{article.title}</div>
              <div className="text-xs text-gray-400 mt-1">
                <p className="line-clamp-2">{article.summary}</p>
              </div>
              <div className="text-xs text-gray-400 mt-1 flex justify-between">
                <span>{article.source}</span>
                <div className="flex space-x-2">
                  <span className="capitalize">{article.category}</span>
                  <span className="text-[#33c3f0]">
                    {getRelativeTime(article.publishedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {autoRefresh && (
        <Progress 
          value={refreshProgress} 
          className="h-1 bg-black/50 absolute bottom-0 left-0 right-0" 
        />
      )}
    </div>
  );
};

export default NewsWidget;
