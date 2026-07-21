import React from 'react';
import { renderRatingStars } from '../RenderStarts';

const ReviewSection = React.memo(({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">Be the first to review this item</p>
      </div>
    );
  }

  const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  const avgRating = totalRating / reviews.length;
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating]++;
    }
  });

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800">{avgRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5">{renderRatingStars(avgRating)}</div>

            <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-gray-600">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-gray-500 text-xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {review.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {review.user?.name || 'Anonymous'}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {renderRatingStars(review.rating)}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && <p className="text-sm text-gray-600 mt-2">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
});

export default ReviewSection;
