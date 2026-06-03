// ReviewSlider Component - Add this before your main component or in a separate file

import {  useState } from 'react';
import {FaChevronLeft, FaChevronRight, FaQuoteLeft, FaRegStar, FaStar, FaStarHalfAlt, FaUserCircle } from "react-icons/fa"
const CustomerSingleShopReviewSlider = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <FaQuoteLeft className="text-gray-400 text-xl" />
          </div>
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-gray-400 text-sm">
            Be the first to review this shop!
          </p>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };


  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-300 text-xs" />);
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentReview = reviews[currentIndex];

  return (
    <div className="mt-5 relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100 rounded-full -ml-12 -mb-12 opacity-50"></div>

      {/* Quote Icon */}
      <div className="absolute top-4 left-4 opacity-10">
        <FaQuoteLeft className="text-6xl text-orange-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* User Avatar */}
          <div className="mb-4">
            {currentReview.user?.picture ? (
              <img
                src={currentReview.user.picture}
                alt={currentReview.user?.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <FaUserCircle className="text-white text-4xl" />
              </div>
            )}
          </div>

          {/* User Name */}
          <h4 className="font-bold text-gray-800 text-lg mb-1">
            {currentReview.user?.name || 'Anonymous User'}
          </h4>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-3">
            {renderRatingStars(currentReview.rating)}
            <span className="text-sm font-semibold text-gray-600 ml-2">
              {currentReview.rating}.0
            </span>
          </div>

          {/* Review Comment */}
          <div className="max-w-2xl mx-auto mb-4">
            <p className="text-gray-600 italic leading-relaxed">
              "{currentReview.comment || 'No comment provided'}"
            </p>
          </div>

          {/* Review Date */}
          <div className="text-xs text-gray-400">
            {formatDate(currentReview.createdAt)}
          </div>

          {/* Navigation Dots */}
          <div className="flex gap-2 mt-6">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-orange-500'
                    : 'w-2 h-2 bg-gray-300 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {reviews.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </>
      )}
    </div>
  );
};
export default CustomerSingleShopReviewSlider;
