// components/SellerOrderReviews.jsx
import React, { useState } from 'react';
import { 
  FaStar, 
  FaRegStar, 
  FaStarHalfAlt, 
  FaUser, 
  FaCalendarAlt, 
  FaThumbsUp, 
  FaComment,
  FaQuoteLeft,
  FaCheckCircle
} from 'react-icons/fa';

const SellerOrderReviews = ({ reviews }) => {
  const [expandedReview, setExpandedReview] = useState(null);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

 

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Average';
    return 'Poor';
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="px-6 py-8 text-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <FaComment className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-500">No reviews yet for this order</p>
          <p className="text-xs text-gray-400 mt-1">Reviews will appear here once customers share feedback</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalReviews = reviews.length;
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingDistribution[Math.floor(review.rating)]++;
  });

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Reviews Header with Statistics */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              Customer Feedback
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''} from customers
            </p>
          </div>
          
         
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-100">
        {reviews.map((review, index) => {
          const isExpanded = expandedReview === index;
          const comment = review.comment || '';
          const shouldTruncate = comment.length > 200;
          const displayComment = isExpanded || !shouldTruncate ? comment : comment.substring(0, 200) + '...';
          
          return (
            <div key={review._id || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {review.user?.picture ? (
                    <img 
                      src={review.user.picture} 
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
                
                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.user?.name || 'Anonymous Customer'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          review.rating >= 4 ? 'bg-green-100 text-green-700' :
                          review.rating >= 3 ? 'bg-blue-100 text-blue-700' :
                          review.rating >= 2 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getRatingLabel(review.rating)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FaCalendarAlt className="text-xs" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Comment */}
                  {comment && (
                    <div className="mt-2">
                      <div className="flex items-start gap-2">
                        <FaQuoteLeft className="text-gray-300 text-xs mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {displayComment}
                          </p>
                          {shouldTruncate && (
                            <button
                              onClick={() => setExpandedReview(isExpanded ? null : index)}
                              className="text-xs text-orange-500 hover:text-orange-600 mt-1 font-medium"
                            >
                              {isExpanded ? 'Show Less' : 'Read More'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Order Info (for context) */}
                  {review.order && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FaCheckCircle className="text-green-500 text-xs" />
                        Verified Purchase
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerOrderReviews;