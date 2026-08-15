
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Image, Loader2, Sparkles, Palette, Layers, RefreshCcw } from 'lucide-react';
import { GeneratedImage, ImageGenerationParams, generateImage } from '@/services/imageGenerationService';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/components/ui/use-toast';

interface ImageGenerationWidgetProps {
  initialPrompt?: string;
  onGenerate?: (image: GeneratedImage) => void;
  onClose?: () => void;
  showControls?: boolean;
}

const ImageGenerationWidget: React.FC<ImageGenerationWidgetProps> = ({
  initialPrompt = '',
  onGenerate,
  onClose,
  showControls = true
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState<'realistic' | 'anime' | '3d' | 'abstract' | 'painting' | 'pixel' | 'sci-fi' | 'fantasy'>('realistic');
  const [resolution, setResolution] = useState<'512x512' | '768x768' | '1024x1024'>('512x512');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9'>('1:1');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setImageLoaded(false);
    try {
      const params: ImageGenerationParams = {
        prompt: prompt.trim(),
        style,
        resolution,
        aspectRatio
      };
      
      const image = await generateImage(params);
      setGeneratedImage(image);
      
      if (onGenerate) {
        onGenerate(image);
      }
      
      toast({
        title: "Image Generated",
        description: "Your image has been successfully created!",
      });
    } catch (error) {
      console.error('Error in image generation:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!generatedImage) return;
    setIsGenerating(true);
    setImageLoaded(false);
    
    try {
      const params: ImageGenerationParams = {
        prompt: generatedImage.prompt,
        style: generatedImage.style as any,
        resolution: generatedImage.resolution as any,
        aspectRatio
      };
      
      const image = await generateImage(params);
      setGeneratedImage(image);
      
      if (onGenerate) {
        onGenerate(image);
      }
      
      toast({
        title: "Image Regenerated",
        description: "A new variation has been created!",
      });
    } catch (error) {
      console.error('Error regenerating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `jarvis-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Image Downloaded",
      description: "Your image has been saved.",
    });
  };

  const styleOptions = [
    { value: 'realistic', label: 'Realistic Photo' },
    { value: 'anime', label: 'Anime/Cartoon' },
    { value: '3d', label: '3D Render' },
    { value: 'abstract', label: 'Abstract Art' },
    { value: 'painting', label: 'Oil Painting' },
    { value: 'pixel', label: 'Pixel Art' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'fantasy', label: 'Fantasy' }
  ];
  
  const resolutionOptions = [
    { value: '512x512', label: 'Standard (512×512)' },
    { value: '768x768', label: 'HD (768×768)' },
    { value: '1024x1024', label: 'Ultra HD (1024×1024)' }
  ];

  return (
    <Card className="w-full bg-black/30 border border-jarvis/30 text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-jarvis">
          <Image className="w-5 h-5 mr-2 text-jarvis" />
          JARVIS Image Generation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {generatedImage ? (
          <div className="flex flex-col items-center">
            <div className="relative w-full overflow-hidden rounded-md mb-4">
              <AspectRatio ratio={aspectRatio === "16:9" ? 16/9 : aspectRatio === "4:3" ? 4/3 : 1}>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-3 w-3 bg-jarvis rounded-full"></div>
                      <div className="h-3 w-3 bg-jarvis rounded-full animation-delay-200"></div>
                      <div className="h-3 w-3 bg-jarvis rounded-full animation-delay-400"></div>
                    </div>
                  </div>
                )}
                <img 
                  src={generatedImage.url} 
                  alt={generatedImage.prompt}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true);
                    toast({
                      title: "Image Error",
                      description: "Failed to load the generated image.",
                      variant: "destructive"
                    });
                  }}
                />
              </AspectRatio>
            </div>
            <p className="text-sm text-gray-300 italic mb-4">"{generatedImage.prompt}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the image you want to generate in detail... (e.g. 'A cat wearing sunglasses, skateboarding through a neon-lit city at night')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/50 border-jarvis/30 text-white h-24"
            />
            
            {showControls && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-jarvis font-medium">Image Style</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="text-xs border-jarvis/30 text-jarvis hover:bg-jarvis/10"
                  >
                    <Palette className="w-3 h-3 mr-1" />
                    {showAdvancedOptions ? 'Hide Options' : 'Advanced Options'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {styleOptions.map(styleOption => (
                    <Button
                      key={styleOption.value}
                      variant={style === styleOption.value ? "default" : "outline"}
                      className={`text-xs h-auto py-1 ${
                        style === styleOption.value 
                          ? "bg-jarvis/20 text-jarvis border border-jarvis/40" 
                          : "bg-black/40 text-gray-300 border border-jarvis/20 hover:bg-jarvis/10"
                      }`}
                      onClick={() => setStyle(styleOption.value as any)}
                    >
                      {styleOption.label}
                    </Button>
                  ))}
                </div>
                
                {showAdvancedOptions && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <div className="text-sm text-jarvis/70 mb-2">Resolution</div>
                      <div className="grid grid-cols-3 gap-2">
                        {resolutionOptions.map(res => (
                          <Button
                            key={res.value}
                            variant={resolution === res.value ? "default" : "outline"}
                            className={`text-xs h-auto py-1 ${
                              resolution === res.value 
                                ? "bg-jarvis/20 text-jarvis border border-jarvis/40" 
                                : "bg-black/40 text-gray-300 border border-jarvis/20 hover:bg-jarvis/10"
                            }`}
                            onClick={() => setResolution(res.value as any)}
                          >
                            {res.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-jarvis/70 mb-2">Aspect Ratio</div>
                      <RadioGroup 
                        value={aspectRatio} 
                        onValueChange={(value) => setAspectRatio(value as any)}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1:1" id="ratio-1-1" className="text-jarvis" />
                          <label htmlFor="ratio-1-1" className="text-sm">Square (1:1)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="4:3" id="ratio-4-3" className="text-jarvis" />
                          <label htmlFor="ratio-4-3" className="text-sm">Standard (4:3)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="16:9" id="ratio-16-9" className="text-jarvis" />
                          <label htmlFor="ratio-16-9" className="text-sm">Widescreen (16:9)</label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="text-xs text-gray-400 italic">
                      <p>Pro tips:</p>
                      <ul className="list-disc list-inside ml-2">
                        <li>Add details about lighting, atmosphere, and perspective</li>
                        <li>Specify artistic style (watercolor, cyberpunk, fantasy, etc.)</li>
                        <li>Mention camera details for realistic images (e.g., "shot with a DSLR")</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {generatedImage ? (
          <>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-jarvis/30 text-jarvis hover:bg-jarvis/10"
                onClick={() => setGeneratedImage(null)}
              >
                Create New
              </Button>
              <Button
                variant="outline"
                className="border-jarvis/30 text-jarvis hover:bg-jarvis/10"
                onClick={handleRegenerateImage}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCcw className="w-4 h-4 mr-2" />
                )}
                Regenerate
              </Button>
            </div>
            <Button 
              className="bg-jarvis/20 text-jarvis hover:bg-jarvis/30 border border-jarvis/30"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </>
        ) : (
          <Button 
            className="w-full bg-jarvis/20 text-jarvis hover:bg-jarvis/30 border border-jarvis/30 flex items-center gap-2"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Creative Image
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImageGenerationWidget;
