
import React, { useMemo } from 'react';
import { OSINTSearchResult } from '@/types/osint';
import { analyzeOSINTData } from '@/services/osintService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Newspaper, Globe, Database, Link, FileSearch, AlertTriangle } from 'lucide-react';

interface OSINTDashboardProps {
  results: OSINTSearchResult[];
}

const OSINTDashboard: React.FC<OSINTDashboardProps> = ({ results }) => {
  // Use useMemo to avoid recalculating analytics data on each render
  const analytics = useMemo(() => {
    return analyzeOSINTData(results);
  }, [results]);
  
  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileSearch className="mx-auto h-12 w-12 text-jarvis/50" />
          <h3 className="mt-2 text-lg font-medium">No data to analyze</h3>
          <p className="mt-1 text-sm text-gray-400">Run a search to generate data for analysis</p>
        </div>
      </div>
    );
  }
  
  // Format data for charts
  const sourceData = Object.entries(analytics.sourceDistribution).map(([name, value]) => ({
    name: formatSourceName(name),
    value
  }));
  
  const timeSeriesData = analytics.timeSeries.map(item => ({
    date: item.date.toLocaleDateString(),
    count: item.count
  }));
  
  const entityData = analytics.topEntities
    .slice(0, 5)
    .map(entity => ({
      name: entity.entity.name,
      mentions: entity.mentionCount,
      type: entity.entity.type,
      sources: entity.sources.size
    }));
  
  const COLORS = ['#1EAEDB', '#33C3F0', '#0FA0CE', '#39CCCC', '#7FDBFF'];

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-black/40 border-jarvis/20">
          <h3 className="text-lg font-semibold mb-3">Source Distribution</h3>
          <div className="h-64">
            <ChartContainer config={{ source: {} }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#1EAEDB"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {sourceData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center text-xs">
                <span 
                  className="inline-block w-3 h-3 mr-2 rounded-sm" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-4 bg-black/40 border-jarvis/20">
          <h3 className="text-lg font-semibold mb-3">Results Timeline</h3>
          <div className="h-64">
            <ChartContainer config={{ data: {} }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#1EAEDB" 
                    strokeWidth={2} 
                    dot={{ fill: '#1EAEDB', strokeWidth: 2 }} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 border-jarvis/20">
          <h3 className="text-lg font-semibold mb-3">Top Entities</h3>
          <div className="h-64">
            <ChartContainer config={{ entity: {} }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={entityData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar 
                    dataKey="mentions" 
                    fill="#1EAEDB" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
        
        <Card className="p-4 bg-black/40 border-jarvis/20">
          <h3 className="text-lg font-semibold mb-3">Entity Network Analysis</h3>
          <ScrollArea className="h-64 pr-3">
            <div className="space-y-4">
              {analytics.topEntities.slice(0, 6).map(entity => (
                <div key={entity.entity.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{entity.entity.name}</span>
                      <Badge 
                        variant="outline" 
                        className="ml-2 text-xs"
                      >
                        {entity.entity.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">
                      {entity.mentionCount} mentions
                    </span>
                  </div>
                  
                  <Progress 
                    value={entity.mentionCount * 10} 
                    max={100} 
                    className="bg-jarvis/10"
                  />
                  
                  {entity.relatedEntities.length > 0 && (
                    <div className="pl-4 border-l-2 border-jarvis/30">
                      <p className="text-xs text-gray-400 mb-1">Related to:</p>
                      <div className="space-y-1">
                        {entity.relatedEntities.map(rel => (
                          <div 
                            key={`${entity.entity.id}-${rel.entity.id}`}
                            className="flex items-center justify-between text-xs bg-black/20 p-1 rounded"
                          >
                            <div className="flex items-center">
                              <Link className="w-3 h-3 mr-1" />
                              <span>{rel.entity.name}</span>
                            </div>
                            <Badge className="text-[10px] bg-jarvis/40">
                              {rel.relationshipType}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
      
      <div className="mt-4">
        <Card className="p-4 bg-black/40 border-jarvis/20">
          <h3 className="text-lg font-semibold mb-3">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Most Prevalent Source</h4>
                <Badge variant="secondary">
                  {sourceData.sort((a, b) => b.value - a.value)[0]?.name || 'None'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Most Mentioned Entity</h4>
                <Badge variant="secondary">
                  {analytics.topEntities[0]?.entity.name || 'None'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Total Data Points</h4>
                <Badge variant="secondary">
                  {results.length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Date Range</h4>
                <span className="text-xs text-gray-400">
                  {results.length > 0 ? (
                    `${new Date(Math.min(...results.map(r => r.timestamp.getTime()))).toLocaleDateString()} - 
                    ${new Date(Math.max(...results.map(r => r.timestamp.getTime()))).toLocaleDateString()}`
                  ) : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Entity Types Distribution</h4>
              <div className="space-y-1">
                {calculateEntityTypeDistribution(analytics.topEntities).map(type => (
                  <div key={type.name} className="flex items-center text-xs">
                    <Badge variant="outline" className="w-24 mr-2">{type.name}</Badge>
                    <Progress 
                      value={type.percentage} 
                      max={100} 
                      className="flex-1 bg-jarvis/10 h-2"
                    />
                    <span className="ml-2 text-xs text-gray-400">{type.percentage.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
function formatSourceName(source: string): string {
  switch (source) {
    case 'social': return 'Social Media';
    case 'news': return 'News';
    case 'public_records': return 'Public Records';
    case 'web': return 'Web';
    case 'leaked_data': return 'Leaked Data';
    default: return source;
  }
}

function calculateEntityTypeDistribution(entities: any[]): Array<{name: string, percentage: number}> {
  const types = new Map<string, number>();
  const total = entities.length;
  
  if (total === 0) return [];
  
  entities.forEach(entity => {
    const type = entity.entity.type;
    types.set(type, (types.get(type) || 0) + 1);
  });
  
  return Array.from(types.entries()).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    percentage: (count / total) * 100
  })).sort((a, b) => b.percentage - a.percentage);
}

export default OSINTDashboard;
