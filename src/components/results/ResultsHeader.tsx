
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ResultsHeaderProps {
  isHealthy: boolean;
}

const ResultsHeader = ({ isHealthy }: ResultsHeaderProps) => {
  const getHeaderIcon = () => {
    return isHealthy 
      ? <CheckCircle className="h-5 w-5 text-green-600" /> 
      : <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="p-6 pb-0">
      <div className="flex items-center gap-2">
        {getHeaderIcon()}
        <CardTitle className="text-xl font-medium">
          {isHealthy ? "Healthy Potato Detected" : "Disease Detected"}
        </CardTitle>
      </div>
      <CardDescription className="text-balance">
        {isHealthy 
          ? "Good news! Your potato appears to be healthy."
          : "We've detected signs of potential disease in your potato plant."}
      </CardDescription>
    </div>
  );
};

export default ResultsHeader;
