
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface Detection {
  class_name: string;
  confidence: number;
  description: string;
  treatment?: string;
}

interface HistoryItem {
  id: string;
  image_url: string;
  image_base64: string;
  timestamp: string;
  detections: Detection[];
}

export const useHistoryItemDetail = () => {
  const navigate = useNavigate();

  const viewResult = (item: HistoryItem) => {
    try {
      if (!item.image_base64 || !item.image_base64.startsWith('data:image')) {
        // fallback logic
      }
      const detections = Array.isArray(item.detections) ? item.detections : [];
      const resultData = {
        image: item.image_base64.startsWith('data:image') ? item.image_base64 : item.image_url,
        result: {
          detections: detections,
          image_url: item.image_url
        }
      };
      localStorage.setItem('current_result', JSON.stringify(resultData));
      navigate('/results');
    } catch (error) {
      toast({
        title: "Error viewing details",
        description: "Could not display the result details",
        variant: "destructive",
      });
    }
  };

  return { viewResult };
};

export default useHistoryItemDetail;
