// components/SellerOrderCard.jsx
import React, { useState } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaTruck, 
  FaStar,
  FaComment,
  FaTimesCircle,
  FaCheckCircle
} from 'react-icons/fa';
import SellerOrderHeader from './SellerOrderHeader';
import SellerOrderCardItems from './SellerOrderCardItems';
import SellerOrderProgress from './SellerOrderProgress';
import SellerOrderActions from './SellerOrderActions';
import SellerDeliveryBoyInfo from './SellerDeliveryBoyInfo';
import SellerHandoffMessage from './SellerHandoffMessage';
import SellerOrderReviews from './SellerOrderReviews';
import SellerCancellationInfo from './SellerCancellationInfo';
import { formatPrice } from '../../../utils/formatPrice';
const SellerOrderCard = ({ order, updatingOrderId, onUpdateStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  

  const isHandledByDelivery = ['packed', 'delivery-accepted', 'picked', 'on-the-way'].includes(order.status);
  const isFinalStatus = ['delivered', 'cancelled'].includes(order.status);
  const isCancelled = order.status === 'cancelled';
  const hasReviews = order.reviews && order.reviews.length > 0;
  const hasCancellationInfo = order.cancelOrder;

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!order.reviews || order.reviews.length === 0) return 0;
    const sum = order.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / order.reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border ${
      isCancelled ? 'border-red-200' : 'border-gray-100'
    }`}>
      {/* Order Header (Always Visible) */}
      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <SellerOrderHeader order={order}  isExpanded={isExpanded} />
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 animate-fadeIn">
          {/* Cancellation Info Banner for Cancelled Orders */}
          {isCancelled && hasCancellationInfo && (
            <SellerCancellationInfo cancelInfo={order.cancelOrder} formatDate={order.updatedAt} />
          )}

          {/* Order Items */}
          <SellerOrderCardItems order={order}/>

          {/* Delivery Location */}
          {order.deliveryLocation?.coordinates && !isCancelled && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaTruck className="text-gray-400" />
                <span className="font-medium">Delivery Location:</span>
                <span className="text-gray-500">{order.deliveryLocation.coordinates.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Savings Info */}
          {order.totalSavings > 0 && !isCancelled && (
            <div className="px-6 py-3 bg-green-50 border-t border-green-100">
              <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Customer saved: {formatPrice(order.totalSavings)}
              </p>
            </div>
          )}

          {/* Reviews Section - Only for delivered orders */}
          {order.status === 'delivered' && (
            <div className="border-t border-gray-100">
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FaComment className="text-purple-600" />
                    <span className="font-semibold text-gray-700">Customer Reviews</span>
                  </div>
                  {hasReviews && (
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-xs ${
                              i < Math.floor(averageRating)
                                ? 'text-yellow-400'
                                : i < averageRating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 ml-1">
                        ({order.reviews.length})
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {showReviews ? 'Hide' : 'View'} reviews
                  </span>
                  {showReviews ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </div>
              </button>
              
              {showReviews && (
                <SellerOrderReviews reviews={order.reviews} formatPrice={formatPrice} />
              )}
            </div>
          )}

          {/* Order Progress Timeline - Only for non-cancelled orders */}
          {!isCancelled && (
            <SellerOrderProgress currentStatus={order.status} />
          )}
          
          {/* Handoff Message (when packed) - Only for non-cancelled */}
          {order.status === 'packed' && !isCancelled && <SellerHandoffMessage />}

          {/* Delivery Boy Info - Only for non-cancelled */}
          {(order.status === 'delivery-accepted' || order.status === 'picked' || order.status === 'on-the-way') && 
            order.deliveryBoy && !isCancelled && (
              <SellerDeliveryBoyInfo 
                deliveryBoy={order.deliveryBoy} 
                showDeliveryInfo={showDeliveryInfo}
                setShowDeliveryInfo={setShowDeliveryInfo}
                orderId={order._id}
              />
            )}

          {/* Order Actions - Only for non-cancelled and non-delivered */}
          {!isHandledByDelivery && !isFinalStatus && !isCancelled && (
            <SellerOrderActions 
              order={order}
              updatingOrderId={updatingOrderId}
              onUpdateStatus={onUpdateStatus}
            />
          )}

          {/* Delivery Handling Info - Only for active orders being handled */}
          {isHandledByDelivery && !isFinalStatus && !isCancelled && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaTruck className="text-orange-500 animate-pulse" />
                <span>Order is being handled by delivery partner</span>
              </div>
            </div>
          )}

          {/* Cancelled Order Footer Message */}
          {isCancelled && (
            <div className="bg-red-50 px-6 py-3 border-t border-red-100">
              <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                <FaTimesCircle className="text-red-500" />
                <span>This order has been cancelled. No further actions are available.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerOrderCard;