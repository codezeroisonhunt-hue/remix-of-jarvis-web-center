
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image, RefreshCcw, SquarePlus, AlertCircle } from "lucide-react";
import { checkImageMatchesPrompt } from "@/services/imagePromptChecker";
import type { GeneratedImage } from "@/services/imageGenerationService";
import type { StabilityGeneratedImage } from "@/services/stabilityAIService";
import { toast } from "@/components/ui/use-toast";

interface GeneratedImageCardProps {
  image: GeneratedImage | StabilityGeneratedImage;
  onRegenerate?: () => void;
  onRefine?: (refinePrompt: string) => void;
}

const GeneratedImageCard: React.FC<GeneratedImageCardProps> = ({ image, onRegenerate, onRefine }) => {
  const [refinePrompt, setRefinePrompt] = useState("");
  const [showControls, setShowControls] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const matchesPrompt = checkImageMatchesPrompt(image as any);

  const handleDownload = () => {
    try {
      // Create a link element
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `jarvis-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Image Downloaded",
        description: "The image has been saved to your device.",
        variant: "default"
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the image. Try again later.",
        variant: "destructive"
      });
    }
  };

  const fallbackImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <Card
      className="w-full max-w-sm bg-black/40 border border-jarvis/40 text-white shadow-xl mx-auto my-3 transition-all animate-scale-in"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <CardContent className="flex flex-col items-center pt-5">
        <div className="relative w-full h-56 overflow-hidden rounded-lg">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-pulse flex space-x-2">
                <div className="h-3 w-3 bg-jarvis rounded-full"></div>
                <div className="h-3 w-3 bg-jarvis rounded-full animation-delay-200"></div>
                <div className="h-3 w-3 bg-jarvis rounded-full animation-delay-400"></div>
              </div>
            </div>
          )}
          <img
            src={hasError ? fallbackImage : image.url}
            alt={image.prompt}
            className={`w-full h-full object-cover rounded-lg border border-jarvis/20 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => {
              console.log("Image loaded successfully:", hasError ? fallbackImage : image.url);
              setIsLoaded(true);
            }}
            onError={(e) => {
              console.error("Failed to load image:", e);
              setHasError(true);
              setIsLoaded(true); // Still mark as loaded to remove spinner
              
              // Try with the fallback image instead
              const imgElement = e.target as HTMLImageElement;
              if (!hasError && imgElement) {
                imgElement.src = fallbackImage;
              }
            }}
          />
          {!matchesPrompt && onRegenerate && isLoaded && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 text-xs flex items-center">
              <AlertCircle className="w-3 h-3 mr-1 text-yellow-400" />
              <span>This might not match your request. <button onClick={onRegenerate} className="text-jarvis underline">Try again?</button></span>
            </div>
          )}
        </div>
        <p className="text-xs text-jarvis/80 italic mt-4 mb-2 px-2 text-center">
          "{image.prompt}"
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <span className="text-[11px] text-jarvis/60">
          AI Generated{image.style ? ` • ${image.style}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-jarvis/20 text-jarvis hover:bg-jarvis/40 border border-jarvis/30 px-2 py-1 text-xs"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          {onRegenerate && (
            <Button
              size="sm"
              variant="ghost"
              className="border border-jarvis/20 hover:bg-jarvis/10 px-2 py-1 text-xs"
              onClick={onRegenerate}
              title="Regenerate image"
            >
              <RefreshCcw className="w-3 h-3" />
            </Button>
          )}
          {onRefine && (
            <form
              className="flex items-center gap-1"
              onSubmit={e => {
                e.preventDefault();
                if (refinePrompt.trim()) {
                  onRefine(refinePrompt.trim());
                  setRefinePrompt('');
                }
              }}
            >
              <input
                className="bg-black/60 border border-jarvis/30 rounded px-2 py-1 text-xs text-white w-24"
                placeholder="Refine..."
                value={refinePrompt}
                onChange={e => setRefinePrompt(e.target.value)}
                title="Describe enhancement"
              />
              <Button size="sm" variant="ghost" className="p-1 rounded" type="submit" title="Refine image">
                <SquarePlus className="w-3 h-3" />
              </Button>
            </form>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeneratedImageCard;
