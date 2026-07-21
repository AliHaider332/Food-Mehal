import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingBag,
  FaFire,
  FaArrowLeft,
  FaClock,
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaStore,
  FaUtensils,
  FaCheck,
  FaEye,
  FaRegClock,
  FaDollarSign,
  FaInfoCircle,
  FaTag,
  FaShoppingCart,
  FaPlus,
  FaMinus,
} from 'react-icons/fa';
import { MdRestaurant, MdVerified } from 'react-icons/md';
import { toast } from 'react-toastify';
import useFavorite from '../../hooks/useFavorite';
import useCart from '../../hooks/useCart';
import { axiosInstance } from '../../Config/axios';
import CustomerSingleShopReviewSlider from './CustomerSingleShopReviewSlider';


// Separate Item Card Component for better performance
const ShopItemCard = React.memo(({
  item,
  onItemClick,
  onFavoriteToggle,
  onAddToCart,
  onUpdateQuantity,
  isFavorite,
  getItemQuantity,
  isInCart,
  formatPrice,
  getDiscountedPrice
}) => {
  const discountedPrice = getDiscountedPrice(item.price, item.discount);
  const isFav = isFavorite(item._id);
  const inCart = isInCart(item._id);
  const cartQuantity = getItemQuantity(item._id);
  const discountPercent = item.discount || 0;
  const originalPrice = item.price || 0;
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAddingToCart(true);
    await onAddToCart(item);
    setAddingToCart(false);
  };

  const handleUpdateQuantity = (quantity, e) => {
    e.stopPropagation();
    onUpdateQuantity(item, quantity);
  };

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-food.jpg';
  };

  return (
    <div
      onClick={() => onItemClick(item._id)}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={item.picture}
          alt={item.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <FaFire className="text-xs" />
            {discountPercent}% OFF
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => onFavoriteToggle(item, e)}
            className="bg-white/95 hover:bg-white p-2.5 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <FaHeart
              className={`text-lg ${isFav ? 'text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-xs font-medium">
          <MdRestaurant className="inline mr-1 text-orange-400" />
          {item.category}
        </div>


      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg group-hover:text-orange-500 transition-colors line-clamp-1 mb-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
          {item.description || 'No description available'}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-orange-600">
                {formatPrice(discountedPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-xs text-green-600 font-medium mt-0.5 flex items-center gap-1">
                <FaTag className="text-xs" />
                Save {formatPrice(originalPrice - discountedPrice)}
              </span>
            )}
          </div>

          {item.isAvailable && (
            <div className="flex items-center gap-2">
              {inCart && cartQuantity > 0 ? (
                <div className="flex items-center gap-2 bg-orange-50 rounded-xl p-1">
                  <button
                    onClick={(e) => handleUpdateQuantity(-1, e)}
                    className="bg-white text-orange-600 hover:bg-orange-100 w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="font-semibold text-gray-800 min-w-[24px] text-center">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={(e) => handleUpdateQuantity(1, e)}
                    className="bg-white text-orange-600 hover:bg-orange-100 w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 flex items-center gap-2 text-sm font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingBag className="text-xs" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const CustomerSingleShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggleFavorite, isFavorite } = useFavorite();
  const { addToCart, updateQuantity, getItemQuantity, isInCart } = useCart();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch shop details
  useEffect(() => {
    fetchShopDetails();
  }, [id]);

  const fetchShopDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`customer/shop/${id}`);
      setShop(response.data.shop);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching shop:', error);

      let errorMessage = 'Failed to load shop details';
      if (error.response?.status === 404) {
        errorMessage = 'Shop not found';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied to this shop';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later';
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountedPrice = useCallback((price, discount) => {
    if (discount && discount > 0) {
      return price - (price * discount) / 100;
    }
    return price || 0;
  }, []);

  // Format price in PKR
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  }, []);

  // Calculate average rating from reviews
  const getAverageRating = useCallback(() => {
    if (!shop?.reviews || shop.reviews.length === 0) return 0;
    const total = shop.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / shop.reviews.length).toFixed(1);
  }, [shop]);

  // Render rating stars based on numeric rating
  const renderRatingStars = useCallback((rating) => {
    const stars = [];
    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-yellow-300 text-sm" />
      );
    }
    return stars;
  }, []);

  const handleAddToCart = useCallback(async (item) => {
    try {
      addToCart(item._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, [addToCart]);

  const handleUpdateQuantity = useCallback((item, quantity) => {
    updateQuantity(item._id, quantity);
  }, [updateQuantity]);

  const handleItemClick = useCallback((itemId) => {
    navigate(`/customer/item/${itemId}`);
  }, [navigate]);

  const handleFavoriteToggle = useCallback((item, e) => {
    e.stopPropagation();
    toggleFavorite(item._id);
  }, [toggleFavorite]);

  const handleViewCart = useCallback(() => {
    navigate('/customer/cart');
  }, [navigate]);

  const cartItemsCount = useMemo(() => {
    // Calculate from your cart hook if available
    return 0; // Replace with actual cart count from your cart state
  }, []);

  // Memoize items rendering
  const renderedItems = useMemo(() => {
    if (items.length === 0) return null;

    return items.map((item) => (
      <ShopItemCard
        key={item._id}
        item={item}
        onItemClick={handleItemClick}
        onFavoriteToggle={handleFavoriteToggle}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        isFavorite={isFavorite}
        getItemQuantity={getItemQuantity}
        isInCart={isInCart}
        formatPrice={formatPrice}
        getDiscountedPrice={getDiscountedPrice}
      />
    ));
  }, [items, handleItemClick, handleFavoriteToggle, handleAddToCart, handleUpdateQuantity, isFavorite, getItemQuantity, isInCart, formatPrice, getDiscountedPrice]);

  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaStore className="text-orange-500 text-3xl animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium text-lg">
              Loading shop details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaStore className="text-4xl text-red-500" />
              </div>
              <p className="text-gray-500 text-lg">{error || 'Shop not found'}</p>
              <p className="text-gray-400 text-sm mt-2">
                The shop you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const avgRating = getAverageRating();
  const totalReviews = shop.reviews?.length || 0;

  return (
    <div className="min-h-screen ">
      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <button
          onClick={handleViewCart}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 flex items-center gap-3 group animate-bounce-slow hover:scale-105"
        >
          <div className="relative">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartItemsCount}
            </span>
          </div>
          <span className="font-semibold">View Cart</span>
        </button>
      )}

      {/* Hero Section with Shop Banner */}
      <div className="relative h-64 md:h-80 lg:h-[420px] overflow-hidden">
        <img
          src={shop.picture || '/images/default-shop-banner.jpg'}
          alt={shop.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/default-shop-banner.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg transition-all duration-200 font-medium"
        >
          <FaArrowLeft className="text-sm" />
          Back
        </button>



        {/* Shop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {shop.isOpen ? (
                    <span className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold shadow-sm">
                      <FaRegClock className="text-xs" />
                      Open Now
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold shadow-sm">
                      <FaRegClock className="text-xs" />
                      Closed
                    </span>
                  )}
                  {shop.isActive && (
                    <span className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold shadow-sm">
                      <MdVerified className="text-sm" />
                      Verified
                    </span>
                  )}
                  {shop.deliveryFee === 0 && (
                    <span className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold shadow-sm">
                      <FaTruck className="text-xs" />
                      Free Delivery
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
                  {shop.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90">
                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {renderRatingStars(avgRating)}
                    <span className="ml-1 font-medium">{avgRating}</span>
                    <span className="text-white/70">
                      ({totalReviews}{' '}
                      {totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <FaMapMarkerAlt className="text-orange-400" />
                    <span>{shop.location?.address || 'Address not available'}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info Cards */}
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 text-center shadow-lg border border-white/20">
                  <div className="text-xs text-white/80 mb-1 flex items-center justify-center gap-1">
                    <FaDollarSign className="text-xs" />
                    Min Order
                  </div>
                  <div className="font-bold text-lg">
                    {formatPrice(shop.minOrderAmount)}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 text-center shadow-lg border border-white/20">
                  <div className="text-xs text-white/80 mb-1 flex items-center justify-center gap-1">
                    <FaTruck className="text-xs" />
                    Delivery Fee
                  </div>
                  <div className="font-bold text-lg">
                    {shop.deliveryFee === 0
                      ? 'Free'
                      : formatPrice(shop.deliveryFee)}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 text-center shadow-lg border border-white/20">
                  <div className="text-xs text-white/80 mb-1 flex items-center justify-center gap-1">
                    <FaClock className="text-xs" />
                    Delivery Time
                  </div>
                  <div className="font-bold text-lg">
                    {shop.deliveryTime?.min}-{shop.deliveryTime?.max} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Shop Description & Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            <div className="lg:col-span-2 p-6 md:p-8">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <FaInfoCircle className="text-orange-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    About {shop.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {shop.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <FaUtensils className="text-orange-500 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Cuisines
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {shop.cuisines?.length > 0 ? (
                      shop.cuisines.map((cuisine, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-semibold capitalize"
                        >
                          {cuisine}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No cuisines specified</span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaPhone className="text-orange-500" />
                      <span className="font-mono">{shop.phone || 'Not available'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
              Our Menu
            </h2>
            <p className="text-gray-500">
              Explore our delicious dishes crafted with love and the finest
              ingredients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              {items.length} {items.length === 1 ? 'item' : 'items'} available
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaUtensils className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No items available
              </h3>
              <p className="text-gray-500">
                This shop hasn't added any menu items yet
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderedItems}
          </div>
        )}

        {/* Reviews Section */}
        {shop.reviews && shop.reviews.length > 0 && (
          <CustomerSingleShopReviewSlider reviews={shop.reviews} />
        )}

        {/* Order Info Footer */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-1.5 rounded-full">
                <FaDollarSign className="text-orange-500 text-sm" />
              </div>
              <span>
                Minimum order:{' '}
                <strong className="text-orange-600">
                  {formatPrice(shop.minOrderAmount)}
                </strong>
              </span>
            </div>
            {shop.deliveryFee > 0 && (
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-1.5 rounded-full">
                  <FaTruck className="text-orange-500 text-sm" />
                </div>
                <span>
                  Delivery fee:{' '}
                  <strong className="text-orange-600">
                    {formatPrice(shop.deliveryFee)}
                  </strong>
                </span>
              </div>
            )}
            {shop.deliveryTime && (
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-1.5 rounded-full">
                  <FaClock className="text-orange-500 text-sm" />
                </div>
                <span>
                  Est. delivery:{' '}
                  <strong className="text-orange-600">
                    {shop.deliveryTime.min}-{shop.deliveryTime.max} minutes
                  </strong>
                </span>
              </div>
            )}
            {shop.deliveryFee === 0 && (
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <FaCheck className="text-emerald-500 text-sm" />
                </div>
                <span className="text-emerald-600 font-medium">
                  Free Delivery
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CustomerSingleShop);
