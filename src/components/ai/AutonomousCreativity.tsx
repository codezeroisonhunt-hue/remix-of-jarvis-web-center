
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SparklesIcon, Code, Palette, BookOpen, Film } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { enhancedAIService } from '@/services/enhancedAIService';

const AutonomousCreativity: React.FC = () => {
  const [entityState, setEntityState] = useState(enhancedAIService.getEntityState('creativity'));
  const [creativePrompt, setCreativePrompt] = useState('');
  const [contentType, setContentType] = useState<string>('story');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  
  useEffect(() => {
    // Update entity state when component mounts
    setEntityState(enhancedAIService.getEntityState('creativity'));
    
    // Simulate entity state updates
    const interval = setInterval(() => {
      setEntityState(enhancedAIService.getEntityState('creativity'));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const generateContent = async () => {
    if (!creativePrompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedContent(null);
    
    try {
      const result = await enhancedAIService.generateCreativeContent(contentType, creativePrompt);
      
      setGeneratedContent(result.content);
      
      toast(`Content Generated`, {
        description: `Created ${contentType} with ${result.emotionalTone} emotional tone`
      });
      
    } catch (error) {
      toast(`Generation Failed`, {
        description: `Unable to generate content at this time`
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!entityState || !entityState.active) {
    return null;
  }
  
  return (
    <Card className="border-jarvis/30 bg-black/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <SparklesIcon className="mr-2 h-4 w-4" /> Autonomous Creativity
        </CardTitle>
        <CardDescription>
          AI-powered creative output generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <Button 
            variant={contentType === 'story' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setContentType('story')}
            className={contentType === 'story' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Story
          </Button>
          
          <Button 
            variant={contentType === 'code' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setContentType('code')}
            className={contentType === 'code' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
          >
            <Code className="h-3.5 w-3.5 mr-1.5" /> Code
          </Button>
          
          <Button 
            variant={contentType === 'design' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setContentType('design')}
            className={contentType === 'design' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
          >
            <Palette className="h-3.5 w-3.5 mr-1.5" /> Design
          </Button>
          
          <Button 
            variant={contentType === 'script' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setContentType('script')}
            className={contentType === 'script' ? 'bg-jarvis hover:bg-jarvis/90' : 'border-jarvis/30 hover:bg-jarvis/20'}
          >
            <Film className="h-3.5 w-3.5 mr-1.5" /> Script
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder={`Enter a prompt for ${contentType}...`}
            value={creativePrompt}
            onChange={(e) => setCreativePrompt(e.target.value)}
            className="bg-black/40 border-jarvis/30 text-white"
          />
          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !creativePrompt.trim()}
            className="bg-jarvis hover:bg-jarvis/90 whitespace-nowrap"
          >
            {isGenerating ? 'Creating...' : 'Generate'}
          </Button>
        </div>
        
        {generatedContent && (
          <div className="bg-black/40 rounded-lg p-3 border border-jarvis/30 max-h-48 overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Generated {contentType}</h3>
            <div className="text-xs whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutonomousCreativity;
