
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, ThumbsUp } from 'lucide-react';
import { API_URL } from '@/config/api';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import FeedbackList from '@/components/feedback/FeedbackList';

interface FeedbackItem {
  id: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const Feedback: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadFeedback();
  }, [retryCount]);

  const loadFeedback = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/feedback`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch feedback: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const data = await response.json();
      setFeedbackItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading feedback:', error);
      setError('Could not load feedback data. Please try again later.');
      toast({
        title: "Error loading feedback",
        description: "Could not load feedback data from the server. Showing local data if available.",
        variant: "destructive",
      });
      
      // For demo purposes, use some sample feedback if API is down
      if (retryCount > 0) {
        const sampleFeedback = [
          {
            id: "sample-1",
            username: "DemoUser1",
            rating: 5,
            comment: "PotatoGuard is amazing! It helped me identify potato diseases quickly.",
            timestamp: new Date().toISOString()
          },
          {
            id: "sample-2",
            username: "DemoUser2",
            rating: 4,
            comment: "Great tool for farmers. Would love to see more crops covered in the future.",
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        setFeedbackItems(sampleFeedback);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
  };

  return (
    <div className="container px-4 py-12 mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
        <p className="mt-2 text-muted-foreground">
          Share your experience and see what others are saying
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={handleRetry}
              className="px-3 py-1 ml-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm transition-colors"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <FeedbackForm onFeedbackSubmitted={loadFeedback} />
        </div>
        
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ThumbsUp className="mr-2 h-5 w-5 text-potato-500" />
            User Feedback
          </h2>
          
          <FeedbackList 
            feedbackItems={feedbackItems} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Feedback;
