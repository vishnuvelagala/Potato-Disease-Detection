
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsCard from '@/components/ResultsCard';
import { Button } from '@/components/ui/button';
import { Detection } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { ChatDialog } from '@/components/chat/ChatDialog';

interface ResultsProps {
  results: {
    image: string | null;
    result: {
      detections: Detection[];
      image_url?: string;
    }
  } | null;
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const navigate = useNavigate();
  
  // Load results from localStorage if not provided directly
  const [localResults, setLocalResults] = React.useState(results);
  const [showChat, setShowChat] = React.useState(false);
  
  useEffect(() => {
    // If results passed directly, use them
    if (results) {
      setLocalResults(results);
      setShowChat(true);
      return;
    }
    
    // Otherwise try to load from localStorage
    try {
      const savedResult = localStorage.getItem('current_result');
      if (savedResult) {
        console.log('Loading results from localStorage');
        const parsedResults = JSON.parse(savedResult);
        setLocalResults(parsedResults);
        setShowChat(true);
        
        // Ensure we retain image data in localStorage for potential issues with direct URLs
        // This helps with CORS issues when viewing from history
        localStorage.setItem('current_result', savedResult);
        
        // Notify the user that we're displaying results
        toast({
          title: "Results loaded",
          description: "Displaying potato image analysis.",
        });
      } else {
        console.log('No results found in localStorage, redirecting to upload');
        navigate('/upload');
      }
    } catch (error) {
      console.error('Error loading results from localStorage:', error);
      navigate('/upload');
    }
  }, [results, navigate]);
  
  if (!localResults) {
    return null;
  }
  
  // Prioritize the different image sources:
  // 1. First try the base64 encoded image directly (most reliable)
  // 2. Then try server-provided URL if available
  // 3. Fall back to whatever image source was provided
  let imageSource = null;
  
  // For history items, we use the base64 version primarily
  if (localResults.image && localResults.image.startsWith('data:image')) {
    imageSource = localResults.image;
  } 
  // Otherwise try the server URL
  else if (localResults.result && localResults.result.image_url) {
    imageSource = localResults.result.image_url;
  }
  // Last resort - use whatever was passed
  else {
    imageSource = localResults.image;
  }
  
  console.log("Result component: Image source type:", imageSource?.substring(0, 30), "...");
  console.log("Result component: Detections:", localResults.result.detections);
  
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="container px-4 py-12 mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Analysis Results</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Review the detected potato plant health conditions and recommendations
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <ResultsCard 
            image={imageSource}
            detections={localResults.result.detections}
          />
          
          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground mr-4"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
            
            <Button 
              variant="outline"
              className="text-foreground"
              onClick={() => navigate('/upload')}
            >
              Analyze Another Image
            </Button>
          </div>
        </div>
      </div>
      
      {showChat && <ChatDialog />}
    </div>
  );
};

export default Results;
