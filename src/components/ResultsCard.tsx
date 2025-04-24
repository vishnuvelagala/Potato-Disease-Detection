
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Detection } from '@/types';
import ResultsHeader from './results/ResultsHeader';
import ImageDisplay from './results/ImageDisplay';
import DetectionList from './results/DetectionList';
import Recommendations from './results/Recommendations';
import ResultsActions from './results/ResultsActions';

interface ResultsCardProps {
  image: string | null;
  detections: Detection[];
}

const ResultsCard: React.FC<ResultsCardProps> = ({ image, detections }) => {
  const isHealthy = detections.every(d => d.class_name === "Healthy");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Log the image URL for debugging
  useEffect(() => {
    console.log("ResultsCard received image:", image ? image.substring(0, 30) + "..." : "null");
    
    // Ensure we have a valid image URL
    if (image) {
      // Try to validate the URL format
      try {
        // First, prioritize data URLs as they're most reliable
        if (image.startsWith('data:image')) {
          console.log("Using data URL directly");
          setImageUrl(image);
        } 
        // For HTTP/HTTPS URLs, try to use them, but be ready for CORS issues
        else if (image.startsWith('http')) {
          console.log("Using remote image URL");
          setImageUrl(image);
        } 
        else {
          console.error("Invalid image URL format:", image.substring(0, 30));
          setImageUrl(null);
        }
      } catch (error) {
        console.error("Error validating image URL:", error);
        setImageUrl(null);
      }
    } else {
      setImageUrl(null);
    }
  }, [image]);
  
  const getCardColor = () => {
    return isHealthy 
      ? "border-green-100 bg-gradient-to-b from-white to-green-50" 
      : "border-red-100 bg-gradient-to-b from-white to-red-50";
  };
  
  return (
    <Card className={`potato-card overflow-hidden ${getCardColor()}`}>
      <CardHeader className="p-0">
        <ResultsHeader isHealthy={isHealthy} />
      </CardHeader>
      
      <CardContent className="p-6">
        <ImageDisplay imageUrl={imageUrl} />
        <DetectionList detections={detections} />
        <Recommendations isHealthy={isHealthy} />
      </CardContent>
      
      <CardFooter className="p-0">
        <ResultsActions onSaveImage={() => {
          if (imageUrl) {
            const saveImageComponent = document.createElement('a');
            saveImageComponent.href = imageUrl;
            saveImageComponent.download = `potato-analysis-${new Date().toISOString().slice(0, 10)}.png`;
            document.body.appendChild(saveImageComponent);
            saveImageComponent.click();
            document.body.removeChild(saveImageComponent);
          }
        }} />
      </CardFooter>
    </Card>
  );
};

export default ResultsCard;
