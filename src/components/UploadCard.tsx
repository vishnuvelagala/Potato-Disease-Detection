import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { API_URL } from '@/config/api';

interface UploadCardProps {
  onUploadComplete: (result: any) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  useEffect(() => {
    // Clean up the preview URL when the component unmounts
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG, JPG, or JPEG image.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please select an image to detect disease.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is logged in
    if (!isLoggedIn || !user) {
      toast({
        title: "Login required",
        description: "Please log in to use the detection feature.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create form data to send to the backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('username', user.username);
      
      console.log("Sending request to:", `${API_URL}/predict/`);
      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], typeof pair[1], pair[1]);
      }
      
      // Send the image to the FastAPI backend
      const response = await fetch(`${API_URL}/predict/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        let errorMsg = "An error occurred during analysis";
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch (e) {
          // If response is not JSON, use status text
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      // Parse the response data
      const data = await response.json();
      console.log("Response data:", data);
      
      // The server now returns a complete URL
      console.log("Image URL from backend:", data.image_url);
      
      // Use the URL as provided by the server without modification
      const resultData = {
        image: preview, // Keep the local preview as a fallback
        result: {
          ...data,
          // Ensure we're using the complete URL from the server
          image_url: data.image_url
        }
      };
      
      console.log("Final data being passed to results:", resultData);
      
      // Pass results to parent component
      onUploadComplete(resultData);
      
      // Navigate to results page
      navigate('/results');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during analysis';
      setError(errorMessage);
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error during image analysis:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="potato-card transition-all duration-300 hover:shadow-potato">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Potato Image</h3>
            <p className="text-sm text-muted-foreground">
              Upload a clear image of your potato plant to detect diseases.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col items-center justify-center w-full">
            <label 
              className={`
                w-full flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed
                rounded-xl cursor-pointer transition-all duration-300
                ${preview ? 'border-potato-300 bg-potato-50/50' : 'border-border hover:bg-secondary/50 hover:border-potato-200'}
              `}
            >
              <div className="flex flex-col items-center justify-center p-4">
                {preview ? (
                  <div className="relative w-full h-60 overflow-hidden">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-contain rounded-lg"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.classList.add('loaded');
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-full bg-potato-100 mb-4">
                      <Upload className="h-8 w-8 text-potato-600" />
                    </div>
                    <p className="text-sm font-medium text-potato-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (max. 10MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full potato-btn-primary group"
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Potato...
              </>
            ) : (
              <>
                Detect Disease
                <svg 
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadCard;
