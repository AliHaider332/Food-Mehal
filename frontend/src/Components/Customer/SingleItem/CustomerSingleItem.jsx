/* eslint-disable react-hooks/exhaustive-deps */
// CustomerSingleItem.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaShoppingBag,
  FaFire,
  FaMinus,
  FaPlus,
  FaCheck,
  FaArrowLeft,
  FaClock,
  FaTruck,
  FaUtensils,
  FaShieldAlt,
  FaStore,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { toast } from 'react-toastify';
import useFavorite from '../../../hooks/useFavorite';
import useCart from '../../../hooks/useCart';
import { useGetSingleItemQuery, useGetRecommendedItemsQuery } from '../../../services/customer.api';
import { renderRatingStars } from '../RenderStarts';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import NotFound from './NotFound';
import RecommendedItemCard from './RecommendedItemCard';
import ReviewSection from './ReviewSection';
// Constants
const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

// Helper function - NO HOOKS HERE
const formatPKR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return new Intl.NumberFormat('ur-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};




// Main Component
const CustomerSingleItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('description');
  const [localQuantity, setLocalQuantity] = useState(1);

  // RTK Query hooks
  const {
    data: item,
    isLoading: isItemLoading,
    isError: isItemError,
    error: itemError,
    refetch: refetchItem,
  } = useGetSingleItemQuery(id, {
    skip: !id,
  });

  const { data: recommendations, isLoading: isRecLoading } = useGetRecommendedItemsQuery(
    {
      itemId: id,
      limit: 10,
    },
    {
      skip: !id || isItemLoading,
    }
  );

  // Custom hooks
  const { toggleFavorite, isFavorite } = useFavorite();
  const { getItemQuantity, isInCart, updateQuantity } = useCart();

  // Memoized values
  const isFav = isFavorite(id);
  const cartQuantity = getItemQuantity(id);
  const inCart = isInCart(id);

  // Sync local quantity with cart quantity
  useEffect(() => {
    if (cartQuantity > 0) {
      setLocalQuantity(cartQuantity);
    } else {
      setLocalQuantity(1);
    }
  }, [cartQuantity]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoized price calculations
  const discountedPrice = useMemo(() => {
    if (item?.discount > 0) {
      return item.price - (item.price * item.discount) / 100;
    }
    return item?.price || 0;
  }, [item?.price, item?.discount]);

  const totalPrice = useMemo(() => {
    return discountedPrice * localQuantity;
  }, [discountedPrice, localQuantity]);

  const savings = useMemo(() => {
    if (item?.discount > 0) {
      return (item.price - discountedPrice) * localQuantity;
    }
    return 0;
  }, [item?.price, item?.discount, discountedPrice, localQuantity]);

  const shopRating = useMemo(() => {
    if (!item?.shop?.reviews?.length) return 0;
    const sum = item.shop.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / item.shop.reviews.length;
  }, [item?.shop?.reviews]);

  const totalReviews = item?.shop?.reviews?.length || 0;
  const deliveryTime = item?.shop?.deliveryTime || { min: 25, max: 45 };
  const deliveryFee = item?.shop?.deliveryFee || 149.98;

  // Filter out current item from recommendations
  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.filter((recItem) => recItem._id !== item?._id);
  }, [recommendations, item]);

  // Handlers
  const handleQuantityChange = useCallback(
    (delta) => {
      const newQuantity = localQuantity + delta;
      if (newQuantity >= MIN_QUANTITY && newQuantity <= MAX_QUANTITY) {
        setLocalQuantity(newQuantity);
        updateQuantity(id, delta);
      }
    },
    [localQuantity, id, updateQuantity]
  );

  const handleBuyNow = useCallback(() => {
    navigate('/customer/cart');
  }, [navigate]);

  const handleFavoriteToggle = useCallback(() => {
    if (item) {
      toggleFavorite(item._id);
    }
  }, [item, toggleFavorite]);

  const handleItemClick = useCallback(
    (itemId) => {
      navigate(`/customer/item/${itemId}`);
    },
    [navigate]
  );

  const handleRetry = useCallback(() => {
    refetchItem();
  }, [refetchItem]);

  // Loading state
  if (isItemLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (isItemError) {
    return <ErrorDisplay error={itemError} onRetry={handleRetry} />;
  }

  // Not found state
  if (!item) {
    return <NotFound navigate={navigate} />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-8 transition-colors"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
          <span>Continue Shopping</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative group top-8">
              <img
                src={item.picture}
                alt={item.name}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {item.discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg">
                  {item.discount}% OFF
                  <FaFire className="text-sm" />
                </div>
              )}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transform -rotate-6">
                    Currently Unavailable
                  </div>
                </div>
              )}
              <button
                onClick={handleFavoriteToggle}
                className="absolute top-4 right-4 bg-white/95 hover:bg-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaHeart className={`text-xl ${isFav ? 'text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-5">
            {/* Title and Category */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 flex-wrap">
                <MdRestaurant className="text-orange-500 text-lg" />
                <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full text-orange-600 text-xs font-semibold">
                  {item.category || 'Premium Food'}
                </span>
                {item.shop?.isOpen !== false && (
                  <span className="px-3 py-1 bg-green-100 rounded-full text-green-700 text-xs font-semibold flex items-center gap-1">
                    <FaCheck className="text-xs" /> Available
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3 leading-tight">
                {item.name}
              </h1>

              {/* Rating Section */}
              <div className="flex items-center gap-3 flex-wrap">
                {shopRating > 0 ? (
                  <>
                    <div className="flex items-center gap-0.5">{renderRatingStars(shopRating)}</div>
                    <span className="text-sm text-gray-500">
                      ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">No ratings yet</span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="border-t border-b border-gray-200 py-4 bg-gradient-to-r from-orange-50/50 to-transparent px-4 rounded-xl">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl lg:text-5xl font-bold text-orange-600">
                  Rs. {formatPKR(discountedPrice)}
                </span>
                {item.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      Rs. {formatPKR(item.price)}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save Rs. {formatPKR((item.price * item.discount) / 100)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              {['description', 'restaurant', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold transition-all capitalize ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'reviews' ? `Reviews (${totalReviews})` : tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'description' && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {item.description ||
                      'Delicious food item prepared with the finest ingredients by our expert chefs. Perfect for any occasion and sure to satisfy your cravings.'}
                  </p>
                </div>
              )}

              {activeTab === 'restaurant' && item.shop && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                      <FaStore className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{item.shop.name}</h3>
                      <div className="flex items-center gap-0.5">
                        {renderRatingStars(shopRating)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span className="text-gray-600">
                        {item.shop.address || 'Location not specified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaClock className="text-orange-500" />
                      <span className="text-gray-600">
                        Delivery: {deliveryTime.min}-{deliveryTime.max} min
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaTruck className="text-orange-500" />
                      <span className="text-gray-600">
                        Delivery Fee: Rs. {formatPKR(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FaShoppingBag className="text-orange-500" />
                      <span className="text-gray-600">
                        Min Order: Rs. {formatPKR(item.shop.minOrderAmount)}
                      </span>
                    </div>
                    {item.shop.description && (
                      <div className="flex items-start gap-3 text-sm">
                        <FaInfoCircle className="text-orange-500 mt-0.5" />
                        <span className="text-gray-600">{item.shop.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && <ReviewSection reviews={item.shop?.reviews || []} />}
            </div>

            {/* Quantity Selector */}
            {item.isAvailable !== false && (
              <>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-3" htmlFor="quantity">
                    Select Quantity
                  </label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={localQuantity <= MIN_QUANTITY}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-orange-500 hover:text-white text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span
                        className="w-16 text-center font-bold text-gray-800 text-xl"
                        id="quantity"
                      >
                        {localQuantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={localQuantity >= MAX_QUANTITY}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-orange-500 hover:text-white text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    {inCart && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                        <FaCheck className="text-sm" />
                        <span className="text-sm font-bold">{cartQuantity} in cart</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 shadow-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="font-semibold text-white">Rs. {formatPKR(totalPrice)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-400">You Save:</span>
                        <span className="text-green-400 font-bold">-Rs. {formatPKR(savings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                      <span className="text-lg font-bold text-white">Total Amount:</span>
                      <span className="text-3xl font-bold text-orange-400">
                        Rs. {formatPKR(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none border border-orange-600"
                    aria-label="Buy now"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}

            {item.isAvailable === false && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <FaUtensils className="text-2xl text-red-500" />
                  </div>
                  <p className="text-red-600 font-bold text-lg">Currently Unavailable</p>
                  <p className="text-red-500 text-sm">Check back later for availability</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="flex justify-center gap-6 text-xs text-gray-500 pt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-500" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStore className="text-green-500" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        {!isRecLoading && filteredRecommendations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">You might also like</h2>
                <p className="text-gray-500 text-sm mt-1">Discover more delicious options</p>
              </div>
              <button
                onClick={() => navigate('/customer/menu')}
                className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                aria-label="View all items"
              >
                View All
                <FaArrowLeft className="rotate-180 text-xs" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRecommendations.slice(0, 4).map((recItem) => (
                <RecommendedItemCard
                  key={recItem._id}
                  item={recItem}
                  onCardClick={handleItemClick}
                  isInCart={isInCart(recItem._id)}
                  cartQuantity={getItemQuantity(recItem._id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #ea580c, #c2410c);
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default React.memo(CustomerSingleItem);
