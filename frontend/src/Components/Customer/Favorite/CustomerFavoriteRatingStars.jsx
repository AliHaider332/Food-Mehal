// Components/Favorite/CustomerFavoriteRatingStars.jsx
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const CustomerFavoriteRatingStars = ({ rating }) => {
  // Convert to number and handle edge cases
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 0);
  const validRating = isNaN(numericRating) ? 0 : numericRating;
  
  const stars = [];
  const fullStars = Math.floor(validRating);
  const decimalPart = validRating - fullStars;
  const hasHalfStar = decimalPart >= 0.25 && decimalPart < 0.75;
  const hasQuarterStar = decimalPart >= 0.75;
  // const roundedRating = Math.round(validRating * 2) / 2; // Round to nearest 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
    } else if (hasHalfStar && i === fullStars + 1) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
    } else if (hasQuarterStar && i === fullStars + 1) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
    }
  }
  
  // Format rating display - always show 1 decimal place (3.0, 4.5, etc.)
  const displayRating = validRating.toFixed(1);
  
  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="text-sm font-semibold ml-1 text-white">
        {displayRating}
      </span>
    </div>
  );
};

export default CustomerFavoriteRatingStars;