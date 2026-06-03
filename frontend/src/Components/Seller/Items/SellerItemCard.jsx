// components/SellerItemCard.jsx
import React, { useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEdit, FaTag, FaPercent, FaFire, FaRupeeSign } from 'react-icons/fa';

const SellerItemCard = ({ item, onEditItem, onDeleteItem }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate discounted price
  const hasDiscount = item.discount && item.discount > 0;
  const discountedPrice = hasDiscount
    ? item.price - (item.price * item.discount) / 100
    : item.price;
  const savings = hasDiscount ? item.price - discountedPrice : 0;

  // Format price in PKR
  const formatPKR = (price) => {
    return Math.round(price).toLocaleString();
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <img
            src={item.picture}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold shadow-md ${
              item.isAvailable !== false
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {item.isAvailable !== false ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <FaFire className="text-xs" />
              <span>{item.discount}% OFF</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-orange-500 font-medium flex items-center gap-1 mt-1">
                <FaTag className="text-xs" />
                <span className="truncate">{item.category}</span>
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mt-2 line-clamp-2 min-h-[40px]">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          {/* Price Section */}
          <div className="mb-4">
            {hasDiscount ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-baseline gap-0.5">
                    <FaRupeeSign className="text-xl" />
                    {formatPKR(discountedPrice)}
                    <span className="text-xs font-normal text-gray-500 ml-0.5">
                      PKR
                    </span>
                  </span>
                  <span className="text-sm text-gray-400 line-through flex items-baseline gap-0.5">
                    ₨{formatPKR(item.price)}
                    <span className="text-xs">PKR</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <FaPercent className="text-xs" />
                    Save ₨{formatPKR(savings)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-baseline gap-0.5">
                  <FaRupeeSign className="text-xl" />
                  {formatPKR(item.price)}
                  <span className="text-xs font-normal text-gray-500 ml-0.5">
                    PKR
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons - Perfect Alignment */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditItem(item)}
              className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 group"
              title="Edit Item"
            >
              <FaEdit className="text-base group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button
              onClick={() => onDeleteItem(item)}
              className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 group"
              title="Delete Item"
            >
              <MdDeleteOutline className="text-lg group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
};

export default SellerItemCard;
