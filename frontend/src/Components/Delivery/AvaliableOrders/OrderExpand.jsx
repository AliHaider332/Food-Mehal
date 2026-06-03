import React from 'react';
import { BsCashStack } from 'react-icons/bs';
import { FiMapPin } from 'react-icons/fi';
import { IoMdSpeedometer } from 'react-icons/io';
import { MdOutlineShoppingBag } from 'react-icons/md';

const OrderExpand = ({ order ,earnings}) => {
  return (
    <div className="border-t border-gray-100 p-6 bg-gray-50/50 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Items */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
            <MdOutlineShoppingBag className="w-5 h-5 text-blue-600" />
            Order Items ({order?.items.length})
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {order?.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  {item.picture && (
                    <img
                      src={item.picture}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      ₨{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  ₨{item.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-lg">
            Order Summary
          </h4>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">
                  ₨{(order.totalAmount + (order.totalSavings || 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  ₨{order.deliveryFee?.toFixed(2) || '0.00'}
                </span>
              </div>
              {order.totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Total Savings</span>
                  <span className="font-semibold">
                    - ₨{order.totalSavings.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-bold text-blue-600 text-xl">
                    ₨{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <IoMdSpeedometer className="text-blue-600" />
                <span className="text-xs text-gray-600 font-semibold">
                  Delivery Time
                </span>
              </div>
              <p className="font-bold text-blue-700">
                {order.shop.deliveryTime.min}-{order.shop.deliveryTime.max} min
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <BsCashStack className="text-green-600" />
                <span className="text-xs text-gray-600 font-semibold">
                  Your Earnings
                </span>
              </div>
              <p className="font-bold text-green-700">
                ₨{earnings?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Delivery Location */}
          {order.deliveryLocation?.address && (
            <div className="mt-3 bg-purple-50 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs text-purple-600 font-semibold mb-1">
                    Delivery Location
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.deliveryLocation.address}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderExpand;
