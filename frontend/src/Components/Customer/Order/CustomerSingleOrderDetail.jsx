// components/CustomerSingleOrderDetail.jsx
import React, { useState } from 'react';
import {
  FaClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaBoxOpen,
  FaBuilding,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaTag,
  FaUser,
  FaStar,
  FaIdCard,
  FaComment,
  FaRegStar,
  FaStarHalfAlt,
  FaTimesCircle,
  FaInfoCircle,
  FaReceipt,
  FaStore,
  FaCalendarAlt,
  FaRupeeSign,
} from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';

const CustomerSingleOrderDetail = ({ order, formatDate, formatCurrency }) => {
  const [showFullReview, setShowFullReview] = useState(false);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
  };

  const getDeliveryBoyInfo = () => {
    if (!order.deliveryBoy) return null;
    if (typeof order.deliveryBoy === 'object') {
      return order.deliveryBoy;
    }
    return {
      _id: order.deliveryBoy,
      name: 'Delivery Partner',
      phone: 'Not available',
    };
  };

  const deliveryBoyInfo = getDeliveryBoyInfo();
  const isCancelled = order.status?.toLowerCase() === 'cancelled';
  const cancelInfo = order.cancelOrder;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
      {/* Cancelled Order Banner */}
      {isCancelled && cancelInfo && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2">
                Order Cancelled
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    cancelInfo.role === 'customer'
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {cancelInfo.role === 'customer'
                    ? 'Cancelled by You'
                    : 'Cancelled by Restaurant'}
                </span>
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {cancelInfo.role === 'customer'
                  ? 'You requested to cancel this order'
                  : 'The restaurant cancelled this order'}
              </p>
              <div className="bg-white rounded-lg p-3 border border-red-100 mt-2">
                <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                  <FaInfoCircle className="w-3 h-3" />
                  Cancellation Reason
                </p>
                <p className="text-sm text-gray-700">
                  {cancelInfo.reason || cancelInfo.note || 'No reason provided'}
                </p>
              </div>
              {cancelInfo.cancelledAt && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <FaCalendarAlt className="w-3 h-3" />
                  Cancelled on: {formatDate(cancelInfo.cancelledAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaBoxOpen className="text-orange-500" />
          Order Items
          {isCancelled && (
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              Order Cancelled
            </span>
          )}
        </h4>
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg p-4 hover:shadow-md transition-shadow ${
                isCancelled ? 'opacity-75' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={
                      item.picture ||
                      'https://via.placeholder.com/100x100?text=No+Image'
                    }
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover shadow-md"
                    onError={handleImageError}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-sm">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-800 font-semibold text-base">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        ₨ {formatCurrency(item.price)} per item
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-gray-800 text-lg ${
                          isCancelled ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        ₨ {formatCurrency(item.total)}
                      </p>
                      {item.originalPrice &&
                        item.originalPrice > item.price &&
                        !isCancelled && (
                          <p className="text-xs text-green-600">
                            Saved: ₨{' '}
                            {formatCurrency(
                              (item.originalPrice - item.price) * item.quantity
                            )}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary - Only show for non-cancelled orders or show cancellation summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`rounded-lg p-3 shadow-sm ${
            isCancelled ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <p className="text-xs text-gray-500 mb-1">Subtotal</p>
          <p
            className={`font-semibold ${
              isCancelled ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}
          >
            ₨ {formatCurrency(order.totalAmount - (order.deliveryFee || 0))}
          </p>
        </div>
        {order.totalSavings > 0 && !isCancelled && (
          <div className="bg-green-50 rounded-lg p-3 shadow-sm">
            <p className="text-xs text-green-600 mb-1 flex items-center gap-1">
              <FaTag className="text-green-500" /> Total Savings
            </p>
            <p className="font-semibold text-green-600">
              -₨ {formatCurrency(order.totalSavings)}
            </p>
          </div>
        )}
        <div
          className={`rounded-lg p-3 shadow-sm ${
            isCancelled ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <p className="text-xs text-gray-500 mb-1">Delivery Fee</p>
          <p
            className={`font-semibold ${
              isCancelled ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}
          >
            ₨ {formatCurrency(order.shop?.deliveryFee || 0)}
          </p>
        </div>
        <div
          className={`rounded-lg p-3 shadow-sm ${
            isCancelled ? 'bg-gray-100' : 'bg-white'
          }`}
        >
          <p className="text-xs text-gray-500 mb-1">Payment Method</p>
          <p
            className={`font-semibold ${
              isCancelled ? 'text-gray-500' : 'text-gray-800'
            } flex items-center gap-1`}
          >
            <FaMoneyBillWave className="text-green-600" />
            Cash on Delivery
          </p>
        </div>
      </div>

      {/* Only show delivery and restaurant info for non-cancelled orders */}
      {!isCancelled && (
        <>
          {/* Delivery Information */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaMotorcycle className="text-orange-500" />
              Delivery Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Delivery Location</p>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500" />
                  <p className="text-sm text-gray-700">
                    {order.deliveryLocation?.coordinates?.length > 0
                      ? `Lat: ${order.deliveryLocation.coordinates[1]?.toFixed(
                          6
                        )}, Lng: ${order.deliveryLocation.coordinates[0]?.toFixed(
                          6
                        )}`
                      : 'Location will be updated soon'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Delivery Status</p>
                <div className="flex items-center gap-2">
                  {order.deliveryBoy ? (
                    <>
                      <FaMotorcycle className="text-orange-500 animate-pulse" />
                      <p className="text-sm text-gray-700">
                        Delivery partner assigned
                      </p>
                    </>
                  ) : (
                    <>
                      <FaClock className="text-yellow-500" />
                      <p className="text-sm text-gray-700">
                        Waiting for delivery partner
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Restaurant Address</p>
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-orange-500" />
                  <p className="text-sm text-gray-700">
                    {order.shop?.location.address || 'Address not specified'}
                  </p>
                </div>
              </div>
              {order.shop?.phone && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Restaurant Contact
                  </p>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-orange-500" />
                    <p className="text-sm text-gray-700">{order.shop.phone}</p>
                  </div>
                </div>
              )}
              {order.shop?.deliveryTime && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Estimated Delivery Time
                  </p>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    <p className="text-sm text-gray-700">
                      {order.shop.deliveryTime.min} -{' '}
                      {order.shop.deliveryTime.max} minutes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Boy Information */}
          {deliveryBoyInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Delivery Partner Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {deliveryBoyInfo.name || 'Delivery Partner'}
                    </p>
                  </div>
                </div>
                {deliveryBoyInfo.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaPhoneAlt className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {deliveryBoyInfo.phone}
                      </p>
                    </div>
                  </div>
                )}
                {deliveryBoyInfo.vehicleNumber && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaIdCard className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Vehicle Number
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {deliveryBoyInfo.vehicleNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* User Review Section - Show even for cancelled orders if review exists */}
      {order.status === 'delivered' &&
        order.reviews &&
        order.reviews.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaComment className="text-purple-600" />
              Your Review
            </h4>
            {order.reviews.map((review, index) => {
              if (review.user === order.user && review.order === order._id) {
                return (
                  <div key={review._id || index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {review.rating}/5
                      </span>
                    </div>
                    {review.comment && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Your Comment
                        </p>
                        <p
                          className={`text-sm text-gray-700 ${
                            !showFullReview && review.comment.length > 150
                              ? 'line-clamp-3'
                              : ''
                          }`}
                        >
                          {review.comment}
                        </p>
                        {review.comment.length > 150 && (
                          <button
                            onClick={() => setShowFullReview(!showFullReview)}
                            className="text-xs text-purple-600 hover:text-purple-700 mt-1 font-medium"
                          >
                            {showFullReview ? 'Show Less' : 'Read More'}
                          </button>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 border-t border-purple-100 pt-2 mt-2">
                      Reviewed on {formatDate(review.createdAt)}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

      {/* Order Timeline - Modified for cancelled orders */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Order Timeline</h4>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-4 relative">
            {/* Order Placed - Always visible */}
            <div className="flex items-start gap-3 relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-gray-800">
                  Order Placed
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Only show timeline for non-cancelled orders */}
            {!isCancelled ? (
              <>
                {/* Pending */}
                {order.status === 'pending' && (
                  <div className="flex items-start gap-3 relative">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center z-10 animate-pulse">
                      <FaClock className="text-white text-sm" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-800">
                        Awaiting Confirmation
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.updatedAt)}
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Restaurant is reviewing your order
                      </p>
                    </div>
                  </div>
                )}

                {/* Accepted */}
                {[
                  'accepted',
                  'preparing',
                  'packed',
                  'delivery-accepted',
                  'picked',
                  'delivered',
                ].includes(order.status) && (
                  <div className="flex items-start gap-3 relative">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-800">
                        Order Accepted
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.updatedAt)}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Restaurant has accepted your order
                      </p>
                    </div>
                  </div>
                )}

                {/* Preparing */}
                {[
                  'preparing',
                  'packed',
                  'delivery-accepted',
                  'picked',
                  'delivered',
                ].includes(order.status) && (
                  <div className="flex items-start gap-3 relative">
                    <div
                      className={`w-8 h-8 ${
                        order.status === 'preparing'
                          ? 'animate-pulse bg-purple-500'
                          : 'bg-purple-500'
                      } rounded-full flex items-center justify-center z-10`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-800">
                        Preparing Your Order
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.updatedAt)}
                      </p>
                      {order.status === 'preparing' && (
                        <p className="text-xs text-purple-600 mt-1">
                          Kitchen is preparing your delicious food
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Packed */}
                {[
                  'packed',
                  'delivery-accepted',
                  'picked',
                  'delivered',
                ].includes(order.status) && (
                  <div className="flex items-start gap-3 relative">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center z-10">
                      <FaBoxOpen className="text-white text-sm" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-800">
                        Order Packed
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.updatedAt)}
                      </p>
                      <p className="text-xs text-indigo-600 mt-1">
                        Your order is ready and packed
                      </p>
                    </div>
                  </div>
                )}

                {/* Delivery Accepted */}
                {['delivery-accepted', 'picked', 'delivered'].includes(
                  order.status
                ) &&
                  order.deliveryBoy && (
                    <div className="flex items-start gap-3 relative">
                      <div
                        className={`w-8 h-8 ${
                          order.status === 'delivery-accepted'
                            ? 'animate-pulse bg-orange-500'
                            : 'bg-orange-500'
                        } rounded-full flex items-center justify-center z-10`}
                      >
                        <FaMotorcycle className="text-white text-sm" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-800">
                          Delivery Partner Assigned
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.updatedAt)}
                        </p>
                        {deliveryBoyInfo && (
                          <p className="text-xs text-orange-600 mt-1">
                            {deliveryBoyInfo.name} is on the way to pickup your
                            order
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Picked */}
                {['picked', 'delivered'].includes(order.status) && (
                  <div className="flex items-start gap-3 relative">
                    <div
                      className={`w-8 h-8 ${
                        order.status === 'picked'
                          ? 'animate-pulse bg-teal-500'
                          : 'bg-teal-500'
                      } rounded-full flex items-center justify-center z-10`}
                    >
                      <TbTruckDelivery className="text-white text-sm" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-800">
                        Order Picked Up
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.updatedAt)}
                      </p>
                      {order.status === 'picked' && (
                        <p className="text-xs text-teal-600 mt-1">
                          Delivery partner has picked up your order
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivered */}
                {order.status === 'delivered' && (
                  <div className="flex items-start gap-3 relative">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-800">
                        Delivered
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.updatedAt)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Order successfully delivered! Enjoy your meal
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Cancelled timeline
              <>
                {/* Cancelled Status */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center z-10">
                    <FaTimesCircle className="text-white text-sm" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-red-600">
                      Order Cancelled
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(cancelInfo?.cancelledAt || order.updatedAt)}
                    </p>
                    <div className="mt-2 p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600 font-medium">
                        Cancellation Details:
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">Reason:</span>{' '}
                        {cancelInfo?.reason ||
                          cancelInfo?.note ||
                          'Not specified'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">Cancelled by:</span>{' '}
                        {cancelInfo?.role === 'customer' ? 'You' : 'Restaurant'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Refund Information for Cancelled Orders */}
      {isCancelled && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-1">
                Refund Information
              </h4>
              <p className="text-xs text-green-700">
                Your payment of{' '}
                <span className="font-bold">
                  ₨ {formatCurrency(order.totalAmount)}
                </span>{' '}
                will be refunded within 5-7 business days.
              </p>
              <p className="text-xs text-green-600 mt-2">
                The refund will be credited to your original payment method.
                Contact support if you have any questions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSingleOrderDetail;
