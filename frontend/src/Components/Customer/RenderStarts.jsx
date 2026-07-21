import React from 'react';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// Calculate average rating from reviews
export const getAverageRating = (shop) => {
  if (!shop.reviews || shop.reviews.length === 0) return 0;
  const total = shop.reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / shop.reviews.length).toFixed(1);
};
export const renderRatingStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating);
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
    );
  }
  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />
    );
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-${i}`} className="text-yellow-300 text-sm" />
    );
  }
  return stars;
};

// Generate rating badge color based on score
export const getRatingBadgeColor = (rating) => {
  const numRating = parseFloat(rating);
  if (numRating >= 4.5) return 'bg-green-500';
  if (numRating >= 4.0) return 'bg-emerald-500';
  if (numRating >= 3.5) return 'bg-lime-500';
  if (numRating >= 3.0) return 'bg-yellow-500';
  return 'bg-orange-500';
};
