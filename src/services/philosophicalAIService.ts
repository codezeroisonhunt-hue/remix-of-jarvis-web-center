
import { toast } from '@/components/ui/sonner';

export interface PhilosophicalQuestion {
  id: string;
  question: string;
  context?: string;
  timestamp: Date;
}

export interface PhilosophicalResponse {
  id: string;
  questionId: string;
  content: string;
  philosophies: string[];
  reasoning: string;
  alternatives: string[];
  timestamp: Date;
}

export interface PhilosophicalAnalysis {
  question: string;
  analysis: {
    ethicalFrameworks: {
      utilitarian: string;
      deontological: string;
      virtueEthics: string;
    };
    psychologicalPerspectives: {
      existential: string;
      humanistic: string;
      cognitive: string;
    };
    recommendations: string[];
  }
}

class PhilosophicalAIService {
  private questions: PhilosophicalQuestion[] = [];
  private responses: PhilosophicalResponse[] = [];
  private philosophies: string[] = [
    'Existentialism', 'Stoicism', 'Utilitarianism', 'Kantian Ethics',
    'Virtue Ethics', 'Buddhist Philosophy', 'Taoism', 'Pragmatism',
    'Empiricism', 'Humanism', 'Nihilism', 'Rationalism'
  ];
  
  private psychologyFrameworks: string[] = [
    'Cognitive Behavioral', 'Humanistic', 'Psychoanalytic',
    'Positive Psychology', 'Existential Psychology', 'Social Psychology',
    'Developmental Psychology', 'Evolutionary Psychology'
  ];

  constructor() {
    console.log('Philosophical AI Service initialized');
    this.loadSampleData();
  }
  
