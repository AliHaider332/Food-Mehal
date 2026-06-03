// components/OrderCard.jsx
import React from 'react';
import {
  FiMapPin,
  FiPackage,
  FiClock,
  FiNavigation,
  FiMap,
  FiCheckCircle,
  FiLoader,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { MdOutlineShoppingBag, MdDeliveryDining } from 'react-icons/md';
import { GiTakeMyMoney } from 'react-icons/gi';
import { BsShop, BsCashStack } from 'react-icons/bs';

import OrderExpand from './OrderExpand';
const OrderCard = ({
  order,
  distance,
  earnings,
  onViewRoute,
  onAccept,
  acceptingOrderId,
  isExpanded,
  onToggleExpand,
}) => {
  const getBadgeColor = (distance) => {
    if (distance < 1) return 'bg-green-100 text-green-800';
    if (distance < 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const isThisOrderAccepting = acceptingOrderId === order._id;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative">
      {/* Loading Overlay */}
      {isThisOrderAccepting && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm font-semibold text-gray-800">
              Accepting Order...
            </p>
          </div>
        </div>
      )}

      {/* Main Row */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Shop Info */}
        <div className="lg:w-80 relative bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
          {order.shop.picture && (
            <img
              src={order.shop.picture}
              alt={order.shop.name}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <BsShop className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">
                  {order.shop.name}
                </h3>
                <div className="flex gap-1 mt-1">
                  {order.shop.cuisines?.slice(0, 2).map((cuisine, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-blue-100 bg-white/10 px-2 py-0.5 rounded-full"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-blue-100">
              <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm line-clamp-2">
                {order.shop.location.address}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section - Order Summary */}
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className={`${getBadgeColor(
                  distance
                )} px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5`}
              >
                <FiNavigation className="w-4 h-4" />
                {distance} km from you
              </div>
              {earnings && (
                <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                  <BsCashStack className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    Earn ₨{earnings.toFixed(0)}
                  </span>
                </div>
              )}
            </div>
            <span
              className={`bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5`}
            >
              <FiPackage className="w-3 h-3" />
              <span className="capitalize">{order.status}</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm mb-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-600">
              <MdOutlineShoppingBag className="w-4 h-4" />
              <span className="font-medium">{order.items.length} items</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <FiClock className="w-4 h-4" />
              <span className="font-medium">
                {order.shop.deliveryTime.min}-{order.shop.deliveryTime.max} min
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <GiTakeMyMoney className="w-4 h-4" />
              <span className="font-medium">
                ₨{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Items:</span>
            {order.items.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 text-xs bg-gray-100 px-2.5 py-1 rounded-full"
              >
                <span className="font-semibold text-gray-700">
                  {item.quantity}x
                </span>
                <span className="text-gray-600 truncate max-w-[120px]">
                  {item.name}
                </span>
              </div>
            ))}
            {order.items.length > 3 && (
              <span className="text-xs text-blue-600 font-medium">
                +{order.items.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="lg:w-64 p-5 bg-gray-50 flex flex-col justify-between">
          <div className="text-center mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Delivery Fee
            </p>
            <p className="font-bold text-gray-900 text-2xl">
              ₨{order.shop.deliveryFee?.toFixed(2) || '0.00'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewRoute(order)}
              disabled={isThisOrderAccepting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              <FiMap className="w-4 h-4" />
              Route
            </button>
            <button
              onClick={() => onAccept(order._id)}
              disabled={isThisOrderAccepting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isThisOrderAccepting ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <MdDeliveryDining className="w-4 h-4" />
              )}
              Accept
            </button>
          </div>

          <button
            onClick={onToggleExpand}
            className="mt-3 p-1.5 hover:bg-gray-200 rounded-lg transition-all w-full flex items-center justify-center gap-1 text-xs text-gray-500"
            disabled={isThisOrderAccepting}
          >
            {isExpanded ? (
              <>
                Show Less <FiChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show Details <FiChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && <OrderExpand order={order} earnings={earnings} />}
    </div>
  );
};

export default OrderCard;
