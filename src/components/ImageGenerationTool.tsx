
import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Loader, Heart, PenLine, Repeat, Image as ImageIcon, Mic, StopCircle } from 'lucide-react';
import { generateImage, ImageGenerationParams, GeneratedImage } from '@/services/imageGenerationService';
import { generateStabilityImage, StabilityImageParams, StabilityGeneratedImage } from '@/services/stabilityAIService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { useJarvisChat } from '@/contexts/JarvisChatProvider';

interface ImageGenerationToolProps {
  onImageGenerated?: (image: GeneratedImage | StabilityGeneratedImage) => void;
  stabilityApiEnabled?: boolean;
}

const ImageGenerationTool: React.FC<ImageGenerationToolProps> = ({ 
  onImageGenerated,
  stabilityApiEnabled = true 
}) => {
  const [prompt, setPrompt] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | StabilityGeneratedImage | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'1:1' | '16:9' | '4:3' | '3:2'>('1:1');
  const [useEnhancedAccuracy, setUseEnhancedAccuracy] = useState(true);
  const [useStabilityApi, setUseStabilityApi] = useState(stabilityApiEnabled);
  const [imageError, setImageError] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const { isGeneratingImage, generationProgress } = useJarvisChat();

  const styles = [
    { id: 'realistic', label: 'Realistic', icon: '📷', stabilityStyle: 'photographic' },
    { id: 'anime', label: 'Anime', icon: '🎨', stabilityStyle: 'anime' },
    { id: '3d', label: 'Render 3D', icon: '🎮', stabilityStyle: '3d-model' },
    { id: 'abstract', label: 'Abstract', icon: '🎭', stabilityStyle: 'cinematic' },
    { id: 'painting', label: 'Painting', icon: '🖌️', stabilityStyle: 'enhance' },
    { id: 'pixel', label: 'Pixel Art', icon: '👾', stabilityStyle: 'pixel-art' },
    { id: 'sci-fi', label: 'Sci-Fi', icon: '🚀', stabilityStyle: 'cinematic' },
    { id: 'fantasy', label: 'Fantasy', icon: '🧙', stabilityStyle: 'enhance' },
    { id: 'portrait', label: 'Portrait', icon: '👤', stabilityStyle: 'photographic' }
  ];

  const formatOptions = [
    { id: '1:1', label: 'Square', width: 6, height: 6 },
    { id: '16:9', label: 'Widescreen', width: 8, height: 6 },
    { id: '4:3', label: 'Standard', width: 8, height: 6 },
    { id: '3:2', label: 'Portrait', width: 6, height: 8 }
  ];

  useEffect(() => {
    let recognitionInstance: SpeechRecognition | null = null;

    if (isListening) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          // Extract image prompt from voice command
          if (transcript.toLowerCase().includes('jarvis generate') || 
              transcript.toLowerCase().includes('create image') ||
              transcript.toLowerCase().includes('make image')) {
            
            const promptRegex = /(?:jarvis,? generate|create image|make image)(?:\s+of|about)?(?:\s+an?)?(?:\s+image\s+of)?\s+(.+)/i;
            const match = transcript.match(promptRegex);
            
            if (match && match[1]) {
              setPrompt(match[1]);
              setIsListening(false);
              if (recognitionInstance) {
                recognitionInstance.stop();
              }
            }
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice Input Error",
            description: "There was an issue with voice recognition. Please try again or type your prompt.",
            variant: "destructive"
          });
        };

        recognitionInstance.start();
      } catch (error) {
        console.error('Speech recognition not supported:', error);
        setIsListening(false);
        toast({
          title: "Voice Input Not Supported",
          description: "Your browser doesn't support voice recognition. Please type your prompt instead.",
          variant: "destructive"
        });
      }
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [isListening]);

  useEffect(() => {
    // Sync progress with context
    if (isGeneratingImage) {
      setProgressValue(generationProgress);
    }
  }, [isGeneratingImage, generationProgress]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what image you'd like to generate",
        variant: "destructive"
      });
      return;
    }

    // Check for potentially inappropriate content
    const inappropriateTerms = ['nude', 'naked', 'pornographic', 'explicit', 'violence', 'gore', 'illegal'];
    const lowerPrompt = prompt.toLowerCase();
    
    if (inappropriateTerms.some(term => lowerPrompt.includes(term))) {
      toast({
        title: "Inappropriate Content Detected",
        description: "I cannot generate images with inappropriate or explicit content. Please modify your request.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingImage(true);
    setGeneratedImage(null);
    setImageError(false);
    setProgressValue(0);
    
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 500);

    try {
      let image;
      
      if (useStabilityApi) {
        // Use Stability AI for image generation
        const selectedStyleObj = styles.find(s => s.id === selectedStyle);
        
        const stabilityParams: StabilityImageParams = {
          prompt: prompt.trim(),
          style: selectedStyleObj?.stabilityStyle,
        };
        
        // Set dimensions based on selectedFormat
        if (selectedFormat === '1:1') {
          stabilityParams.width = 1024;
          stabilityParams.height = 1024;
        } else if (selectedFormat === '16:9') {
          stabilityParams.width = 1024;
          stabilityParams.height = 576;
        } else if (selectedFormat === '4:3') {
          stabilityParams.width = 1024;
          stabilityParams.height = 768;
        } else if (selectedFormat === '3:2') {
          stabilityParams.width = 1024;
          stabilityParams.height = 768;
        }
        
        image = await generateStabilityImage(stabilityParams);
      } else {
        // Use legacy image generation
        const params: ImageGenerationParams = {
          prompt: prompt.trim(),
          style: selectedStyle as any,
          aspectRatio: selectedFormat,
          enhancedAccuracy: useEnhancedAccuracy,
          subjectAccuracy: 'high'
        };

        image = await generateImage(params);
      }
      
      setGeneratedImage(image);
      
      if (onImageGenerated) {
        onImageGenerated(image);
      }
      
      toast({
        title: "Image Generated",
        description: "Your image has been created successfully!",
        variant: "default"
      });
      
      setProgressValue(100);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setGeneratingImage(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      toast({
        title: "Voice Input Activated",
        description: "Say 'Jarvis, generate an image of...' and your prompt",
        variant: "default"
      });
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = imageError ? 
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : 
      generatedImage.url;
    link.download = `jarvis-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Image Downloaded",
      description: "Your image has been saved to your device.",
      variant: "default"
    });
  };

  const handleRegenerateImage = () => {
    handleGenerate();
  };

  const fallbackImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="flex flex-col gap-4 bg-black/30 border border-jarvis/20 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <Sparkles className="w-5 h-5 mr-2 text-jarvis" />
        <h2 className="text-lg font-semibold text-white">JARVIS Advanced Image Generator</h2>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Textarea
            placeholder="Describe the image you want to generate in detail... (e.g., 'a cyberpunk fish DJ at an underwater rave with neon lights' or 'an image of Narendra Modi speaking at a podium')"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="bg-black/50 text-white border-jarvis/30 placeholder-gray-400 min-h-[80px] pr-10"
          />
          <Button 
            onClick={handleVoiceInput}
            className={`absolute right-2 top-2 p-1 h-auto rounded-full ${
              isListening ? 'bg-jarvis/40 text-white animate-pulse' : 'bg-black/60 text-jarvis/70'
            }`}
            size="icon"
            type="button"
          >
            {isListening ? (
              <StopCircle className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {isListening && (
          <div className="bg-jarvis/10 border border-jarvis/30 p-2 rounded-md text-xs text-jarvis animate-pulse">
            Listening for voice command... Say "Jarvis, generate an image of..."
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Style:</span>
            <div className="flex flex-wrap gap-1">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                  className={`px-2 py-1 text-xs rounded transition ${
                    selectedStyle === style.id 
                      ? 'bg-jarvis/40 text-white border border-jarvis/50' 
                      : 'bg-black/40 text-gray-300 border border-jarvis/20 hover:bg-jarvis/20'
                  }`}
                  title={style.label}
                >
                  <span>{style.icon} {style.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-300">Format:</span>
          <div className="flex gap-1">
            {formatOptions.map(format => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id as any)}
                className={`p-1 rounded transition flex items-center ${
                  selectedFormat === format.id 
                    ? 'bg-jarvis/40 text-white' 
                    : 'bg-black/40 text-gray-300 hover:bg-jarvis/20'
                }`}
                title={format.label}
              >
                <div 
                  className={`flex items-center justify-center border border-current`}
                  style={{ width: `${format.width/2}rem`, height: `${format.height/3}rem` }}
                >
                  <span className="text-xs">{format.id}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input 
              type="checkbox" 
              checked={useEnhancedAccuracy} 
              onChange={(e) => setUseEnhancedAccuracy(e.target.checked)}
              className="rounded border-jarvis/30 text-jarvis bg-black/50"
            />
            <span className="text-jarvis">Enhanced Accuracy</span>
            <span className="text-xs opacity-60">(Better for famous people, landmarks)</span>
          </label>
          
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input 
              type="checkbox" 
              checked={useStabilityApi} 
              onChange={(e) => setUseStabilityApi(e.target.checked)}
              className="rounded border-jarvis/30 text-jarvis bg-black/50"
              disabled={!stabilityApiEnabled}
            />
            <span className={`${stabilityApiEnabled ? 'text-jarvis' : 'text-gray-500'}`}>
              Use Stability AI
              {stabilityApiEnabled ? (
                <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-1 py-0.5 rounded">Enabled</span>
              ) : (
                <span className="ml-1 text-xs bg-gray-500/20 text-gray-400 px-1 py-0.5 rounded">Disabled</span>
              )}
            </span>
          </label>
        </div>
        
        <Button 
          onClick={handleGenerate}
          className="bg-jarvis/30 hover:bg-jarvis/50 text-white border border-jarvis/40"
          disabled={generatingImage || !prompt.trim()}
        >
          {generatingImage ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </div>

      {(generatingImage || generatedImage) && (
        <div className="mt-4">
          <div className={`relative rounded-lg overflow-hidden border border-jarvis/30 ${
            getFormatClass(selectedFormat)
          }`}>
            {generatingImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <div className="animate-pulse mb-3">
                  <Sparkles className="w-12 h-12 text-jarvis animate-spin-slow" />
                </div>
                <div className="text-jarvis text-sm mb-4">Creating your masterpiece...</div>
                <div className="w-48 h-2 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-jarvis/60 transition-all duration-300 rounded-full"
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-jarvis/80">{Math.round(progressValue)}%</div>
              </div>
            ) : generatedImage && (
              <>
                <img 
                  src={imageError ? fallbackImage : generatedImage.url} 
                  alt={generatedImage.prompt}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={() => setImageError(true)}
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-jarvis mr-1 cursor-pointer hover:text-red-400 transition-colors" />
                      <PenLine className="w-4 h-4 text-jarvis mx-1 cursor-pointer hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-black/50 hover:bg-black/80 border-jarvis/30 text-xs px-2 py-1 h-auto"
                        onClick={handleRegenerateImage}
                      >
                        <Repeat className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-black/50 hover:bg-black/80 border-jarvis/30 text-xs px-2 py-1 h-auto"
                        onClick={handleDownload}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                {selectedStyle && (
                  <div className="absolute top-2 right-2 bg-black/70 text-jarvis text-xs px-2 py-1 rounded-full">
                    {styles.find(s => s.id === selectedStyle)?.label || 'Custom'}
                  </div>
                )}
                {useStabilityApi && (
                  <div className="absolute top-2 left-2 bg-black/70 text-jarvis text-xs px-2 py-1 rounded-full flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Stability AI
                  </div>
                )}
              </>
            )}
          </div>
          {generatedImage && (
            <div className="mt-2 text-xs text-gray-400 italic">
              "{generatedImage.prompt}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get CSS class based on selected format
const getFormatClass = (format: string): string => {
  switch (format) {
    case '1:1':
      return 'aspect-square';
    case '16:9':
      return 'aspect-video';
    case '4:3':
      return 'aspect-[4/3]';
    case '3:2':
      return 'aspect-[3/2]';
    default:
      return 'aspect-square';
  }
};

export default ImageGenerationTool;
