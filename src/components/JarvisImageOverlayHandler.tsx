
import React from "react";
import ImageOverlay from "./chat/ImageOverlay";
import { useJarvisChat } from "../contexts/JarvisChatProvider";

const JarvisImageOverlayHandler: React.FC = () => {
  const { activeImage, setActiveImage, handleRefineImage } = useJarvisChat();

  if (!activeImage) return null;

  const handleRefinementSubmit = async (refinement: string) => {
    try {
      if (activeImage) {
        await handleRefineImage(refinement);
      }
    } catch (error) {
      console.error("Error refining image:", error);
    }
  };

  const handleRegenerate = async () => {
    try {
      if (activeImage) {
        await handleRefineImage("same but better quality");
      }
    } catch (error) {
      console.error("Error regenerating image:", error);
    }
  };

  return (
    <ImageOverlay
      image={activeImage as any}
      onClose={() => setActiveImage(null)}
      onRefine={handleRefinementSubmit}
      onRegenerate={handleRegenerate}
    />
  );
};

export default JarvisImageOverlayHandler;
