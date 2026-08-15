
import React, { useRef, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { analyzeEmotions, analyzeFaceAttributes, detectObjects, initializeModels, EmotionData } from '@/services/emotionalIntelligenceService';

interface FaceRecognitionProps {
  onFaceDetected?: (faceData: any) => void;
  onFaceNotDetected?: () => void;
  onEmotionDetected?: (emotion: string) => void;
  onAgeGenderDetected?: (data: { age: number | null; gender: string | null }) => void;
  onObjectsDetected?: (objects: Array<{ class: string; confidence: number }>) => void;
  onError?: (error: string) => void;
  isActive: boolean;
  toggleActive: () => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({
  onFaceDetected,
  onFaceNotDetected,
  onEmotionDetected,
  onAgeGenderDetected,
  onObjectsDetected,
  onError,
  isActive,
  toggleActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<string>('neutral');
  const [detectedAge, setDetectedAge] = useState<number | null>(null);
  const [detectedGender, setDetectedGender] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<Array<{
    class: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceConfidenceThreshold] = useState(0.7); // Minimum confidence for face detection
  
  // Initialize face recognition and object detection
  useEffect(() => {
    if (!isActive) return;
    
    const initModels = async () => {
      try {
        toast({
          title: "AI Models",
          description: "Loading face detection and object recognition models...",
        });
        
        const success = await initializeModels();
        if (success) {
          setIsInitialized(true);
          setModelsLoaded(true);
          setCameraPermission('granted');
          toast({
            title: "AI Models",
            description: "Face detection and object recognition ready",
          });
        } else {
          throw new Error("Failed to initialize models");
        }
      } catch (error) {
        console.error('Error initializing models:', error);
        onError?.('Failed to initialize face and object detection models');
        toast({
          title: "Error",
          description: "Failed to initialize AI models",
          variant: "destructive"
        });
      }
    };
    
    initModels();
  }, [isActive, onError]);
  
  // Start webcam when active
  useEffect(() => {
    if (!isActive || !isInitialized) return;
    
    let stream: MediaStream | null = null;
    
    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: 640,
            height: 480,
            facingMode: "user"
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraPermission('granted');
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        setCameraPermission('denied');
        onError?.('Failed to access webcam');
        toast({
          title: "Camera Error",
          description: "Failed to access your camera. Please check permissions.",
          variant: "destructive"
        });
      }
    };
    
    startWebcam();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, isInitialized, onError]);
  
  // Run face detection and object detection when webcam is active
  useEffect(() => {
    if (!isActive || !isInitialized || cameraPermission !== 'granted') return;
    
    if (detectionInterval) {
      clearInterval(detectionInterval);
    }
    
    const runDetection = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const context = canvasRef.current.getContext('2d');
      if (!context) return;
      
      try {
        // Clear previous drawings
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // In a real implementation, we'd pass the video frame to face-api.js and YOLO/TensorFlow
        // For simulation purposes, we'll generate mock results
        
        // Simulate face detection (70% chance to detect a face)
        const faceDetectionResult = Math.random() > 0.3;
        
        if (faceDetectionResult) {
          // Face detected simulation
          const mockFaceData = {
            confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
            expressions: {
              happy: Math.random(),
              sad: Math.random(),
              angry: Math.random(),
              surprised: Math.random(),
              neutral: Math.random()
            },
            landmarks: {},
          };
          
          // Only consider as detected if confidence is above threshold
          if (mockFaceData.confidence >= faceConfidenceThreshold) {
            if (!faceDetected) {
              setFaceDetected(true);
              onFaceDetected?.(mockFaceData);
            }
            
            // Analyze emotion
            const emotionData = analyzeEmotions(mockFaceData);
            // Extract the dominant emotion string from emotionData
            setDetectedEmotion(emotionData.dominant);
            if (onEmotionDetected) {
              // Properly format the first letter to uppercase
              const emotionStr = emotionData.dominant.charAt(0).toUpperCase() + emotionData.dominant.slice(1);
              onEmotionDetected(emotionStr);
            }
            
            // Analyze age and gender
            const attributes = await analyzeFaceAttributes(mockFaceData);
            setDetectedAge(attributes.age);
            setDetectedGender(attributes.gender);
            onAgeGenderDetected?.({ age: attributes.age, gender: attributes.gender });
            
            // Draw face box
            context.strokeStyle = '#33c3f0';
            context.lineWidth = 3;
            
            // Draw simulated face box
            const centerX = canvasRef.current.width / 2;
            const centerY = canvasRef.current.height / 2;
            const boxWidth = 150;
            const boxHeight = 200;
            
            context.strokeRect(
              centerX - boxWidth/2,
              centerY - boxHeight/2,
              boxWidth,
              boxHeight
            );
            
            // Add face detection markers
            context.fillStyle = '#33c3f0';
            context.beginPath();
            context.arc(centerX - 30, centerY - 30, 3, 0, 2 * Math.PI);
            context.fill();
            
            context.beginPath();
            context.arc(centerX + 30, centerY - 30, 3, 0, 2 * Math.PI);
            context.fill();
            
            context.beginPath();
            context.arc(centerX, centerY + 30, 3, 0, 2 * Math.PI);
            context.fill();
            
            // Add emotion, age, gender text above the face box
            context.fillStyle = '#33c3f0';
            context.font = '12px Arial';
            context.textAlign = 'center';
            
            const emotionText = `${detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1)}`;
            let attributesText = '';
            
            if (detectedAge !== null) {
              attributesText += `Age: ~${detectedAge}`;
            }
            
            if (detectedGender !== null) {
              attributesText += attributesText ? ` • ${detectedGender}` : `${detectedGender}`;
            }
            
            context.fillText(
              emotionText, 
              centerX, 
              centerY - boxHeight/2 - 20
            );
            
            if (attributesText) {
              context.fillText(
                attributesText,
                centerX,
                centerY - boxHeight/2 - 5
              );
            }
          } else if (faceDetected) {
            setFaceDetected(false);
            onFaceNotDetected?.();
          }
        } else if (faceDetected) {
          setFaceDetected(false);
          onFaceNotDetected?.();
        }
        
        // Run object detection (separate from face detection)
        if (videoRef.current) {
          const objects = await detectObjects(videoRef.current);
          setDetectedObjects(objects);
          
          // Pass detected objects to parent component (filtered to just class and confidence)
          onObjectsDetected?.(objects.map(obj => ({ 
            class: obj.class, 
            confidence: obj.confidence 
          })));
          
          // Draw object bounding boxes
          objects.forEach(obj => {
            const [x, y, width, height] = obj.bbox;
            
            const boxX = x * canvasRef.current!.width;
            const boxY = y * canvasRef.current!.height;
            const boxWidth = width * canvasRef.current!.width;
            const boxHeight = height * canvasRef.current!.height;
            
            context.strokeStyle = '#4ade80'; // Green for objects
            context.lineWidth = 2;
            context.strokeRect(boxX, boxY, boxWidth, boxHeight);
            
            // Add object label
            context.fillStyle = '#4ade80';
            context.font = '12px Arial';
            context.textAlign = 'left';
            context.fillText(
              `${obj.class} (${Math.round(obj.confidence * 100)}%)`,
              boxX,
              boxY - 5
            );
          });
        }
      } catch (error) {
        console.error('Error in detection process:', error);
      }
    }, 1000); // Run detection every second
    
    setDetectionInterval(runDetection);
    
    // Cleanup function
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [
    isActive, 
    isInitialized, 
    cameraPermission, 
    faceDetected, 
    onFaceDetected, 
    onFaceNotDetected, 
    onEmotionDetected,
    onAgeGenderDetected,
    onObjectsDetected,
    detectedEmotion,
    detectedAge,
    detectedGender,
    faceConfidenceThreshold
  ]);
  
  return (
    <div className="relative w-full">
      {isActive && (
        <div className="relative rounded-lg overflow-hidden border border-[#33c3f0]/30 bg-black/20">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width={320}
            height={240}
            className="w-full h-full object-cover"
            style={{ display: cameraPermission === 'granted' ? 'block' : 'none' }}
          />
          <canvas 
            ref={canvasRef}
            width={320}
            height={240}
            className="absolute top-0 left-0 w-full h-full"
          />
          
          {cameraPermission === 'pending' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
              <p>Requesting camera permission...</p>
            </div>
          )}
          
          {cameraPermission === 'denied' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
              <p className="mb-2 text-center">Camera access denied. Face recognition requires camera permission.</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-2 bg-[#33c3f0]/20 border-[#33c3f0] text-white"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {faceDetected && (
            <div className="absolute top-2 right-2 bg-[#33c3f0]/80 px-2 py-1 rounded text-xs">
              Face Detected
            </div>
          )}
          
          {detectedObjects.length > 0 && (
            <div className="absolute bottom-2 left-2 bg-[#4ade80]/80 px-2 py-1 rounded text-xs flex flex-wrap gap-1">
              {detectedObjects.map((obj, idx) => (
                <span key={idx} className="bg-black/30 rounded px-1">
                  {obj.class}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleActive}
        className={`mt-2 ${
          isActive 
            ? 'bg-[#33c3f0]/20 border-[#33c3f0] text-[#33c3f0]' 
            : 'bg-transparent border-[#33c3f0]/30 text-[#8a8a9b]'
        } hover:bg-[#33c3f0]/30 hover:text-[#d6d6ff]`}
      >
        {isActive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
        {isActive ? 'Disable Face Recognition' : 'Enable Face Recognition'}
      </Button>
    </div>
  );
};

export default FaceRecognition;
