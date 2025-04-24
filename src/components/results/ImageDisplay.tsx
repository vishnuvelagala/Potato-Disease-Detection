
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ImageOff, Save } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

interface ImageDisplayProps {
  imageUrl: string | null;
}

const ImageDisplay = ({ imageUrl }: ImageDisplayProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    // Reset error state when image changes
    setImageError(false);
    setIsImageLoading(true);
  }, [imageUrl]);

  const handleImageError = () => {
    console.error("Failed to load image");
    setImageError(true);
    setIsImageLoading(false);
    toast({
      variant: "destructive",
      title: "Image loading failed",
      description: "The analysis image could not be displayed."
    });
  };
  
  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setIsImageLoading(false);
    setImageError(false);
  };

  const saveImage = () => {
    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "No image available to save."
      });
      return;
    }
    
    try {
      // Create an anchor element
      const link = document.createElement('a');
      
      // If it's already a data URL, use it directly
      if (imageUrl.startsWith('data:')) {
        link.href = imageUrl;
        
        // Complete the download process
        link.download = `potato-analysis-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Image saved",
          description: "The image has been saved to your downloads folder."
        });
      } 
      // If it's a remote URL, we need special handling
      else if (imageUrl.startsWith('http')) {
        // Create an image element to convert the URL to a data URL
        const img = new Image();
        img.crossOrigin = "anonymous"; // Try to handle CORS
        
        img.onload = () => {
          try {
            // Create canvas and draw image on it
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              
              // Convert to data URL and download
              const dataURL = canvas.toDataURL('image/png');
              link.href = dataURL;
              link.download = `potato-analysis-${new Date().toISOString().slice(0, 10)}.png`;
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              toast({
                title: "Image saved",
                description: "The image has been saved to your downloads folder."
              });
            } else {
              throw new Error("Could not get canvas context");
            }
          } catch (error) {
            console.error("Error creating data URL:", error);
            // Fallback: open in new tab
            window.open(imageUrl, '_blank');
            
            toast({
              variant: "destructive",
              title: "Save method changed",
              description: "Opening image in a new tab. Right-click to save it."
            });
          }
        };
        
        img.onerror = () => {
          console.error("Error loading image for saving");
          toast({
            variant: "destructive",
            title: "Save failed",
            description: "Could not load the image for saving. Try again later."
          });
        };
        
        // Start loading the image
        img.src = imageUrl;
      } else {
        throw new Error("Invalid image URL format");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save the image. Try again later."
      });
      
      // Fallback method: open image in new tab
      if (imageUrl.startsWith('http')) {
        window.open(imageUrl, '_blank');
        toast({
          variant: "destructive",
          title: "Save method changed",
          description: "Opening image in a new tab. Right-click to save it."
        });
      }
    }
  };

  if (imageError || !imageUrl) {
    return (
      <div className="mb-6 flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg border border-border/50">
        <ImageOff className="h-16 w-16 text-muted-foreground/40 mb-2" />
        <p className="text-muted-foreground text-sm">Image could not be displayed</p>
        {imageUrl && (
          <Alert variant="destructive" className="mt-4 max-w-md">
            <AlertTitle>Image loading failed</AlertTitle>
            <AlertDescription className="text-xs">
              We couldn't load the image. This might be due to CORS restrictions or the image no longer exists.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-border/50 bg-white p-1 shadow-sm relative">
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      )}
      <img 
        src={imageUrl} 
        alt="Analyzed potato" 
        className="h-auto w-full rounded object-contain"
        style={{ maxHeight: '300px' }}
        onError={handleImageError}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
      />
      <div className="absolute bottom-2 right-2">
        <Button 
          size="sm"
          variant="secondary" 
          className="bg-white/80 hover:bg-white"
          onClick={saveImage}
        >
          <Save className="h-4 w-4 mr-1" />
          Save Image
        </Button>
      </div>
    </div>
  );
};

export default ImageDisplay;
