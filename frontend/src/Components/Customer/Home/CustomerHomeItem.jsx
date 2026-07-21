import React, { useMemo, useState, useEffect } from 'react';
import useCart from '../../../hooks/useCart';
import useFavorite from '../../../hooks/useFavorite';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingBag,
  FaTruck,
  FaFire,
  FaSpinner,
  FaPlus,
  FaMinus,
  FaSearch,
  FaTimes,
  FaLeaf,
  FaPepperHot,
  FaAward,
  FaSplotch,
} from 'react-icons/fa';
import {
  MdDeliveryDining,
  MdRestaurant,
  MdVerified,
  MdEmojiFoodBeverage,
} from 'react-icons/md';
import { GiTakeMyMoney, GiChickenOven } from 'react-icons/gi';
import { getAverageRating, renderRatingStars } from '../RenderStarts';
import CustomerFavoriteRatingStars from '../Favorite/CustomerFavoriteRatingStars';

const CustomerHomeItem = ({ filteredItems }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorite();
  const navigate = useNavigate();

  const getDiscountedPrice = (item) => {
    if (!item) return 0;
    if (item.discount && item.discount > 0) {
      return item.price - (item.price * item.discount) / 100;
    }
    return item.price || 0;
  };

  const getCategoryIcon = (category) => {
    const categoryLower = (category || '').toLowerCase();
    if (categoryLower.includes('chicken') || categoryLower.includes('karahi'))
      return <GiChickenOven className="text-orange-500" />;
    if (categoryLower.includes('curry'))
      return <FaSplotch className="text-orange-500" />;
    return <MdEmojiFoodBeverage className="text-orange-500" />;
  };

  const getDiscountBadgeStyle = (discount) => {
    if (discount >= 40) return 'from-red-600 to-red-500';
    if (discount >= 25) return 'from-red-500 to-orange-500';
    if (discount >= 10) return 'from-orange-500 to-orange-400';
    return 'from-orange-400 to-orange-300';
  };

  // Deduplicate items by _id
  const uniqueItems = useMemo(() => {
    if (
      !filteredItems ||
      !Array.isArray(filteredItems) ||
      filteredItems.length === 0
    ) {
      return [];
    }

    // Use Map to keep only unique items by _id
    const itemMap = new Map();
    filteredItems.forEach((item) => {
      if (item && item._id && !itemMap.has(item._id)) {
        itemMap.set(item._id, item);
      }
    });

    const unique = Array.from(itemMap.values());

    // Log if duplicates were found for debugging
    if (unique.length !== filteredItems.length) {
      console.warn(
        `CustomerHomeItem: Removed ${
          filteredItems.length - unique.length
        } duplicate items. ` +
          `Original: ${filteredItems.length}, Unique: ${unique.length}`
      );

      // Log duplicate IDs for debugging
      const seen = new Set();
      const duplicates = [];
      filteredItems.forEach((item) => {
        if (item?._id) {
          if (seen.has(item._id)) {
            duplicates.push(item._id);
          }
          seen.add(item._id);
        }
      });
      if (duplicates.length > 0) {
        console.error('Duplicate _id values found:', [...new Set(duplicates)]);
      }
    }

    return unique;
  }, [filteredItems]);

  // Safely handle null/undefined
  if (!uniqueItems || uniqueItems.length === 0) {
    return (
      <div className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Popular Dishes
          </h2>
          <p className="text-gray-500">No items available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16">
      {/* Header Section with Decorative Elements */}
      <div className="mb-10 text-center relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-20 h-1 bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Popular Dishes
        </h2>
        <p className="text-gray-500">Browse our delicious collection</p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {uniqueItems.map((item, idx) => {
          // Add error handling for each item
          try {
            if (!item || !item._id) {
              console.error('Invalid item at index:', idx, item);
              return null;
            }

            // Create a unique key combining _id and index as fallback
            const uniqueKey = `${item._id}-${idx}`;

            // Get quantity from cart (only ID stored)
            const quantity = getItemQuantity(item._id);
            const isFav = isFavorite(item._id);
            const discountedPrice = getDiscountedPrice(item);
            const savings = item.price - discountedPrice;
            const hasDiscount = item.discount && item.discount > 0;
            const avgRating = getAverageRating(item?.shop);

            return (
              <div
                key={uniqueKey}
                onClick={() => navigate(`item/${item._id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer group animate-fade-in relative"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.picture || '/placeholder-image.jpg'}
                    alt={item.name || 'Food item'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10">
                      <div
                        className={`bg-gradient-to-r ${getDiscountBadgeStyle(
                          item.discount
                        )} text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transform -rotate-3`}
                      >
                        <FaFire className="text-xs animate-pulse" />
                        {item.discount}% OFF
                      </div>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item._id);
                    }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200 z-10"
                  >
                    {isFav ? (
                      <FaHeart className="text-red-500 text-lg" />
                    ) : (
                      <FaRegHeart className="text-gray-600 text-lg" />
                    )}
                  </button>

                  {/* Rating Overlay at Bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <FaStar className="text-white text-[10px]" />
                          <span>{avgRating}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {renderRatingStars(avgRating)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-white/80 text-xs">
                        <FaClock size={10} />
                        <span>
                          {item.shop?.deliveryTime?.min || 20}-
                          {item.shop?.deliveryTime?.max || 40} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Item Name and Restaurant */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-xl text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors duration-300">
                        {item.name || 'Unnamed Item'}
                      </h3>
                      {item.isVegetarian && (
                        <FaLeaf className="text-green-500 text-sm flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-5 h-5 bg-orange-50 rounded-full flex items-center justify-center">
                        <MdRestaurant className="text-orange-500 text-xs" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        {item.shop?.name || 'Restaurant'}
                      </p>
                      {item.shop?.isOpen && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-semibold">
                          Open
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {item.description ||
                      'A delicious dish prepared with authentic spices and fresh ingredients.'}
                  </p>

                  {/* Category and Spice Level */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                      {getCategoryIcon(item.category)}
                      <span className="text-xs text-gray-600 font-medium">
                        {item.category || 'Main Course'}
                      </span>
                    </div>
                    {item.spiceLevel && (
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                        <FaPepperHot className="text-red-400 text-xs" />
                        <span className="text-xs text-gray-600 font-medium capitalize">
                          {item.spiceLevel}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price and Cart Section */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div>
                      {hasDiscount ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-orange-600">
                              Rs. {discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              Rs. {item.price?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              Save Rs. {savings.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-orange-600">
                          Rs. {item.price?.toFixed(2) || '0.00'}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls - uses only item ID */}
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1 shadow-inner">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item._id, -1);
                          }}
                          className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center shadow-sm"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="font-bold text-gray-800 min-w-[24px] text-center text-lg">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item._id, 1);
                          }}
                          className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center shadow-sm"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                    ) : (
                      // Add to cart - only needs item ID
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item._id, 1);
                        }}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 group/btn"
                      >
                        <FaShoppingBag className="text-sm group-hover/btn:animate-bounce" />
                        <span className="text-sm">Add</span>
                      </button>
                    )}
                  </div>

                  {/* Delivery Info Tag */}
                  <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <FaTruck size={10} />
                      <span>Delivery Rs. {item.shop?.deliveryFee || 50}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GiTakeMyMoney size={10} />
                      <span>Min. Rs. {item.shop?.minOrderAmount || 100}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-orange-400/0 group-hover:border-orange-400/30 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          } catch (error) {
            console.error('Error rendering item:', item, error);
            return null;
          }
        })}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .group/btn:hover .group-hover/btn:animate-bounce {
          animation: bounce 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CustomerHomeItem;
