// components/SellerOrderCardItems.jsx
import React, { useState } from 'react';
import { FaShoppingCart, FaImage, FaPercent, FaBox } from 'react-icons/fa';
import { formatPrice } from '../../../utils/formatPrice';

const SellerOrderCardItems = ({ order }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/30">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2.5">
        <div className="p-1.5 bg-orange-100 rounded-lg">
          <FaShoppingCart className="text-orange-500 text-sm" />
        </div>
        <span>Order Items</span>
        <span className="ml-auto text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </span>
      </h4>

      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200"
          >
            {/* Product Image Section */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                {!imageError ? (
                  <img
                    src={item.picture}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaImage className="text-2xl" />
                  </div>
                )}
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-gray-300">×</span>
                    <span className="text-sm font-medium text-gray-700">
                      {item.quantity} pcs
                    </span>
                  </div>
                  {item.discount > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                        <FaPercent className="text-green-600 text-xs" />
                        <span className="text-xs font-medium text-green-700">
                          {item.discount}% OFF
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(item.total)}
                  </p>
                  {item.discount > 0 && (
                    <p className="text-xs text-gray-400 line-through mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-5 pt-4 border-t-2 border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <FaBox className="text-gray-400" />
            <span className="text-sm">Total Items:</span>
            <span className="font-semibold text-gray-800">
              {order.items.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Subtotal:</span>
            <span className="font-bold text-gray-900 text-lg">
              {formatPrice(
                order.items.reduce((sum, item) => sum + item.total, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderCardItems;
