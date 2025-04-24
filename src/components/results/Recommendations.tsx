
import React from 'react';

interface RecommendationsProps {
  isHealthy: boolean;
}

const Recommendations = ({ isHealthy }: RecommendationsProps) => {
  if (isHealthy) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
        <h3 className="font-medium text-green-800">Recommendations</h3>
        <p className="mt-1 text-sm text-green-700">
          Your potato plant appears healthy. To maintain its health:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-green-700">
          <li>• Continue your current watering and fertilization routines</li>
          <li>• Maintain good air circulation around plants</li>
          <li>• Monitor regularly for any changes in appearance</li>
          <li>• Practice crop rotation for future plantings</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h3 className="font-medium text-amber-800">Recommendations</h3>
      <p className="mt-1 text-sm text-amber-700">
        Based on the analysis, your potato may have a disease. We recommend:
      </p>
      <ul className="mt-2 space-y-1 text-sm text-amber-700">
        <li>• Consult with an agricultural expert for proper diagnosis</li>
        <li>• Isolate affected plants to prevent spread</li>
        <li>• Consider appropriate fungicides or treatments</li>
        <li>• Monitor other plants for early signs of disease</li>
      </ul>
    </div>
  );
};

export default Recommendations;
