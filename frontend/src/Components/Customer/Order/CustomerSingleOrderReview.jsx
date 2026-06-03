import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { TbLoader3 } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../Config/axios';
import { updateOrder } from '../../../Store/user/user.item.slice';
import { useDispatch } from 'react-redux';

const CustomerSingleOrderReview = ({
  order,
  onClose, // Change from setShowReviewModal to onClose
}) => {
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCommentError, setReviewCommentError] = useState('');
  const dispatch=useDispatch()
  // Quick comment suggestions
  const quickComments = [
    'Great quality!',
    'Fast delivery',
    'Good packaging',
    'Will order again',
    'Fresh products',
    'Good value for money',
    'Excellent service',
    'Very satisfied',
  ];

  // Handle review submission
  const handleSubmitReview = async (orderId, shop) => {
    // Validate rating
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Validate comment
    if (!reviewComment.trim()) {
      setReviewCommentError('Please share your experience');
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await axiosInstance.post(`/user/${orderId}/review`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
        shopId: shop,
      });

      

      if (response.status === 200 || response.status === 201) {
        toast.success('Thank you for your review!');
        dispatch(updateOrder(response.data.order));
        closeReviewModal();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to submit review. Please try again.',
        {
          position: 'top-right',
          autoClose: 4000,
        }
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const closeReviewModal = () => {
    // Check if onClose is a function before calling
    if (typeof onClose === 'function') {
      onClose(false);
    }
    // Reset all states after animation delay
    setTimeout(() => {
      setReviewRating(0);
      setHoveredRating(0);
      setReviewComment('');
      setReviewCommentError('');
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmittingReview) {
      closeReviewModal();
    }
  };

  // Format date nicely
  const formatDate = (date) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-xl animate-slideUp relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button in corner */}
        <button
          onClick={closeReviewModal}
          disabled={isSubmittingReview}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 px-6 pt-6 pb-4 custom-scrollbar">
          <div className="text-center">
            {/* Review Icon */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-inner">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Rate Your Experience
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              How was your shopping experience with us?
            </p>

            {/* Order Summary */}
            <div className="mb-5 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-left text-sm border border-gray-200">
              <p className="text-gray-600">
                <span className="font-semibold">Order ID:</span> #
                {order?._id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-semibold">Total:</span> Rs.{' '}
                {order?.totalAmount?.toFixed(2) || '0.00'}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-semibold">Delivered on:</span>{' '}
                {formatDate(order?.deliveredAt)}
              </p>
            </div>

            {/* Star Rating */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Rating <span className="text-orange-500">*</span>
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => !isSubmittingReview && setReviewRating(star)}
                    onMouseEnter={() =>
                      !isSubmittingReview && setHoveredRating(star)
                    }
                    onMouseLeave={() =>
                      !isSubmittingReview && setHoveredRating(0)
                    }
                    disabled={isSubmittingReview}
                    className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Rate ${star} stars`}
                  >
                    <FaStar
                      className={`w-8 h-8 ${
                        (hoveredRating || reviewRating) >= star
                          ? 'text-yellow-400 fill-current drop-shadow-sm'
                          : 'text-gray-300'
                      } transition-all duration-150`}
                    />
                  </button>
                ))}
              </div>
              {reviewRating === 0 && !isSubmittingReview && (
                <p className="text-xs text-orange-500 mt-2 animate-pulse">
                  ⭐ Please select a rating
                </p>
              )}
              {reviewRating > 0 && (
                <p className="text-xs font-medium mt-2">
                  {reviewRating === 5 && '🌟 Perfect! You loved it!'}
                  {reviewRating === 4 && '😊 Good! Pretty satisfied'}
                  {reviewRating === 3 && '🤔 Average! Could be better'}
                  {reviewRating === 2 && '😕 Not great! Needs improvement'}
                  {reviewRating === 1 && '😞 Poor! Very disappointed'}
                </p>
              )}
            </div>

            {/* Review Comment Input */}
            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review <span className="text-orange-500">*</span>
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => {
                  setReviewComment(e.target.value);
                  setReviewCommentError('');
                }}
                placeholder="Share your experience with the product, delivery, packaging, etc..."
                rows="4"
                maxLength="500"
                disabled={isSubmittingReview}
                className={`w-full px-3 py-2 border ${
                  reviewCommentError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-orange-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
                  isSubmittingReview
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'hover:border-gray-400'
                }`}
              />
              <div className="flex justify-between mt-1">
                {reviewCommentError && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <span>⚠️</span> {reviewCommentError}
                  </p>
                )}
                <p
                  className={`text-xs ml-auto ${
                    reviewComment.length > 450
                      ? 'text-orange-500 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  {reviewComment.length}/500 characters
                </p>
              </div>
            </div>

            {/* Quick Comment Suggestions */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2 text-left flex items-center gap-1">
                <span>⚡</span> Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickComments.map((comment) => (
                  <button
                    key={comment}
                    onClick={() => {
                      if (!isSubmittingReview) {
                        setReviewComment(comment);
                        setReviewCommentError('');
                      }
                    }}
                    disabled={isSubmittingReview}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    type="button"
                  >
                    {comment}
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Note */}
            <div className="mb-5 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
              <p className="text-xs text-orange-700 flex items-center justify-center gap-1">
                <span>💡</span>
                Your review helps other customers make better choices!
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="border-t border-gray-100 px-6 py-4 bg-white rounded-b-2xl shadow-lg">
          <div className="flex gap-3">
            <button
              onClick={closeReviewModal}
              disabled={isSubmittingReview}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 font-medium"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmitReview(order._id, order?.shop._id)}
              disabled={isSubmittingReview || reviewRating === 0}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              type="button"
            >
              {isSubmittingReview && (
                <TbLoader3 className="w-4 h-4 animate-spin" />
              )}
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations and scrollbar */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
    </div>
  );
};

export default CustomerSingleOrderReview;
