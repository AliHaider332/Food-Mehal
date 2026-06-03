import React, { useEffect, useRef, useState } from 'react';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaUserCircle,
} from 'react-icons/fa';
import { MdDeliveryDining, MdVerified } from 'react-icons/md';
const SellerShopReviews = ({ reviews }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  // Get rating distribution
  const getRatingDistribution = () => {
    if (!reviews) return {};
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews?.length || 0;

  // Auto-play reviews carousel
  useEffect(() => {
    if (isAutoPlaying && reviews?.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, reviews?.length]);

  const nextReview = () => {
    setIsAutoPlaying(false);
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevReview = () => {
    setIsAutoPlaying(false);
    setCurrentReviewIndex(
      (prev) => (prev - 1 + reviews.length) % reviews.length
    );
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <>
      {totalReviews > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Rating Breakdown
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {star} ★
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-500">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews Carousel */}
      {reviews && reviews.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaQuoteLeft className="text-orange-500" />
              Customer Reviews ({totalReviews})
            </h3>
            {totalReviews > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={prevReview}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
                >
                  <FaChevronLeft className="text-gray-600" />
                </button>
                <button
                  onClick={nextReview}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
                >
                  <FaChevronRight className="text-gray-600" />
                </button>
              </div>
            )}
          </div>

          <div className="relative overflow-hidden">
            <div className="transition-all duration-500 ease-in-out">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {reviews[currentReviewIndex]?.user?.picture ? (
                      <img
                        src={reviews[currentReviewIndex].user.picture}
                        alt={reviews[currentReviewIndex].user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-5xl text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {reviews[currentReviewIndex]?.user?.name ||
                            'Anonymous'}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(
                            reviews[currentReviewIndex]?.rating || 0
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(
                          reviews[currentReviewIndex]?.createdAt
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "
                      {reviews[currentReviewIndex]?.comment ||
                        'No comment provided'}
                      "
                    </p>
                    <div className="flex items-center gap-1 mt-3">
                      <MdVerified className="text-green-500 text-xs" />
                      <span className="text-xs text-gray-500">
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            {totalReviews > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentReviewIndex(index);
                      setTimeout(() => setIsAutoPlaying(true), 10000);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentReviewIndex === index
                        ? 'w-6 bg-orange-500'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SellerShopReviews;
