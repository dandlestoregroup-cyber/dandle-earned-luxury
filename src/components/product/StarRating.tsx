import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
  size?: 'sm' | 'md';
}

export const StarRating = ({ rating, reviewCount, size = 'md' }: StarRatingProps) => {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`
              ${starSize}
              ${i < Math.floor(rating) 
                ? 'fill-bronze text-bronze' 
                : i < rating 
                  ? 'fill-bronze/50 text-bronze' 
                  : 'text-muted-foreground/30'
              }
            `} 
          />
        ))}
      </div>
      <span className={`${textSize} text-foreground font-medium`}>{rating}</span>
      <a href="#reviews" className={`${textSize} text-muted-foreground hover:text-bronze transition-colors`}>
        ({reviewCount} reviews)
      </a>
    </div>
  );
};
