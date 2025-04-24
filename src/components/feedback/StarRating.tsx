
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
  return (
    <div className="flex">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
    </div>
  );
};

export default StarRating;
