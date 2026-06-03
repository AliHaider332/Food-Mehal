// components/CustomerSingleOrder.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { TbTruckDelivery } from 'react-icons/tb';
import {
  FaShoppingCart,
  FaReceipt,
  FaClock,
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStore,
  FaBoxOpen,
  FaMotorcycle,
  FaInfoCircle,
  FaCommentAlt,
  FaUser,
  FaStoreAlt,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaRupeeSign,
  FaBoxes,
  FaGift,
  FaHourglassHalf,
  FaUtensils,
} from 'react-icons/fa';
import CustomerSingleOrderCancel from './CustomerSingleOrderCancel';
import CustomerSingleOrderDetail from './CustomerSingleOrderDetail';
import CustomerSingleOrderReview from './CustomerSingleOrderReview';
import CustomerSingleOrderTracking from './CustomerSingleOrderTracking';

// Status Configuration (unchanged)
const getStatusConfig = (status) => {
  const configs = {
    pending: {
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      gradient: 'from-amber-400 to-yellow-500',
      icon: FaHourglassHalf,
      badge: 'Pending',
      description: 'Your order has been placed and is waiting for confirmation',
      progressStep: 1,
    },
    accepted: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      gradient: 'from-blue-400 to-cyan-500',
      icon: FaCheckCircle,
      badge: 'Accepted',
      description:
        'Restaurant has accepted your order and will start preparing soon',
      progressStep: 2,
    },
    preparing: {
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      gradient: 'from-purple-400 to-pink-500',
      icon: FaUtensils,
      badge: 'Preparing',
      description: 'Restaurant is preparing your delicious food',
      progressStep: 3,
    },
    packed: {
      color: 'bg-pink-100 text-pink-800 border-pink-200',
      gradient: 'from-pink-400 to-rose-500',
      icon: FaBoxes,
      badge: 'Ready for Pickup',
      description: 'Your order is packed and ready for pickup',
      progressStep: 4,
    },
    'delivery-accepted': {
      color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      gradient: 'from-cyan-400 to-teal-500',
      icon: FaMotorcycle,
      badge: 'Delivery Assigned',
      description: 'A delivery partner has been assigned to your order',
      progressStep: 5,
    },
    picked: {
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      gradient: 'from-indigo-400 to-purple-500',
      icon: FaBoxOpen,
      badge: 'Picked Up',
      description:
        'Delivery partner has picked up your order and is on the way',
      progressStep: 6,
    },
    'on-the-way': {
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      gradient: 'from-orange-400 to-red-500',
      icon: FaMotorcycle,
      badge: 'On The Way',
      description: 'Your order is on the way to your location',
      progressStep: 7,
    },
    delivered: {
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      gradient: 'from-emerald-400 to-green-500',
      icon: FaCheckCircle,
      badge: 'Delivered',
      description: 'Your order has been delivered successfully',
      progressStep: 8,
    },
    cancelled: {
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      gradient: 'from-rose-400 to-red-500',
      icon: FaTimesCircle,
      badge: 'Cancelled',
      description: 'Order has been cancelled',
      progressStep: 0,
    },
  };
  return configs[status?.toLowerCase()] || configs.pending;
};

