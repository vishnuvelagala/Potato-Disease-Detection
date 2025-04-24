
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Download, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ResultsActionsProps {
  onSaveImage: () => void;
}

const ResultsActions = ({ onSaveImage }: ResultsActionsProps) => {
  const navigate = useNavigate();
  
  const saveReport = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 p-6">
      <Button 
        variant="outline" 
        className="text-potato-700 border-potato-200 hover:bg-potato-50"
        onClick={() => navigate('/upload')}
      >
        Analyze Another Image
      </Button>
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="bg-white text-potato-700 border-potato-200 hover:bg-potato-50"
          onClick={onSaveImage}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Image
        </Button>
        
        <Button 
          className="bg-potato-600 text-white hover:bg-potato-700"
          onClick={saveReport}
        >
          <Download className="mr-2 h-4 w-4" />
          Save Report
        </Button>
      </div>
    </div>
  );
};

export default ResultsActions;
