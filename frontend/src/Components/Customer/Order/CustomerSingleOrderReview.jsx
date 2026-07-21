import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { TbLoader3 } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { useGetReviewShopMutation } from '../../../services/customer.api';

// Constants
const MAX_COMMENT_LENGTH = 500;
const MIN_COMMENT_LENGTH = 3;

const QUICK_COMMENTS = [
  'Great quality!',
  'Fast delivery',
  'Good packaging',
  'Will order again',
  'Fresh products',
  'Good value for money',
  'Excellent service',
  'Very satisfied',
];

const RATING_LABELS = {
  5: '🌟 Perfect! You loved it!',
  4: '😊 Good! Pretty satisfied',
  3: '🤔 Average! Could be better',
  2: '😕 Not great! Needs improvement',
  1: '😞 Poor! Very disappointed',
};

const CustomerSingleOrderReview = ({ order, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const textareaRef = useRef(null);
  const [reviewShop] = useGetReviewShopMutation();

  // Derived state
  const isCommentValid = comment.trim().length >= MIN_COMMENT_LENGTH;
  const isCommentNearLimit = comment.length > MAX_COMMENT_LENGTH - 50;
  const hasRating = rating > 0;
  const isFormValid = hasRating && isCommentValid;

  // Focus textarea when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSubmitting]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose?.(false);
      // Reset states after animation
      setTimeout(() => {
        setRating(0);
        setHoveredRating(0);
        setComment('');
        setCommentError('');
      }, 300);
    }
  }, [isSubmitting, onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && !isSubmitting) {
        handleClose();
      }
    },
    [isSubmitting, handleClose]
  );

  const handleRatingClick = useCallback(
    (value) => {
      if (!isSubmitting) {
        setRating(value);
        setCommentError('');
      }
    },
    [isSubmitting]
  );

  const handleRatingHover = useCallback(
    (value) => {
      if (!isSubmitting) {
        setHoveredRating(value);
      }
    },
    [isSubmitting]
  );

  const handleRatingLeave = useCallback(() => {
    if (!isSubmitting) {
      setHoveredRating(0);
    }
  }, [isSubmitting]);

  const handleCommentChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_COMMENT_LENGTH) {
      setComment(value);
      setCommentError('');
    }
  }, []);

  const handleQuickCommentClick = useCallback(
    (quickComment) => {
      if (!isSubmitting) {
        setComment(quickComment);
        setCommentError('');
        textareaRef.current?.focus();
      }
    },
    [isSubmitting]
  );

  const validateForm = useCallback(() => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return false;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setCommentError('Please share your experience');
      textareaRef.current?.focus();
      return false;
    }

    if (trimmedComment.length < MIN_COMMENT_LENGTH) {
      setCommentError(
        `Please provide more detail (at least ${MIN_COMMENT_LENGTH} characters)`
      );
      textareaRef.current?.focus();
      return false;
    }

    return true;
  }, [rating, comment]);

  const handleSubmitReview = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await reviewShop({
        orderId: order._id,
        rating: rating,
        comment: comment.trim(),
        shopId: order?.shop?._id,
      }).unwrap();
      // console.log(response);


      if (response.success) {
        toast.success('Thank you for your review! 🎉');
        handleClose();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);

      const errorMessage =
        error.data?.message ||
        error.message ||
        'Failed to submit review. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    rating,
    comment,
    order._id,
    order?.shop?._id,
    reviewShop,
    validateForm,
    handleClose,
  ]);

  // Format date
  const formatDate = useCallback((date) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // Get rating label
  const getRatingLabel = useCallback((value) => {
    return RATING_LABELS[value] || '';
  }, []);

  // Format order details
  const formattedOrderId = order?._id?.slice(-8).toUpperCase() || 'N/A';
  const formattedTotal = order?.totalAmount?.toFixed(2) || '0.00';
  const formattedDate = formatDate(order?.deliveredAt);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .review-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .review-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .review-scrollbar::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }
        .review-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
        .review-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #f97316 #f1f1f1;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
      >
        <div
          className="bg-white rounded-2xl max-w-md w-full shadow-xl animate-slideUp relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close modal"
            type="button"
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

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-6 pt-6 pb-4 review-scrollbar">
            <div className="text-center">
              {/* Icon */}
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

              {/* Title */}
              <h3
                id="review-title"
                className="text-xl font-bold text-gray-800 mb-2"
              >
                Rate Your Experience
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                How was your shopping experience with us?
              </p>

              {/* Order Summary */}
              <div className="mb-5 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-left text-sm border border-gray-200">
                <p className="text-gray-600">
                  <span className="font-semibold">Order ID:</span> #
                  {formattedOrderId}
                </p>
                <p className="text-gray-600 mt-1">
                  <span className="font-semibold">Total:</span> Rs.{' '}
                  {formattedTotal}
                </p>
                <p className="text-gray-600 mt-1">
                  <span className="font-semibold">Delivered on:</span>{' '}
                  {formattedDate}
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
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => handleRatingHover(star)}
                      onMouseLeave={handleRatingLeave}
                      disabled={isSubmitting}
                      className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Rate ${star} stars`}
                    >
                      <FaStar
                        className={`w-8 h-8 ${
                          (hoveredRating || rating) >= star
                            ? 'text-yellow-400 fill-current drop-shadow-sm'
                            : 'text-gray-300'
                        } transition-all duration-150`}
                      />
                    </button>
                  ))}
                </div>

                {!hasRating && !isSubmitting && (
                  <p className="text-xs text-orange-500 mt-2 animate-pulse">
                    ⭐ Please select a rating
                  </p>
                )}

                {hasRating && (
                  <p className="text-xs font-medium mt-2 text-gray-700">
                    {getRatingLabel(rating)}
                  </p>
                )}
              </div>

              {/* Comment Input */}
              <div className="mb-4 text-left">
                <label
                  htmlFor="review-comment"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Your Review <span className="text-orange-500">*</span>
                </label>
                <textarea
                  id="review-comment"
                  ref={textareaRef}
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Share your experience with the product, delivery, packaging, etc..."
                  rows={4}
                  maxLength={MAX_COMMENT_LENGTH}
                  disabled={isSubmitting}
                  aria-invalid={!!commentError}
                  aria-describedby={commentError ? 'comment-error' : undefined}
                  className={`w-full px-3 py-2 border ${
                    commentError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-orange-500'
                  } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
                    isSubmitting
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'hover:border-gray-400'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {commentError && (
                    <p
                      id="comment-error"
                      className="text-red-500 text-xs flex items-center gap-1"
                    >
                      <span aria-hidden="true">⚠️</span> {commentError}
                    </p>
                  )}
                  <p
                    className={`text-xs ml-auto ${
                      isCommentNearLimit
                        ? 'text-orange-500 font-medium'
                        : 'text-gray-400'
                    }`}
                  >
                    {comment.length}/{MAX_COMMENT_LENGTH} characters
                  </p>
                </div>
              </div>

              {/* Quick Comments */}
              <div className="mb-5">
                <p className="text-xs text-gray-500 mb-2 text-left flex items-center gap-1">
                  <span aria-hidden="true">⚡</span> Quick suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_COMMENTS.map((quickComment) => (
                    <button
                      key={quickComment}
                      onClick={() => handleQuickCommentClick(quickComment)}
                      disabled={isSubmitting}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      type="button"
                    >
                      {quickComment}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="mb-5 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <p className="text-xs text-orange-700 flex items-center justify-center gap-1">
                  <span aria-hidden="true">💡</span>
                  Your review helps other customers make better choices!
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 bg-white rounded-b-2xl shadow-lg">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 font-medium"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting || !isFormValid}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                  isSubmitting || !isFormValid
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg'
                }`}
                type="button"
              >
                {isSubmitting && (
                  <TbLoader3
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSingleOrderReview;
