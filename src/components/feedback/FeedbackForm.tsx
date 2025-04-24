
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { MessageSquare, Star } from 'lucide-react';
import { API_URL } from '@/config/api';

interface FeedbackFormProps {
  onFeedbackSubmitted: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onFeedbackSubmitted }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit feedback",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user?.username,
          rating,
          comment,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to submit feedback: ${response.status} ${response.statusText} - ${errorData}`);
      }
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      
      setComment('');
      setRating(5);
      
      // Notify parent component to reload feedback
      onFeedbackSubmitted();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: "Could not submit your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-potato-100">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-potato-500" />
          Submit Feedback
        </h2>
        
        {!isLoggedIn ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">Please log in to submit feedback</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback}>
            <div className="mb-4">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center mt-2 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="comment">Your Feedback</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with PotatoGuard..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2"
                rows={5}
              />
            </div>
            
            <Button 
              type="submit" 
              className="potato-btn-primary w-full"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
