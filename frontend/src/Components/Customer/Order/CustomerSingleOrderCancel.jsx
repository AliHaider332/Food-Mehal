// CustomerSingleOrderCancel.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { TbLoader3 } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { useGetCancelOrderMutation } from '../../../services/customer.api';

// Constants
const MIN_REASON_LENGTH = 5;
const MAX_REASON_LENGTH = 200;

const QUICK_REASONS = [
  'Long waiting time',
  'Changed my mind',
  'Wrong item selected',
  'Better price elsewhere',
  'Delivery too slow',
  'Found alternative',
];

const CustomerSingleOrderCancel = ({ order, setCancelOrder }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const textareaRef = useRef(null);
  const [cancelOrder] = useGetCancelOrderMutation();

  // Derived state
  const isReasonValid = cancelReason.trim().length >= MIN_REASON_LENGTH;
  const isReasonNearLimit = cancelReason.length > MAX_REASON_LENGTH - 20;

  // Focus textarea on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting && !isClosing) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSubmitting, isClosing]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setIsClosing(true);
      setTimeout(() => {
        setCancelOrder(false);
        setCancelReason('');
        setCancelReasonError('');
        setIsClosing(false);
      }, 300);
    }
  }, [isSubmitting, setCancelOrder]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && !isSubmitting && !isClosing) {
        handleClose();
      }
    },
    [isSubmitting, isClosing, handleClose]
  );

  const validateReason = useCallback((reason) => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setCancelReasonError('Please provide a reason for cancellation');
      textareaRef.current?.focus();
      return false;
    }
    if (trimmed.length < MIN_REASON_LENGTH) {
      setCancelReasonError(
        `Please provide a more detailed reason (at least ${MIN_REASON_LENGTH} characters)`
      );
      textareaRef.current?.focus();
      return false;
    }
    return true;
  }, []);

  const handleCancelOrder = useCallback(async () => {
    const trimmedReason = cancelReason.trim();

    if (!validateReason(cancelReason)) return;

    setIsSubmitting(true);
    setCancelReasonError('');

    try {
      const response = await cancelOrder({
        id: order._id,
        role: 'customer',
        reason: trimmedReason,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || 'Order cancelled successfully');
        handleClose();
      } else {
        toast.error(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);

      const errorMessage =
        error.data?.message ||
        error.data?.error ||
        error.message ||
        'Failed to cancel order';

      setCancelReasonError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [cancelReason, cancelOrder, order._id, validateReason, handleClose]);

  const handleReasonChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length <= MAX_REASON_LENGTH) {
      setCancelReason(value);
      setCancelReasonError('');
    }
  }, []);

  const handleQuickReasonClick = useCallback((reason) => {
    setCancelReason(reason);
    setCancelReasonError('');
    textareaRef.current?.focus();
  }, []);

  // Format order details
  const formattedOrderId = order?._id?.slice(-8).toUpperCase() || 'N/A';
  const formattedTotal = order?.totalAmount?.toFixed(2) || '0.00';

  return (
    <>
      <style>{`
        .cancel-modal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .cancel-modal-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .cancel-modal-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 10px;
        }
        .cancel-modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }
        .cancel-modal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 #f1f1f1;
          scroll-behavior: smooth;
        }
        .cancel-textarea-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .cancel-textarea-scroll::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .cancel-textarea-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          border-radius: 10px;
        }
        .cancel-textarea-scroll {
          scrollbar-width: thin;
          scrollbar-color: #f59e0b #f3f4f6;
        }
        @keyframes slideUp {
          from { transform: translateY(30px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0) scale(1); opacity: 1; }
          to { transform: translateY(30px) scale(0.95); opacity: 0; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-in forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.25s ease-out forwards;
        }
      `}</style>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto ${
          isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-order-title"
      >
        <div
          className={`bg-white rounded-2xl max-w-md w-full mx-2 sm:mx-0 p-4 sm:p-6 shadow-xl relative my-4 sm:my-auto max-h-[90vh] sm:max-h-[95vh] overflow-y-auto cancel-modal-scrollbar ${
            isClosing ? 'animate-slideDown' : 'animate-slideUp'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 disabled:opacity-50 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
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

          <div className="text-center">
            {/* Icon */}
            <div className="bg-red-100 rounded-full p-2 sm:p-3 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <FaRegTimesCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>

            {/* Header */}
            <h3
              id="cancel-order-title"
              className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2"
            >
              Cancel Order
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              Please help us improve by telling us why you're cancelling
            </p>

            {/* Order Summary */}
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg text-left text-xs sm:text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Order ID:</span> #{formattedOrderId}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Total:</span> Rs. {formattedTotal}
              </p>
            </div>

            {/* Reason Input */}
            <div className="mb-3 sm:mb-4 text-left">
              <label
                htmlFor="cancel-reason"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancel-reason"
                ref={textareaRef}
                value={cancelReason}
                onChange={handleReasonChange}
                placeholder="e.g., Long waiting time, changed my mind, found better price, etc..."
                rows={4}
                maxLength={MAX_REASON_LENGTH}
                disabled={isSubmitting}
                aria-invalid={!!cancelReasonError}
                aria-describedby={cancelReasonError ? 'reason-error' : undefined}
                className={`w-full px-2 sm:px-3 py-2 border text-sm sm:text-base ${
                  cancelReasonError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none ${
                  isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''
                } cancel-textarea-scroll`}
              />
              <div className="flex justify-between mt-1 flex-wrap gap-1">
                {cancelReasonError && (
                  <p id="reason-error" className="text-red-500 text-xs">
                    {cancelReasonError}
                  </p>
                )}
                <p
                  className={`text-xs ml-auto ${
                    isReasonNearLimit
                      ? 'text-orange-500'
                      : 'text-gray-400'
                  }`}
                >
                  {cancelReason.length}/{MAX_REASON_LENGTH} characters
                </p>
              </div>
            </div>

            {/* Quick Reason Chips */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs text-gray-500 mb-2 text-left">
                Quick reasons:
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {QUICK_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleQuickReasonClick(reason)}
                    disabled={isSubmitting}
                    className="text-[11px] sm:text-xs px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    type="button"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Warning Note */}
            <div className="mb-4 sm:mb-5 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-[10px] sm:text-xs text-red-600 flex items-center justify-center gap-1 flex-wrap">
                <span aria-hidden="true">⚠️</span>
                Cancelling this order is permanent and cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium text-sm sm:text-base"
                type="button"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isSubmitting || !isReasonValid}
                className={`w-full sm:flex-1 px-3 sm:px-4 py-2 rounded-lg text-white font-medium text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 ${
                  isSubmitting || !isReasonValid
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-[1.02] active:scale-95'
                }`}
                type="button"
              >
                {isSubmitting && (
                  <TbLoader3 className="w-4 h-4 animate-spin" aria-hidden="true" />
                )}
                {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSingleOrderCancel;