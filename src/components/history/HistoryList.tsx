
import React from "react";
import HistoryItemCard from "./HistoryItemCard";

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
interface HistoryListProps {
  historyItems: HistoryItem[];
  onViewResult: (item: HistoryItem) => void;
}
const HistoryList: React.FC<HistoryListProps> = ({ historyItems, onViewResult }) => (
  <div className="grid gap-6">
    {historyItems.map((item) =>
      <HistoryItemCard key={item.id} item={item} onViewResult={onViewResult} />
    )}
  </div>
);
export default HistoryList;
