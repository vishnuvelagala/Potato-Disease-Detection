
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import FeedbackItem from './FeedbackItem';

interface FeedbackItem {
  id: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
}

interface FeedbackListProps {
  feedbackItems: FeedbackItem[];
  loading: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbackItems, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-potato-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading feedback...</p>
      </div>
    );
  }

  if (feedbackItems.length === 0) {
    return (
      <Card className="border-potato-100">
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-potato-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No feedback yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your experience with PotatoGuard!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Find the newest feedback (assuming timestamps are ISO strings)
  const newestFeedback = feedbackItems.length > 0 
    ? feedbackItems.reduce((newest, current) => 
        new Date(current.timestamp) > new Date(newest.timestamp) ? current : newest
      , feedbackItems[0])
    : null;

  return (
    <div className="space-y-4">
      {feedbackItems.map((item) => (
        <FeedbackItem
          key={item.id}
          id={item.id}
          username={item.username}
          rating={item.rating}
          comment={item.comment}
          timestamp={item.timestamp}
          isNewest={newestFeedback && item.id === newestFeedback.id}
        />
      ))}
    </div>
  );
};

export default FeedbackList;
