
import React, { useState } from "react";
import { AlertCircle, Download, Sparkles, Palette } from "lucide-react";
import { checkImageMatchesPrompt } from "@/services/imagePromptChecker";
import { GeneratedImage } from "@/services/imageGenerationService";
import { StabilityGeneratedImage } from "@/services/stabilityAIService";

interface ImageOverlayProps {
  image: GeneratedImage | StabilityGeneratedImage;
  onClose: () => void;
  onRefine: (newPrompt: string) => void;
  onRegenerate: () => void;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ image, onClose, onRefine, onRegenerate }) => {
  const [refinePrompt, setRefinePrompt] = useState('');
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [imageError, setImageError] = useState(false);
  const matchesPrompt = checkImageMatchesPrompt(image as any);
  const isStabilityImage = 'base64' in image;

  const styleOptions = [
    { name: 'photographic', label: 'Photorealistic' },
    { name: 'anime', label: 'Anime' },
    { name: '3d-model', label: '3D Render' },
    { name: 'digital-art', label: 'Digital Art' },
    { name: 'enhance', label: 'Enhanced' },
    { name: 'cinematic', label: 'Cinematic' },
    { name: 'line-art', label: 'Line Art' },
    { name: 'neon-punk', label: 'Neon Punk' }
  ];

  const applyStyle = (style: string) => {
    onRefine(`in ${style} style`);
  };

  const fallbackImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in transition-all">
      <div className="bg-black/90 rounded-xl shadow-2xl border-2 border-jarvis/40 overflow-hidden p-6 w-[90vw] max-w-2xl">
        <div className="flex flex-col items-center">
          <img
            src={imageError ? fallbackImage : image.url}
            alt={image.prompt}
            className="max-h-[60vh] rounded-lg mb-4 shadow-lg animate-scale-in"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              console.error("Image failed to load in overlay:", image.url);
              setImageError(true);
              // Set the fallback source
              const imgElement = e.target as HTMLImageElement;
              if (imgElement) {
                imgElement.src = fallbackImage;
              }
            }}
          />
          <div className="text-center mb-3 text-lg text-jarvis font-bold animate-fade-in">
            "{image.prompt}"
          </div>
          
          {isStabilityImage && (
            <div className="mb-3 flex items-center text-jarvis/80 text-xs bg-jarvis/10 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3 mr-1" /> 
              Generated with Stability AI
            </div>
          )}
          
          {!matchesPrompt && !isStabilityImage && (
            <div className="text-yellow-400 text-sm mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              This might not match your request exactly.
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <button 
              onClick={() => setShowStyleOptions(!showStyleOptions)} 
              className="bg-jarvis/20 px-3 py-1 rounded text-jarvis font-semibold hover:bg-jarvis/40 transition flex items-center"
            >
              <Palette className="w-4 h-4 mr-1" />
              {showStyleOptions ? 'Hide Styles' : 'Style Options'}
            </button>
            
            {showStyleOptions && (
              <div className="w-full flex flex-wrap gap-2 justify-center mt-2 animate-fade-in">
                {styleOptions.map(style => (
                  <button
                    key={style.name}
                    onClick={() => applyStyle(style.name)}
                    className="bg-black/60 border border-jarvis/30 px-2 py-1 rounded text-jarvis/80 text-xs hover:bg-jarvis/20 transition"
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-row gap-2 justify-center flex-wrap">
            <button onClick={onRegenerate} className="bg-jarvis/20 px-4 py-2 rounded text-jarvis font-bold hover:bg-jarvis/30 transition animate-fade-in flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Regenerate
            </button>
            <form
              className="flex gap-2 items-center"
              onSubmit={e => {
                e.preventDefault();
                if (refinePrompt.trim()) {
                  onRefine(refinePrompt.trim());
                }
              }}
            >
              <input
                className="bg-black/60 border border-jarvis/30 rounded px-3 py-1 text-white outline-none"
                type="text"
                value={refinePrompt}
                placeholder="Refine (e.g. add neon lights, cyberpunk style)"
                onChange={e => setRefinePrompt(e.target.value)}
              />
              <button type="submit" className="bg-jarvis/20 px-3 py-1 rounded text-jarvis font-semibold hover:bg-jarvis/40 transition">
                Refine
              </button>
            </form>
            <button onClick={onClose} className="ml-2 px-2 text-gray-200 hover:text-jarvis">
              Close
            </button>
          </div>
          <div className="mt-2 flex justify-center gap-4">
            <a
              href={imageError ? fallbackImage : image.url}
              download={`jarvis-image-${Date.now()}.jpg`}
              className="text-sm text-jarvis underline hover:text-jarvis/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-3 h-3 inline mr-1" />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOverlay;
