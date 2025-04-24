
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Clock } from 'lucide-react';
import StarRating from './StarRating';
import { Badge } from '@/components/ui/badge';

interface FeedbackItemProps {
  id: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
  isNewest?: boolean;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ 
  id, 
  username, 
  rating, 
  comment, 
  timestamp,
  isNewest = false
}) => {
  return (
    <Card key={id} className="border-potato-100">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-potato-100 p-2 rounded-full mr-3">
              <User className="h-5 w-5 text-potato-700" />
            </div>
            <div>
              <div className="font-medium">
                {username}
                {isNewest && (
                  <Badge className="ml-2 bg-purple-500 hover:bg-purple-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Most Recent
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          <StarRating rating={rating} />
        </div>
        <div className="mt-3 text-sm">{comment}</div>
      </CardContent>
    </Card>
  );
};

export default FeedbackItem;
