
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

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
interface HistoryItemCardProps {
  item: HistoryItem;
  onViewResult: (item: HistoryItem) => void;
}
const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onViewResult }) => {
  return (
    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 p-4 flex items-center justify-center bg-potato-50">
          <div className="relative w-full pt-[100%]">
            <img
              src={item.image_base64.startsWith('data:image') ? item.image_base64 : item.image_url}
              alt="Potato plant"
              className="absolute inset-0 w-full h-full object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== item.image_url) {
                  target.src = item.image_url;
                }
              }}
            />
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                {item.detections && item.detections.length > 0
                  ? item.detections[0].class_name
                  : "Unknown Disease"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <Button
                variant="outline"
                className="rounded-full border-potato-200 text-potato-700 hover:bg-potato-50"
                onClick={() => onViewResult(item)}
              >
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="line-clamp-2 text-sm">
            {item.detections && item.detections.length > 0
              ? item.detections[0].description
              : "No description available."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default HistoryItemCard;
