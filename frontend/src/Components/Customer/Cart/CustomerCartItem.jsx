// Components/Cart/CustomerCartItem.jsx
import React from 'react';
import {
  FaFire,
  FaMinus,
  FaPlus,
  FaTrash,
  FaSpinner,
  FaGift,
} from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import {
  formatPKR,
  hasDiscount,
  getDiscountedPrice,
  getItemSavings,
} from '../../../utils/cartutils';

const CustomerCartItem = ({
  item,
  processingItem,
  onQuantityChange,
  onRemove,
}) => {
  const isProcessing = processingItem === item._id;
  const discountActive = hasDiscount(item);
  const discountedPrice = getDiscountedPrice(item);
  const savings = getItemSavings(item) * item.quantity;
  const itemTotal = discountedPrice * item.quantity;

  return (
    <div className="p-5 hover:bg-orange-50/30 transition-colors">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Image Section */}
        <div className="relative sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={item.picture || 'https://via.placeholder.com/400x300'}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          {discountActive && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-lg">
              <FaFire className="text-xs" /> {item.discount}% OFF
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MdRestaurant className="text-orange-500" />
                {item.category || 'Food Item'}
              </p>
              {item.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-md">
                  {item.description.substring(0, 80)}...
                </p>
              )}
            </div>
            <button
              onClick={(e) => onRemove(item._id, item.name, item.quantity, e)}
              disabled={isProcessing}
              className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-200 hover:scale-110"
            >
              {isProcessing ? (
                <FaSpinner className="animate-spin text-red-500" />
              ) : (
                <FaTrash className="text-red-500 text-sm" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap justify-between items-end mt-4 gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <button
                  onClick={(e) => onQuantityChange(item._id, -1, e)}
                  disabled={isProcessing}
                  className="w-9 h-9 bg-white rounded-full hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <FaMinus className="text-xs" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">
                  {isProcessing ? (
                    <FaSpinner className="animate-spin mx-auto" />
                  ) : (
                    item.quantity
                  )}
                </span>
                <button
                  onClick={(e) => onQuantityChange(item._id, 1, e)}
                  disabled={isProcessing}
                  className="w-9 h-9 bg-white rounded-full hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <FaPlus className="text-xs" />
                </button>
              </div>

              {/* Price Display */}
              <div className="px-3 py-1 bg-orange-50 rounded-full">
                {discountActive ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-orange-600">
                      {formatPKR(discountedPrice)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPKR(item.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-orange-600">
                    {formatPKR(item.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right bg-gradient-to-r from-gray-50 to-orange-50 px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-500">Item Total</p>
              <p className="text-xl font-bold text-gray-800">
                {formatPKR(itemTotal)} PKR
              </p>
              {discountActive > 0 && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <FaGift /> Save {formatPKR(savings)} PKR
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCartItem;
