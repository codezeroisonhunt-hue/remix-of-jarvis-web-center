
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, BookOpen, Brain, Compass, Send, Trash2, History, Users } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { 
  philosophicalAIService, 
  PhilosophicalQuestion,
  PhilosophicalResponse,
  PhilosophicalAnalysis
} from '@/services/philosophicalAIService';

interface PhilosophicalAIProps {
  className?: string;
}

const PhilosophicalAI: React.FC<PhilosophicalAIProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('question');
  const [question, setQuestion] = useState('');
  const [situation, setSituation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<PhilosophicalResponse | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<PhilosophicalAnalysis | null>(null);
  const [history, setHistory] = useState<{
    questions: PhilosophicalQuestion[];
    responses: PhilosophicalResponse[];
  }>({ questions: [], responses: [] });

  // Load history when component mounts
  useEffect(() => {
    const historyData = philosophicalAIService.getHistory();
    setHistory(historyData);
  }, []);
  
  // Handle philosophical question submission
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setCurrentResponse(null);
    
    try {
      const response = await philosophicalAIService.analyzeQuestion(question);
      setCurrentResponse(response);
      
      // Update history
      setHistory(philosophicalAIService.getHistory());
    } catch (error) {
      console.error('Error submitting question:', error);
      toast('Analysis Failed', {
        description: 'Failed to analyze your philosophical question.',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle life guidance request
  const handleGuidanceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!situation.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setCurrentAnalysis(null);
    
    try {
      const analysis = await philosophicalAIService.getLifeGuidance(situation);
      setCurrentAnalysis(analysis);
    } catch (error) {
      console.error('Error getting life guidance:', error);
      toast('Guidance Failed', {
        description: 'Failed to generate philosophical guidance.',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Clear history
  const handleClearHistory = () => {
    philosophicalAIService.clearHistory();
    setHistory({ questions: [], responses: [] });
    setCurrentResponse(null);
    setCurrentAnalysis(null);
  };
  
  // Get a response by its ID
  const getResponseById = (questionId: string): PhilosophicalResponse | undefined => {
    return history.responses.find(response => response.questionId === questionId);
  };
  
  return (
    <Card className={`${className || ''} border-jarvis/30 bg-black/20 overflow-hidden`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Brain className="mr-2 h-4 w-4" /> Philosophical AI
        </CardTitle>
        <CardDescription>
          Existential guidance through philosophy, psychology, and ethics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="question" className="flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Philosophy</span>
            </TabsTrigger>
            <TabsTrigger value="guidance" className="flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Life Guidance</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Philosophical Questions Tab */}
          <TabsContent value="question" className="space-y-4">
            <form onSubmit={handleQuestionSubmit} className="space-y-3">
              <div>
                <Input
                  placeholder="Ask a philosophical or ethical question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isProcessing}
                  className="bg-black/30 border-jarvis/30"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-jarvis hover:bg-jarvis/90" 
                disabled={isProcessing || !question.trim()}
              >
                {isProcessing ? 'Analyzing...' : 'Analyze Philosophically'}
                {!isProcessing && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            
            {/* Response Display */}
            {currentResponse && (
              <div className="mt-4 bg-black/30 rounded-lg p-4 border border-jarvis/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-jarvis">Philosophical Analysis</h4>
                  <div className="flex gap-1">
                    {currentResponse.philosophies.map((philosophy, idx) => (
                      <Badge key={idx} variant="outline" className="bg-jarvis/10 text-[10px]">
                        {philosophy}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-3">{currentResponse.content}</p>
                <div className="text-xs text-gray-400 italic mt-2">
                  Alternative perspectives:
                  <ul className="mt-1 space-y-1">
                    {currentResponse.alternatives.map((alt, idx) => (
                      <li key={idx}>{alt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {!currentResponse && !isProcessing && (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                <p>Ask a philosophical question to receive guidance from multiple perspectives</p>
                <p className="text-xs mt-2">Examples: "How do I find purpose?" or "What makes a good life?"</p>
              </div>
            )}
          </TabsContent>
          
          {/* Life Guidance Tab */}
          <TabsContent value="guidance" className="space-y-4">
            <form onSubmit={handleGuidanceRequest} className="space-y-3">
              <div>
                <Textarea 
                  placeholder="Describe a life situation or decision you're facing..."
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  disabled={isProcessing}
                  className="bg-black/30 border-jarvis/30 min-h-[100px]"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-jarvis hover:bg-jarvis/90" 
                disabled={isProcessing || !situation.trim()}
              >
                {isProcessing ? 'Analyzing...' : 'Request Guidance'}
                {!isProcessing && <Compass className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            
            {/* Analysis Display */}
            {currentAnalysis && (
              <div className="mt-4 bg-black/30 rounded-lg border border-jarvis/20">
                <div className="p-4 border-b border-jarvis/20">
                  <h4 className="text-sm font-medium text-jarvis mb-2">Multi-perspective Analysis</h4>
                  <p className="text-sm text-gray-300">"{currentAnalysis.question}"</p>
                </div>
                
                <div className="p-4 border-b border-jarvis/20">
                  <h5 className="text-xs uppercase text-gray-400 mb-2">Ethical Frameworks</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-jarvis font-medium">Utilitarian Perspective</p>
                      <p className="text-gray-300">{currentAnalysis.analysis.ethicalFrameworks.utilitarian}</p>
                    </div>
                    <div>
                      <p className="text-jarvis font-medium">Deontological Perspective</p>
                      <p className="text-gray-300">{currentAnalysis.analysis.ethicalFrameworks.deontological}</p>
                    </div>
                    <div>
                      <p className="text-jarvis font-medium">Virtue Ethics</p>
                      <p className="text-gray-300">{currentAnalysis.analysis.ethicalFrameworks.virtueEthics}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-b border-jarvis/20">
                  <h5 className="text-xs uppercase text-gray-400 mb-2">Psychological Perspectives</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-jarvis font-medium">Existential Psychology</p>
                      <p className="text-gray-300">{currentAnalysis.analysis.psychologicalPerspectives.existential}</p>
                    </div>
                    <div>
                      <p className="text-jarvis font-medium">Humanistic Psychology</p>
                      <p className="text-gray-300">{currentAnalysis.analysis.psychologicalPerspectives.humanistic}</p>
                    </div>
                    <div>
                      <p className="text-jarvis font-medium">Cognitive Approach</p>
                      <p className="text-gray-300">{currentAnalysis.analysis.psychologicalPerspectives.cognitive}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h5 className="text-xs uppercase text-gray-400 mb-2">Recommendations</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    {currentAnalysis.analysis.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {!currentAnalysis && !isProcessing && (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <Users className="h-12 w-12 mb-4 opacity-20" />
                <p>Describe a life situation for guidance through ethical and psychological lenses</p>
                <p className="text-xs mt-2">Example: "Should I change careers for higher pay but less fulfillment?"</p>
              </div>
            )}
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Conversation History</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearHistory}
                className="text-jarvis/70 hover:text-jarvis hover:bg-jarvis/10"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
            
            <ScrollArea className="h-[300px] rounded-md border border-jarvis/30 bg-black/30">
              {history.questions.length > 0 ? (
                <div className="p-4 space-y-4">
                  {history.questions.map((q) => {
                    const response = getResponseById(q.id);
                    return (
                      <div key={q.id} className="border-b border-jarvis/20 pb-3 mb-3 last:border-b-0">
                        <div className="font-medium text-sm text-jarvis mb-1">{q.question}</div>
                        {response && (
                          <div className="text-xs text-gray-300">
                            <p>{response.content.substring(0, 150)}...</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {response.philosophies.map((philosophy, idx) => (
                                <Badge key={idx} variant="outline" className="bg-jarvis/10 text-[10px]">
                                  {philosophy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="text-[10px] text-gray-500 mt-1">
                          {new Date(q.timestamp).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4 text-center text-gray-400">
                  <p>No conversation history yet</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-center text-gray-400 border-t border-jarvis/20 pt-2">
        Philosophical analysis uses multiple frameworks to provide balanced perspectives
      </CardFooter>
    </Card>
  );
};

export default PhilosophicalAI;