  // Analyze a question philosophically
  public async analyzeQuestion(question: string, context?: string): Promise<PhilosophicalResponse> {
    // Create a new question
    const questionId = `q-${Date.now()}`;
    const newQuestion: PhilosophicalQuestion = {
      id: questionId,
      question,
      context,
      timestamp: new Date()
    };
    
    this.questions.push(newQuestion);
    
    // Simulate AI thinking with a toast
    toast("Philosophical Analysis", {
      description: "Analyzing your question through multiple philosophical frameworks..."
    });
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a response using multiple philosophical frameworks
      const selectedPhilosophies = this.getRandomItems(this.philosophies, 3);
      const response = this.generatePhilosophicalResponse(newQuestion, selectedPhilosophies);
      
      this.responses.push(response);
      return response;
    } catch (error) {
      console.error('Error in philosophical analysis:', error);
      throw new Error('Failed to complete philosophical analysis');
    }
  }
  
  // Get philosophical guidance on a life decision
  public async getLifeGuidance(situation: string): Promise<PhilosophicalAnalysis> {
    toast("Existential Analysis", {
      description: "Analyzing your situation through ethical and psychological frameworks..."
    });
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate a comprehensive analysis with multiple perspectives
      return this.generateComprehensiveAnalysis(situation);
    } catch (error) {
      console.error('Error generating life guidance:', error);
      throw new Error('Failed to generate philosophical guidance');
    }
  }
  
  // Get previous questions and responses
  public getHistory(): {questions: PhilosophicalQuestion[], responses: PhilosophicalResponse[]} {
    return {
      questions: [...this.questions],
      responses: [...this.responses]
    };
  }
  
  // Clear history
  public clearHistory(): void {
    this.questions = [];
    this.responses = [];
    toast("History Cleared", {
      description: "Philosophical conversation history has been cleared."
    });
  }
  
  // Private helper methods
  private generatePhilosophicalResponse(
    question: PhilosophicalQuestion, 
    philosophies: string[]
  ): PhilosophicalResponse {
    const responseId = `r-${Date.now()}`;
    
    // Generate different perspectives based on the philosophies
    const perspectives = philosophies.map(philosophy => {
      switch (philosophy) {
        case 'Existentialism':
          return `From an existentialist perspective, your question about "${question.question}" invites reflection on personal meaning and authenticity. Rather than seeking external validation, consider what choice affirms your authentic self.`;
        case 'Stoicism':
          return `A Stoic would approach your question by focusing on what's within your control and accepting what isn't. Whether the outcome is favorable or not, maintain equanimity and focus on virtuous action.`;
        case 'Utilitarianism':
          return `Under utilitarian ethics, consider which option produces the greatest happiness or well-being for all affected. Quantify the potential positive and negative outcomes for each choice.`;
        default:
          return `${philosophy} suggests examining your values and principles as they relate to this situation. What virtues are being tested here?`;
      }
    });
    
    // Generate alternative perspectives
    const alternatives = this.getRandomItems(this.psychologyFrameworks, 2).map(framework => {
      return `${framework} perspective: Consider how your past experiences and cognitive patterns are influencing this decision.`;
    });
    
    return {
      id: responseId,
      questionId: question.id,
      content: `${perspectives.join(' ')} Remember that philosophical inquiry isn't just about finding answers but developing a deeper understanding of the questions themselves.`,
      philosophies,
      reasoning: `This response integrates multiple philosophical traditions to provide a balanced perspective on your question about ${question.question}.`,
      alternatives,
      timestamp: new Date()
    };
  }
  
  private generateComprehensiveAnalysis(situation: string): PhilosophicalAnalysis {
    return {
      question: situation,
      analysis: {
        ethicalFrameworks: {
          utilitarian: `From a utilitarian perspective, consider which choice maximizes overall happiness and minimizes suffering for all involved. How will each option affect the collective well-being?`,
          deontological: `Kantian ethics would have you ask whether your intended action could be universalized as a rule for everyone. Are you treating others as ends in themselves, not merely as means?`,
          virtueEthics: `Virtue ethics focuses on character development. Which choice best represents the virtues you want to embody? Courage? Honesty? Compassion?`
        },
        psychologicalPerspectives: {
          existential: `Existentially, this choice represents freedom and responsibility. What meaning are you creating through this decision, and how does it reflect your authentic self?`,
          humanistic: `The humanistic approach emphasizes personal growth. Which option best supports your self-actualization and helps you fulfill your potential?`,
          cognitive: `Consider how cognitive biases may be affecting your perception of this situation. Are you catastrophizing negative outcomes or ignoring important information?`
        },
        recommendations: [
          `Take time for reflection before making your decision. Consider journaling about your thoughts.`,
          `Imagine how you might feel about this decision five years from now. Does that change your perspective?`,
          `Consider discussing your situation with someone whose wisdom you trust, but who won't simply tell you what you want to hear.`,
          `Remember that many philosophical traditions emphasize that how you approach a decision is as important as the decision itself.`
        ]
      }
    };
  }
  
  private getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  private loadSampleData(): void {
    const sampleQuestion: PhilosophicalQuestion = {
      id: 'sample-q-1',
      question: 'How do I find purpose in my work?',
      timestamp: new Date(Date.now() - 86400000) // 1 day ago
    };
    
    this.questions.push(sampleQuestion);
    
    const sampleResponse: PhilosophicalResponse = {
      id: 'sample-r-1',
      questionId: 'sample-q-1',
      content: 'Finding purpose in work can be approached through multiple philosophical lenses. Existentialism suggests creating meaning through authentic choices that align with your values. Stoicism would emphasize focusing on what aspects of your work you can control and finding virtue in doing those well, regardless of external recognition. From a utilitarian perspective, consider how your work contributes to the greater good and increases overall well-being.',
      philosophies: ['Existentialism', 'Stoicism', 'Utilitarianism'],
      reasoning: 'This response integrates perspectives from existential meaning-making, stoic focus on virtue and control, and utilitarian consideration of broader impact.',
      alternatives: [
        'Cognitive perspective: Examine how your thoughts about work create your experience of it.',
        'Humanistic perspective: Consider how your work enables or blocks your self-actualization.'
      ],
      timestamp: new Date(Date.now() - 86000000) // A bit less than 1 day ago
    };
    
    this.responses.push(sampleResponse);
  }
}

export const philosophicalAIService = new PhilosophicalAIService();
