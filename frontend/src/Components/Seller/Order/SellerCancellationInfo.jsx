// components/SellerCancellationInfo.jsx
import React from 'react';
import {
  FaTimesCircle,
  FaUser,
  FaStore,
  FaCalendarAlt,
  FaComment,
  FaInfoCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
} from 'react-icons/fa';

const SellerCancellationInfo = ({ cancelInfo }) => {
  if (!cancelInfo) return null;

  const isCustomerCancelled = cancelInfo.role === 'customer';
  const isSellerCancelled =
    cancelInfo.role === 'seller' ||
    cancelInfo.role === 'shop' ||
    cancelInfo.role === 'owner';

  const formatCancelDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 overflow-hidden">
      {/* Cancellation Header */}
      <div className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCustomerCancelled ? 'bg-orange-100' : 'bg-red-100'
              }`}
            >
              {isCustomerCancelled ? (
                <FaUser className="text-orange-600 text-xl" />
              ) : isSellerCancelled ? (
                <FaStore className="text-red-600 text-xl" />
              ) : (
                <FaTimesCircle className="text-gray-600 text-xl" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div>
                <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-500" />
                  Order Cancelled
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {isCustomerCancelled
                    ? 'Customer requested to cancel this order'
                    : 'This order was cancelled by the restaurant'}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isCustomerCancelled
                    ? 'bg-orange-200 text-orange-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {isCustomerCancelled
                  ? 'Cancelled by Customer'
                  : 'Cancelled by Restaurant'}
              </span>
            </div>

            {/* Cancellation Details */}
            <div className="mt-3 space-y-2">
              {/* Reason */}
              <div className="bg-white rounded-lg p-3 border border-red-100">
                <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                  <FaComment className="w-3 h-3" />
                  Cancellation Reason
                </p>
                <p className="text-sm text-gray-700">
                  {cancelInfo.reason || cancelInfo.note || 'No reason provided'}
                </p>
              </div>

              {/* Date */}
              {(cancelInfo.cancelledAt || cancelInfo.createdAt) && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaCalendarAlt className="text-red-400" />
                  <span>
                    Cancelled on:{' '}
                    {formatCancelDate(
                      cancelInfo.cancelledAt || cancelInfo.createdAt
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCancellationInfo;
