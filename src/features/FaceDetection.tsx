
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Scan } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FaceRecognition from '@/components/FaceRecognition';

interface FaceDetectionProps {
  isHackerMode?: boolean;
  onEmotionDetected?: (emotion: string) => void;
}

export const FaceDetection: React.FC<FaceDetectionProps> = ({
  isHackerMode = false,
  onEmotionDetected
}) => {
  const [isActive, setIsActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceData, setFaceData] = useState<any>(null);
  const [expressionAnalysis, setExpressionAnalysis] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [ageEstimate, setAgeEstimate] = useState<number | null>(null);
  const [genderEstimate, setGenderEstimate] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<Array<{
    class: string;
    confidence: number;
  }>>([]);

  // Handle face detection
  const handleFaceDetected = (data: any) => {
    setFaceDetected(true);
    setFaceData(data);
    
    // Extract confidence score
    if (data && data.confidence) {
      setConfidenceScore(data.confidence);
    }
    
    // Simple expression analysis based on detected expressions
    if (data && data.expressions) {
      const expressions = data.expressions;
      const dominant = Object.entries(expressions).reduce(
        (max, [key, value]) => value > max[1] ? [key, value] : max, 
        ['neutral', 0]
      );
      setExpressionAnalysis(dominant[0]);
      
      // Pass the detected emotion to the parent component
      if (onEmotionDetected) {
        onEmotionDetected(dominant[0].charAt(0).toUpperCase() + dominant[0].slice(1));
      }
    }
  };
  
  const handleFaceNotDetected = () => {
    setFaceDetected(false);
    setFaceData(null);
    setExpressionAnalysis(null);
  };
  
  const handleAgeGenderDetected = (data: { age: number | null; gender: string | null }) => {
    setAgeEstimate(data.age);
    setGenderEstimate(data.gender);
  };
  
  const handleObjectsDetected = (objects: Array<{ class: string; confidence: number }>) => {
    setDetectedObjects(objects);
  };
  
  const toggleActive = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Reset states when activating
      setFaceDetected(false);
      setFaceData(null);
      setExpressionAnalysis(null);
      setAgeEstimate(null);
      setGenderEstimate(null);
      setDetectedObjects([]);
    }
  };

  return (
    <Card className={`border-${isHackerMode ? 'red-500/30' : 'jarvis/30'} ${isHackerMode ? 'bg-black/20' : 'bg-black/10'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Scan className="mr-2 h-4 w-4" /> 
          Face Detection
        </CardTitle>
        <CardDescription>Enhanced computer vision capabilities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FaceRecognition
          isActive={isActive}
          toggleActive={toggleActive}
          onFaceDetected={handleFaceDetected}
          onFaceNotDetected={handleFaceNotDetected}
          onEmotionDetected={onEmotionDetected}
          onAgeGenderDetected={handleAgeGenderDetected}
          onObjectsDetected={handleObjectsDetected}
        />
        
        {isActive && (
          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Face Detection Status:</div>
              <Badge className={
                faceDetected 
                  ? `bg-${isHackerMode ? 'red-500' : 'green-500'}/20 text-${isHackerMode ? 'red-400' : 'green-400'}` 
                  : 'bg-gray-500/20 text-gray-400'
              }>
                {faceDetected ? 'Face Detected' : 'Searching...'}
              </Badge>
            </div>
            
            {faceDetected && confidenceScore > 0 && (
              <>
                <div className="grid grid-cols-6 gap-2 items-center">
                  <div className="text-sm col-span-2">Confidence:</div>
                  <div className="w-full bg-black/40 rounded-full h-2.5 col-span-3">
                    <div 
                      className={`h-2.5 rounded-full ${isHackerMode ? 'bg-red-500' : 'bg-jarvis'}`} 
                      style={{ width: `${confidenceScore * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 col-span-1">
                    {Math.round(confidenceScore * 100)}%
                  </div>
                </div>
                
                {expressionAnalysis && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Expression:</div>
                    <Badge className={`bg-${isHackerMode ? 'red' : 'jarvis'}/20`}>
                      {expressionAnalysis.charAt(0).toUpperCase() + expressionAnalysis.slice(1)}
                    </Badge>
                  </div>
                )}
                
                {/* Age estimation */}
                {ageEstimate !== null && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Estimated Age:</div>
                    <Badge className={`bg-${isHackerMode ? 'red' : 'jarvis'}/20`}>
                      ~{ageEstimate} years
                    </Badge>
                  </div>
                )}
                
                {/* Gender estimation (if available) */}
                {genderEstimate && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Gender:</div>
                    <Badge className={`bg-${isHackerMode ? 'red' : 'jarvis'}/20`}>
                      {genderEstimate}
                    </Badge>
                  </div>
                )}
                
                <Alert className={`bg-${isHackerMode ? 'red' : 'jarvis'}/5 border-${isHackerMode ? 'red' : 'jarvis'}/20`}>
                  <AlertDescription>
                    {isHackerMode 
                      ? 'Biometric data captured and stored for future reference.'
                      : 'Facial analysis is performed locally and not stored permanently.'}
                  </AlertDescription>
                </Alert>
              </>
            )}
            
            {/* Object Detection Section */}
            {detectedObjects.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Detected Objects:</div>
                <div className="flex flex-wrap gap-2">
                  {detectedObjects.map((obj, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-green-500/20 text-green-400"
                      variant="outline"
                    >
                      {obj.class} ({Math.round(obj.confidence * 100)}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FaceDetection;
