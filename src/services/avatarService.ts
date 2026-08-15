import { toast } from '@/components/ui/sonner';

export type AvatarExpression = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'thinking' | 'suspicious';
export type AvatarVoiceEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'whisper' | 'excited';

export interface AvatarConfig {
  name?: string;
  voiceId?: string;
  model?: string;
  appearance?: 'default' | 'tech' | 'minimal' | 'hacker' | 'ghost';
  expressionIntensity?: number; // 0-1
}

export interface AvatarState {
  isActive: boolean;
  isSpeaking: boolean;
  currentExpression: AvatarExpression;
  lastActivity: Date;
}

export interface SpeechOptions {
  emotion?: AvatarVoiceEmotion;
  rate?: number; // 0.5-2.0
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class AvatarService {
  private config: AvatarConfig = {
    name: 'JARVIS',
    voiceId: 'Roger', // Default ElevenLabs voice
    model: 'eleven_turbo_v2',
    appearance: 'tech',
    expressionIntensity: 0.7,
  };
  
  private state: AvatarState = {
    isActive: false,
    isSpeaking: false,
    currentExpression: 'neutral',
    lastActivity: new Date(),
  };
  
  private audioElement: HTMLAudioElement | null = null;
  private apiKey: string | null = null;
  
  constructor() {
    console.log('Avatar Service initialized');
    this.initAudio();
  }
  
  private initAudio(): void {
    this.audioElement = new Audio();
    
    this.audioElement.addEventListener('play', () => {
      this.state.isSpeaking = true;
    });
    
    this.audioElement.addEventListener('ended', () => {
      this.state.isSpeaking = false;
      this.setExpression('neutral');
    });
    
    this.audioElement.addEventListener('pause', () => {
      this.state.isSpeaking = false;
    });
    
    this.audioElement.addEventListener('error', (error) => {
      this.state.isSpeaking = false;
      console.error('Audio playback error:', error);
      toast("Voice Error", {
        description: "Failed to play audio response.",
      });
    });
  }
  
  public setApiKey(key: string): void {
    this.apiKey = key;
    console.log('API key set for Avatar Service');
  }
  
  public activate(): void {
    this.state.isActive = true;
    this.state.lastActivity = new Date();
    console.log('Avatar activated');
  }
  
  public deactivate(): void {
    this.state.isActive = false;
    this.stopSpeaking();
    console.log('Avatar deactivated');
  }
  
  public configure(config: Partial<AvatarConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Avatar configured:', this.config);
  }
  
  public getConfig(): AvatarConfig {
    return { ...this.config };
  }
  
  public getState(): AvatarState {
    return { ...this.state };
  }
  
  public async speak(text: string, options?: SpeechOptions): Promise<boolean> {
    if (!this.state.isActive) {
      console.warn('Cannot speak: Avatar is not active');
      return false;
    }
    
    if (this.state.isSpeaking) {
      this.stopSpeaking();
    }
    
    // Set expression based on emotion
    if (options?.emotion) {
      const expressionMap: Record<AvatarVoiceEmotion, AvatarExpression> = {
        'neutral': 'neutral',
        'happy': 'happy',
        'sad': 'sad',
        'angry': 'angry',
        'whisper': 'suspicious',
        'excited': 'surprised'
      };
      
      this.setExpression(expressionMap[options.emotion]);
    }
    
    // For demo without actual API key, use browser's speech synthesis
    if (!this.apiKey) {
      return this.useFallbackSpeech(text, options);
    }
    
    try {
      if (options?.onStart) {
        options.onStart();
      }
      
      const voiceId = options?.voiceId || this.config.voiceId || 'Roger';
      const model = this.config.model || 'eleven_turbo_v2';
      
      console.log(`Generating speech with ElevenLabs: voice=${voiceId}, model=${model}`);
      
      // In a real implementation, this would call the ElevenLabs API
      // For now, let's simulate the API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This would be the URL to the generated audio in a real implementation
      const audioUrl = `https://example.com/audio/${Date.now()}.mp3`;
      
      // For demo, we'll use browser's speech synthesis instead
      return this.useFallbackSpeech(text, options);
      
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      
      if (options?.onError) {
        options.onError(error);
      }
      
      toast("Speech Generation Error", {
        description: "Failed to generate speech with ElevenLabs API.",
      });
      
      // Fall back to browser's speech synthesis
      return this.useFallbackSpeech(text, options);
    }
  }
  
  private async useFallbackSpeech(text: string, options?: SpeechOptions): Promise<boolean> {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      
      if (options?.onError) {
        options.onError('Speech synthesis not supported');
      }
      
      toast("Speech Error", {
        description: "Speech synthesis is not supported in this browser.",
      });
      
      return false;
    }
    
    try {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice options
      if (options?.rate) {
        utterance.rate = Math.max(0.5, Math.min(2.0, options.rate));
      }
      
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a male English voice
        const voice = voices.find(v => 
          v.lang.startsWith('en') && v.name.includes('Male')
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        utterance.voice = voice;
      }
      
      utterance.onstart = () => {
        this.state.isSpeaking = true;
        if (options?.onStart) options.onStart();
      };
      
      utterance.onend = () => {
        this.state.isSpeaking = false;
        this.setExpression('neutral');
        if (options?.onEnd) options.onEnd();
      };
      
      utterance.onerror = (event) => {
        this.state.isSpeaking = false;
        console.error('Speech synthesis error:', event);
        if (options?.onError) options.onError(event);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      this.state.lastActivity = new Date();
      
      return true;
    } catch (error) {
      console.error('Error using speech synthesis:', error);
      
      if (options?.onError) {
        options.onError(error);
      }
      
      toast("Speech Error", {
        description: "Failed to use speech synthesis.",
      });
      
      return false;
    }
  }
  
  public stopSpeaking(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    this.state.isSpeaking = false;
    console.log('Speech stopped');
  }
  
  public setExpression(expression: AvatarExpression): void {
    this.state.currentExpression = expression;
    this.state.lastActivity = new Date();
    console.log(`Avatar expression set to: ${expression}`);
    
    // In a real implementation, this would update the 3D model or animated avatar
    // The avatar component would listen to state changes
  }
  
  public async detectEmotion(text: string): Promise<AvatarExpression> {
    // In a real implementation, this would use sentiment analysis
    // For demo, we'll use a simple heuristic
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('excellent')) {
      return 'happy';
    } else if (lowerText.includes('sad') || lowerText.includes('sorry') || lowerText.includes('unfortunate')) {
      return 'sad';
    } else if (lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('frustrated')) {
      return 'angry';
    } else if (lowerText.includes('wow') || lowerText.includes('amazing') || lowerText.includes('unexpected')) {
      return 'surprised';
    } else if (lowerText.includes('hmm') || lowerText.includes('let me think') || lowerText.includes('analyzing')) {
      return 'thinking';
    } else if (lowerText.includes('suspicious') || lowerText.includes('careful') || lowerText.includes('warning')) {
      return 'suspicious';
    }
    
    return 'neutral';
  }
}

export const avatarService = new AvatarService();

// Example usage:
// avatarService.setApiKey('your-elevenlabs-api-key');
// avatarService.activate();
// avatarService.speak('Hello, I am Jarvis, your AI assistant.');
