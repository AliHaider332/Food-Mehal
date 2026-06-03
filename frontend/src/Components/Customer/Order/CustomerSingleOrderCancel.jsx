import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../../Config/axios';
import { updateOrder } from '../../../Store/user/user.item.slice';
import { toast } from 'react-toastify';
import { FaRegTimesCircle } from 'react-icons/fa';
import { TbLoader3 } from 'react-icons/tb';

const CustomerSingleOrderCancel = ({ order, setCancelOrder }) => {
  const dispatch = useDispatch();
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const textareaRef = useRef(null);
  
  // Focus on textarea when modal opens
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmittingCancel) {
        closeCancelModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSubmittingCancel]);

  const handleCancelOrder = async (id) => {
    // Trim the reason for validation
    const trimmedReason = cancelReason.trim();

    if (!trimmedReason) {
      setCancelReasonError('Please provide a reason for cancellation');
      textareaRef.current?.focus();
      return;
    }

    if (trimmedReason.length < 5) {
      setCancelReasonError(
        'Please provide a more detailed reason (at least 5 characters)'
      );
      textareaRef.current?.focus();
      return;
    }

    setIsSubmittingCancel(true);
    setCancelReasonError('');

    try {
      const response = await axiosInstance.post(`delivery/cancel-order/${id}`, {
        role: 'customer',
        reason: trimmedReason,
      });

      if (response.data?.success) {
        // Update Redux store first
        if (response.data.order) {
          dispatch(updateOrder(response.data.order));
        }

        // Close modal and show success message
        closeCancelModal();
        toast.success(response.data.message || 'Order cancelled successfully');
      } else {
        // Handle case where success is false
        toast.error(response.data?.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);

      // Extract error message from response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to cancel order';

      setCancelReasonError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const closeCancelModal = () => {
    setCancelOrder(false);
    setCancelReason('');
    setCancelReasonError('');
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmittingCancel) {
      closeCancelModal();
    }
  };

  // Quick reasons with icons for better UX
  const quickReasons = [
    'Long waiting time',
    'Changed my mind',
    'Wrong item selected',
    'Better price elsewhere',
    'Delivery too slow',
    'Found alternative',
  ];

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style >{`
        /* For Webkit browsers (Chrome, Safari, Edge) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ef4444 #f1f1f1;
        }

        /* Smooth scrolling */
        .custom-scrollbar {
          scroll-behavior: smooth;
        }

        /* For textarea custom scrollbar */
        textarea.custom-textarea-scroll::-webkit-scrollbar {
          width: 4px;
        }

        textarea.custom-textarea-scroll::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }

        textarea.custom-textarea-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          border-radius: 10px;
        }

        textarea.custom-textarea-scroll {
          scrollbar-width: thin;
          scrollbar-color: #f59e0b #f3f4f6;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl max-w-md w-full mx-2 sm:mx-0 p-4 sm:p-6 shadow-xl animate-slideUp relative my-4 sm:my-auto max-h-[90vh] sm:max-h-[95vh] overflow-y-auto custom-scrollbar">
          {/* Close button in corner */}
          <button
            onClick={closeCancelModal}
            disabled={isSubmittingCancel}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
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

          <div className="text-center">
            <div className="bg-red-100 rounded-full p-2 sm:p-3 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <FaRegTimesCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Cancel Order</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              Please help us improve by telling us why you're cancelling
            </p>

            {/* Order Summary */}
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg text-left text-xs sm:text-sm">
              <p className="text-gray-600">
                <span className="font-medium">Order ID:</span> #
                {order?._id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Total:</span> Rs.{' '}
                {order?.totalAmount?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Reason Input with Character Counter */}
            <div className="mb-3 sm:mb-4 text-left">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                ref={textareaRef}
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  setCancelReasonError('');
                }}
                placeholder="e.g., Long waiting time, changed my mind, found better price, etc..."
                rows="4"
                maxLength="200"
                disabled={isSubmittingCancel}
                className={`w-full px-2 sm:px-3 py-2 border text-sm sm:text-base ${
                  cancelReasonError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none ${
                  isSubmittingCancel ? 'bg-gray-100 cursor-not-allowed' : ''
                } custom-textarea-scroll`}
              />
              <div className="flex justify-between mt-1 flex-wrap gap-1">
                {cancelReasonError && (
                  <p className="text-red-500 text-xs">{cancelReasonError}</p>
                )}
                <p
                  className={`text-xs ${
                    cancelReason.length > 180
                      ? 'text-orange-500'
                      : 'text-gray-400'
                  } ${cancelReasonError ? 'ml-auto' : 'ml-auto'}`}
                >
                  {cancelReason.length}/200 characters
                </p>
              </div>
            </div>

            {/* Quick Reason Chips */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs text-gray-500 mb-2 text-left">
                Quick reasons:
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {quickReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      setCancelReason(reason);
                      setCancelReasonError('');
                      textareaRef.current?.focus();
                    }}
                    disabled={isSubmittingCancel}
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
                <span>⚠️</span>
                Cancelling this order is permanent and cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <button
                onClick={closeCancelModal}
                disabled={isSubmittingCancel}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium text-sm sm:text-base"
                type="button"
              >
                Go Back
              </button>
              <button
                onClick={() => handleCancelOrder(order._id)}
                disabled={isSubmittingCancel}
                className="w-full sm:flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md font-medium text-sm sm:text-base"
                type="button"
              >
                {isSubmittingCancel && (
                  <TbLoader3 className="w-4 h-4 animate-spin" />
                )}
                {isSubmittingCancel ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSingleOrderCancel;