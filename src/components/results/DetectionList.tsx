
import React from 'react';
import { Detection } from '@/types';

interface DetectionListProps {
  detections: Detection[];
}

const DetectionList = ({ detections }: DetectionListProps) => {
  const getBadgeColor = (className: string) => {
    if (className === "Healthy") {
      return "bg-green-100 text-green-800 border-green-300";
    } else {
      return "bg-red-100 text-red-800 border-red-300";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Detection Results</h3>
      
      <div className="space-y-3">
        {detections.map((detection, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg border border-border/50 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor(detection.class_name)}`}>
                {detection.class_name}
              </span>
            </div>
            <div className="font-medium text-sm">
              Confidence: {(detection.confidence * 100).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectionList;
