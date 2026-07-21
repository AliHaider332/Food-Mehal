// Components/Cart/CustomerCartItem.jsx
import React, { useState, useEffect } from 'react';
import {
  FaFire,
  FaMinus,
  FaPlus,
  FaTrash,
  FaSpinner,
  FaGift,
  FaLeaf,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import {
  formatPKR,
  hasDiscount,
  getDiscountedPrice,
} from '../../../utils/cartUtils';

const CustomerCartItem = ({
  item,
  processingItem,
  onQuantityChange,
  onRemove,
}) => {
  // Use id or _id for the item identifier
  const itemId = item.id || item._id;
  const isProcessing = processingItem === itemId;

  // Local state for optimistic UI updates
  const [localQuantity, setLocalQuantity] = useState(item.quantity || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Update local quantity when item prop changes
  useEffect(() => {
    if (!isProcessing) {
      setLocalQuantity(item.quantity || 0);
      setIsUpdating(false);
    }
  }, [item.quantity, isProcessing]);

  // Handle quantity change with optimistic update
  const handleQuantityChange = async (delta, e) => {
    e?.stopPropagation();

    if (!itemId) {
      return;
    }

    const newQuantity = localQuantity + delta;
    if (newQuantity < 1) return;

    // Optimistic update - update UI immediately
    setLocalQuantity(newQuantity);
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      await onQuantityChange(itemId, delta, e);
      // Show success state briefly
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      // Revert on error
      setLocalQuantity(item.quantity || 0);
      setIsUpdating(false);
      setUpdateSuccess(false);
    }
  };

  // Calculate prices
  const discountActive = hasDiscount(item);
  const discountedPrice = getDiscountedPrice(item);
  const savings = (item.price - discountedPrice) * (localQuantity || 0);
  const itemTotal = discountedPrice * (localQuantity || 0);

  if (!itemId) {
    console.error('Item missing ID:', item);
    return null;
  }

  return (
    <div
      className={`p-5 hover:bg-orange-50/30 transition-colors relative 
      ${isUpdating ? 'opacity-80' : 'opacity-100'}`}
    >
      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-2xl">
          <div className="bg-white shadow-xl rounded-full p-3">
            <FaSpinner className="animate-spin text-orange-500 text-2xl" />
          </div>
        </div>
      )}

      {/* Success indicator */}
      {updateSuccess && !isUpdating && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-500 text-white rounded-full p-1 shadow-lg animate-bounce">
            <FaCheckCircle className="text-sm" />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Image Section */}
        <div className="relative sm:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={item.picture || 'https://via.placeholder.com/400x300'}
            alt={item.name || 'Food item'}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300';
            }}
          />
          {discountActive && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-lg">
              <FaFire className="text-xs" /> {item.discount}% OFF
            </div>
          )}
          {item.isVegetarian && (
            <div className="absolute bottom-2 left-2 bg-green-500/90 text-white px-2 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1">
              <FaLeaf className="text-xs" /> Veg
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <h4 className="font-bold text-lg text-gray-800 truncate">
                {item.name || 'Unnamed Item'}
              </h4>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MdRestaurant className="text-orange-500 flex-shrink-0" />
                <span className="truncate">{item.category || 'Food Item'}</span>
              </p>
              {item.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-md">
                  {item.description}
                </p>
              )}
            </div>
            <button
              onClick={(e) => onRemove(itemId, item.name, localQuantity, e)}
              disabled={isUpdating}
              className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-200 hover:scale-110 flex-shrink-0 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove item"
            >
              {isUpdating ? (
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
                  onClick={(e) => handleQuantityChange(-1, e)}
                  disabled={isUpdating || localQuantity <= 1}
                  className={`w-9 h-9 bg-white rounded-full hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    localQuantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaMinus className="text-xs" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">
                  {localQuantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(1, e)}
                  disabled={isUpdating}
                  className="w-9 h-9 bg-white rounded-full hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {formatPKR(item.price || 0)}
                  </span>
                )}
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right bg-gradient-to-r from-gray-50 to-orange-50 px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-500">Item Total</p>
              <p className="text-xl font-bold text-gray-800">
                {formatPKR(itemTotal)}
              </p>
              {discountActive && savings > 0 && (
                <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                  <FaGift /> Save {formatPKR(savings)}
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
