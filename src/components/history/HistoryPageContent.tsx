
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import HistoryHeader from "./HistoryHeader";
import HistoryLoading from "./HistoryLoading";
import HistoryEmpty from "./HistoryEmpty";
import HistoryList from "./HistoryList";
import HistoryFilters from "./HistoryFilters";
import { useHistoryItemDetail } from "./HistoryItemDetail";
import { Card, CardContent } from "@/components/ui/card";
import { API_URL } from "@/config/api";

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

const HistoryPageContent: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = useAuth();
  const { viewResult } = useHistoryItemDetail();

  useEffect(() => {
    if (isLoggedIn && user) {
      loadHistory();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [isLoggedIn, user]);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history/${user?.username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistoryItems(data.history);
    } catch (error) {
      toast({
        title: "Error loading history",
        description: "Could not load your detection history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Not logged in
  if (!isLoggedIn) {
    return (
      <Card className="border-potato-100">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Please log in to view your detection history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <HistoryHeader />
      <HistoryFilters />
      {loading ? (
        <HistoryLoading />
      ) : historyItems.length === 0 ? (
        <HistoryEmpty />
      ) : (
        <HistoryList historyItems={historyItems} onViewResult={viewResult} />
      )}
    </>
  );
};

export default HistoryPageContent;
