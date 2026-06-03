// components/SellerOrderHeader.jsx
import React from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUtensils,
  FaBoxes,
  FaMotorcycle,
  FaTruck,
  FaStore,
  FaHourglassHalf,
  FaUserCheck,
  FaBoxOpen,
  FaGift,
} from 'react-icons/fa';
import { formatPrice } from '../../../utils/formatPrice';
const SellerOrderHeader = ({ order, isExpanded }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-purple-100 text-purple-800 border-purple-200',
      packed: 'bg-pink-100 text-pink-800 border-pink-200',
      'delivery-accepted': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      picked: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'on-the-way': 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FaHourglassHalf,
      accepted: FaCheckCircle,
      preparing: FaUtensils,
      packed: FaBoxes,
      'delivery-accepted': FaUserCheck,
      picked: FaBoxOpen,
      'on-the-way': FaMotorcycle,
      delivered: FaGift,
      cancelled: FaTimesCircle,
    };
    const IconComponent = icons[status] || FaStore;
    return <IconComponent className="text-base" />;
  };

  const getStatusBadge = (status) => {
    const labels = {
      pending: 'Pending',
      accepted: 'Accepted',
      preparing: 'Preparing',
      packed: 'Ready for Pickup',
      'delivery-accepted': 'Delivery Assigned',
      picked: 'Picked Up',
      'on-the-way': 'On The Way',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  const getStatusGradient = (status) => {
    const gradients = {
      pending: 'from-amber-400 to-yellow-500',
      accepted: 'from-blue-400 to-cyan-500',
      preparing: 'from-purple-400 to-pink-500',
      packed: 'from-pink-400 to-rose-500',
      'delivery-accepted': 'from-cyan-400 to-teal-500',
      picked: 'from-indigo-400 to-purple-500',
      'on-the-way': 'from-orange-400 to-red-500',
      delivered: 'from-emerald-400 to-green-500',
      cancelled: 'from-rose-400 to-red-500',
    };
    return gradients[status] || 'from-gray-400 to-gray-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.abs(now - date) / 36e5;

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffHours * 60);
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} hours ago`;
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const StatusIcon = getStatusIcon(order.status);
  const statusGradient = getStatusGradient(order.status);
  const statusColor = getStatusColor(order.status);

  return (
    <div className="group relative overflow-hidden transition-all duration-300">
      {/* Status Gradient Border */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${statusGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-all duration-200 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Order ID & Date */}
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Order ID
                </p>
                <p className="font-mono text-sm font-bold text-gray-800">
                  #{formatOrderId(order._id)}
                </p>
              </div>
            </div>

            <div className="hidden md:block">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Placed On
              </p>
              <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaClock className="text-gray-500 text-xs" />
                </div>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total Amount
            </p>
            <div className="flex items-center gap-1">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 text-center md:text-left">
              Current Status
            </p>
            <div className="relative group/status">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${statusGradient} rounded-full blur opacity-0 group-hover/status:opacity-50 transition duration-300`}
              ></div>
              <div
                className={`relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusColor} shadow-md`}
              >
                <div
                  className={`w-2 h-2 rounded-full animate-pulse bg-current`}
                ></div>
                {StatusIcon}
                <span>{getStatusBadge(order.status)}</span>
              </div>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            className="group/btn relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover/btn:opacity-20 transition duration-300"></div>
            {isExpanded ? (
              <FaChevronUp className="text-gray-600 relative z-10 group-hover/btn:transform group-hover/btn:-translate-y-0.5 transition-transform" />
            ) : (
              <FaChevronDown className="text-gray-600 relative z-10 group-hover/btn:transform group-hover/btn:translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>

        {/* Mobile Date & Time */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaClock className="text-gray-400" />
            <span>Placed: {formatDate(order.createdAt)}</span>
          </div>
        </div>

        {/* Quick Info Chips */}
        <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
            <FaBoxes className="text-gray-500 text-xs" />
            <span>{order.items?.length || 0} items</span>
          </div>
          {order.status !== 'cancelled' && order.totalSavings > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 rounded-lg text-xs text-green-700">
              <FaGift className="text-green-600 text-xs" />
              <span>Saved: {formatPrice(order.totalSavings)}</span>
            </div>
          )}
          {order.deliveryFee > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-lg text-xs text-blue-700">
              <FaTruck className="text-blue-600 text-xs" />
              <span>Delivery: {formatPrice(order.deliveryFee)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrderHeader;