// Cancellation Banner Component (responsively improved)
const CancellationBanner = ({ cancelInfo, onClose }) => {
  const isCustomerCancelled = cancelInfo?.role === 'customer';
  const isOwnerCancelled =
    cancelInfo?.role === 'owner' || cancelInfo?.role === 'shop';

  const formatCancelDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 animate-slideDown relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div
            className={`flex-shrink-0 ${
              isCustomerCancelled ? 'bg-orange-100' : 'bg-red-100'
            } rounded-full p-1.5 sm:p-2`}
          >
            {isCustomerCancelled ? (
              <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            ) : isOwnerCancelled ? (
              <FaStoreAlt className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            ) : (
              <FaTimesCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-bold mb-0.5 sm:mb-1 flex items-center gap-2 flex-wrap">
              <span
                className={
                  isCustomerCancelled ? 'text-orange-700' : 'text-red-700'
                }
              >
                Order Cancelled
              </span>
              <span
                className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${
                  isCustomerCancelled
                    ? 'bg-orange-200 text-orange-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {isCustomerCancelled ? 'By You' : 'By Restaurant'}
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-600 mb-2 sm:mb-3">
              {isCustomerCancelled
                ? 'You requested to cancel this order'
                : 'The restaurant cancelled this order'}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
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
          )}
        </div>

        <div className="space-y-2 sm:space-y-3 ml-8 sm:ml-11">
          <div className="bg-white rounded-lg p-2 sm:p-3 border border-red-100">
            <p className="text-[10px] sm:text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
              <FaCommentAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Cancellation Reason
            </p>
            <p className="text-xs sm:text-sm text-gray-700 break-words">
              {cancelInfo?.reason || cancelInfo?.note || 'No reason provided'}
            </p>
          </div>

          {cancelInfo?.cancelledAt && (
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-600 flex-wrap">
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500" />
                <span>
                  Cancelled on: {formatCancelDate(cancelInfo.cancelledAt)}
                </span>
              </div>
            </div>
          )}

          {isOwnerCancelled && (
            <div className="p-2 sm:p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-[10px] sm:text-xs text-yellow-700 flex items-center gap-1">
                <FaInfoCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                If you have any questions, please contact restaurant support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerSingleOrder = ({ order, setExpandedOrder, expandedOrder }) => {
  const [cancelOrder, setCancelOrder] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now - date) / 36e5;

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffHours * 60);
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} hours ago`;
    }

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ur-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatOrderId = (id) => {
    if (!id) return 'N/A';
    return (
      id
        .slice(-8)
        .toUpperCase()
        .match(/.{1,4}/g)
        ?.join('-') || id.slice(-8).toUpperCase()
    );
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const isExpandedView = expandedOrder === order._id;
  const isCancelled = order.status?.toLowerCase() === 'cancelled';

  const getCancelInfo = () => {
    if (!order.cancelOrder) return null;
    const cancelData = order.cancelOrder;
    return {
      reason: cancelData.reason || cancelData.note || 'No reason provided',
      cancelledAt: cancelData.cancelledAt || cancelData.createdAt,
      role: cancelData.role || (cancelData.note ? 'customer' : 'unknown'),
      cancelledBy: cancelData.cancelledBy || cancelData.role,
    };
  };

  const cancelInfo = getCancelInfo();

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Order Header - Professional Design */}
      <div className="group relative overflow-hidden transition-all duration-300">
        {/* Status Gradient Border */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${statusConfig.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        ></div>

        <div className="p-4 sm:px-5 sm:py-5 md:px-6 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-all duration-200 relative z-10">
          <div className="flex flex-col lg:flex-row flex-wrap items-start lg:items-center justify-between gap-3 md:gap-4">
            {/* Order ID & Date - Stack on mobile */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Order ID
                  </p>
                  <p className="font-mono text-xs sm:text-sm font-bold text-gray-800 break-all">
                    #{formatOrderId(order._id)}
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Placed On
                </p>
                <div className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaClock className="text-gray-500 text-[10px] sm:text-xs" />
                  </div>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Restaurant Info - Flexible */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {order.shop?.picture && (
                <img
                  src={order.shop.picture}
                  alt={order.shop.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-orange-200 flex-shrink-0"
                  onError={handleImageError}
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <FaStore className="text-orange-500 text-xs sm:text-sm flex-shrink-0" />
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">
                    {order.shop?.name || 'Restaurant'}
                  </h3>
                </div>
                {order.shop?.location.address && (
                  <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 truncate">
                    <FaMapMarkerAlt className="text-orange-400 text-[8px] sm:text-xs flex-shrink-0" />
                    <span className="truncate">{order.shop.location.address}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Total Amount - Right aligned on larger screens */}
            <div className="text-left lg:text-right w-full lg:w-auto">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Total Amount
              </p>
              <div className="flex items-center gap-1">
                <p
                  className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent ${
                    isCancelled ? 'line-through opacity-50' : ''
                  }`}
                >
                  ₨ {formatCurrency(order.totalAmount)}
                </p>
              </div>
              {isCancelled && (
                <p className="text-[10px] sm:text-xs text-red-500 mt-0.5 sm:mt-1">
                  Order Cancelled
                </p>
              )}
            </div>

            {/* Status Badge Component */}
            <div className="w-full lg:w-auto">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 sm:mb-2 text-center lg:text-left">
                Order Status
              </p>
              <div className="relative group/status flex justify-center lg:justify-start">
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${statusConfig.gradient} rounded-full blur opacity-0 group-hover/status:opacity-50 transition duration-300`}
                ></div>
                <div
                  className={`relative inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold border-2 ${statusConfig.color} shadow-md transition-all hover:scale-105 active:scale-95`}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse bg-current"></div>
                  <StatusIcon className="text-[10px] sm:text-sm md:text-base" />
                  <span className="text-[11px] sm:text-sm whitespace-nowrap">
                    {statusConfig.badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Expand/Collapse Button - Positioned */}
            <div className="absolute top-4 right-4 lg:relative lg:top-0 lg:right-0">
              <button
                onClick={() =>
                  setExpandedOrder(isExpandedView ? null : order._id)
                }
                className="group/btn relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label={
                  isExpandedView ? 'Collapse details' : 'Expand details'
                }
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover/btn:opacity-20 transition duration-300"></div>
                {isExpandedView ? (
                  <FaChevronUp className="text-gray-600 text-sm sm:text-base relative z-10 group-hover/btn:transform group-hover/btn:-translate-y-0.5 transition-transform" />
                ) : (
                  <FaChevronDown className="text-gray-600 text-sm sm:text-base relative z-10 group-hover/btn:transform group-hover/btn:translate-y-0.5 transition-transform" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Date & Time */}
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <FaClock className="text-gray-400 text-xs" />
              <span>Placed: {formatDate(order.createdAt)}</span>
            </div>
          </div>

          {/* Quick Info Chips - Wrap on mobile */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 pt-2 border-t border-gray-100">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 rounded-lg text-[10px] sm:text-xs text-gray-600">
              <FaBoxes className="text-gray-500 text-[10px] sm:text-xs" />
              <span>{order.items?.length || 0} items</span>
            </div>
            {!isCancelled && order.totalSavings > 0 && (
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-green-100 rounded-lg text-[10px] sm:text-xs text-green-700">
                <FaGift className="text-green-600 text-[10px] sm:text-xs" />
                <span>Saved: ₨ {formatCurrency(order.totalSavings)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && !isCancelled && (
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-100 rounded-lg text-[10px] sm:text-xs text-blue-700">
                <FaMotorcycle className="text-blue-600 text-[10px] sm:text-xs" />
                <span>Delivery: ₨ {formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
          </div>

          {/* Cancellation Info Button & Banner */}
          {isCancelled && cancelInfo && (
            <>
              <div className="mt-2 sm:mt-3">
                <button
                  onClick={() => setShowCancelReason(!showCancelReason)}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-red-100 text-red-700 rounded-full text-[10px] sm:text-xs font-medium hover:bg-red-200 transition-colors"
                >
                  <FaInfoCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="truncate">
                    {cancelInfo.role === 'customer'
                      ? 'You cancelled this order'
                      : 'Restaurant cancelled this order'}
                  </span>
                  <svg
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${
                      showCancelReason ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {showCancelReason && (
                <CancellationBanner
                  cancelInfo={cancelInfo}
                  onClose={() => setShowCancelReason(false)}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Expanded Order Details */}
      {isExpandedView && (
        <CustomerSingleOrderDetail
          order={order}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Modals */}
      {cancelOrder && (
        <CustomerSingleOrderCancel
          order={order}
          setCancelOrder={setCancelOrder}
        />
      )}
      {showReviewModal && (
        <CustomerSingleOrderReview order={order} onClose={setShowReviewModal} />
      )}
      {showTracking && (
        <CustomerSingleOrderTracking
          order={order}
          setShowTracking={setShowTracking}
        />
      )}

      {/* Order Footer Actions - Stack on mobile */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => setExpandedOrder(isExpandedView ? null : order._id)}
          className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors text-xs sm:text-sm font-medium"
        >
          {isExpandedView ? 'Hide Details' : 'View Order Details'}
        </button>

        {/* Track Order Button */}
        {(order.status?.toLowerCase() === 'picked' ||
          order.status?.toLowerCase() === 'out for delivery' ||
          order.status?.toLowerCase() === 'on-the-way') && (
          <button
            onClick={() => setShowTracking(!showTracking)}
            className={`flex-1 sm:flex-initial relative px-3 sm:px-5 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden group ${
              showTracking
                ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            <span className="relative z-10 inline-flex items-center gap-1 sm:gap-2">
              {showTracking ? (
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <div className="relative">
                  <FaMotorcycle className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  <span className="absolute inset-0 animate-ping opacity-75">
                    <FaMotorcycle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-300" />
                  </span>
                </div>
              )}
              <span className="font-semibold">
                {showTracking ? 'Hide Tracking' : 'Track Order'}
              </span>
            </span>
          </button>
        )}

        {/* Delivered Order Actions */}
        {order.status?.toLowerCase() === 'delivered' && (
          <>
            <button
              onClick={() => toast.info('Reorder feature coming soon!')}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium"
            >
              Order Again
            </button>
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-xs sm:text-sm font-medium"
            >
              Write a Review
            </button>
          </>
        )}

        {/* Cancel Order Button */}
        {order.status?.toLowerCase() === 'pending' && (
          <button
            onClick={() => setCancelOrder(true)}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-red-50 text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerSingleOrder;
