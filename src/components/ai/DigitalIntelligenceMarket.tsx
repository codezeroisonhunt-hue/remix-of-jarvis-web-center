
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Star, Package } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { enhancedAIService } from '@/services/enhancedAIService';

interface MarketItem {
  name: string;
  price: number;
  rating: number;
}

const DigitalIntelligenceMarket: React.FC = () => {
  const [entityState, setEntityState] = useState(enhancedAIService.getEntityState('black-market'));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  
  useEffect(() => {
    // Update entity state when component mounts
    setEntityState(enhancedAIService.getEntityState('black-market'));
    
    // Simulate entity state updates
    const interval = setInterval(() => {
      setEntityState(enhancedAIService.getEntityState('black-market'));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const searchMarketplace = async () => {
    if (!searchQuery.trim() || isSearching) return;
    
    setIsSearching(true);
    setMarketItems([]);
    
    try {
      const result = await enhancedAIService.searchMarketplace(searchQuery);
      
      setMarketItems(result.items);
      
      toast(`Market Search Complete`, {
        description: `Found ${result.items.length} items matching "${searchQuery}"`
      });
      
    } catch (error) {
      toast(`Search Failed`, {
        description: `Unable to search marketplace at this time`
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const purchaseItem = (item: MarketItem) => {
    toast(`Item Purchased`, {
      description: `${item.name} added to your inventory`
    });
  };
  
  if (!entityState || !entityState.active) {
    return null;
  }
  
  return (
    <Card className="border-jarvis/30 bg-black/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ShoppingCart className="mr-2 h-4 w-4" /> Digital Intelligence Market
        </CardTitle>
        <CardDescription>
          Secure marketplace for digital tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search for tools, exploits, data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/40 border-jarvis/30 text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') searchMarketplace();
            }}
          />
          <Button 
            onClick={searchMarketplace} 
            disabled={isSearching || !searchQuery.trim()}
            className="bg-jarvis hover:bg-jarvis/90"
          >
            {isSearching ? '...' : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="bg-black/40 rounded-lg p-3 border border-jarvis/30 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-medium mb-2">Marketplace Items</h3>
          
          <div className="space-y-2">
            {marketItems.map((item, index) => (
              <div 
                key={index} 
                className="text-xs bg-black/60 p-2 rounded border border-jarvis/20 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium flex items-center">
                    <Package className="h-3.5 w-3.5 mr-1.5 text-jarvis" />
                    {item.name}
                  </div>
                  <div className="text-gray-400 mt-0.5 flex items-center">
                    <Star className="h-3 w-3 mr-0.5 text-yellow-500" />
                    {item.rating.toFixed(1)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-jarvis">
                    {item.price} credits
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-6 mt-1 border-jarvis/30 hover:bg-jarvis/20"
                    onClick={() => purchaseItem(item)}
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            ))}
            
            {isSearching && (
              <div className="text-center py-2 text-xs text-gray-400">
                Searching secure markets...
              </div>
            )}
            
            {!isSearching && marketItems.length === 0 && (
              <div className="text-center py-2 text-xs text-gray-400">
                Search for available tools and data
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalIntelligenceMarket;
