
import React, { useEffect } from 'react';
import UploadCard from '@/components/UploadCard';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface UploadPageProps {
  setResults: (results: any) => void;
}

const Upload: React.FC<UploadPageProps> = ({ setResults }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const handleUploadComplete = (results: any) => {
    setResults(results);
    navigate('/results');
  };
  
  return (
    <div className="container px-4 py-12 mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Potato Disease Detection</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-balance">
          Upload a clear image of your potato plant leaf to detect potential diseases using our advanced AI technology
        </p>
      </div>
      
      <div className="max-w-xl mx-auto">
        <UploadCard onUploadComplete={handleUploadComplete} />
        
        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <h3 className="font-medium text-foreground mb-2">For best results:</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>Use well-lit, clear images of potato plant leaves</li>
            <li>Center the affected area in the frame</li>
            <li>Include enough context to show the whole leaf</li>
            <li>Photos should be in focus and avoid glare or shadows</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;
