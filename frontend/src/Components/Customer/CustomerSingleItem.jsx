// CustomerSingleItem.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingBag,
  FaFire,
  FaSpinner,
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
} from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { toast } from 'react-toastify';
import useFavorite from '../../hooks/useFavorite';
import useCart from '../../hooks/useCart';
import { axiosInstance } from '../../Config/axios';

// Helper function to format PKR
const formatPKR = (amount) => {
  return new Intl.NumberFormat('ur-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// Rating Stars Component
const RatingStars = ({ rating, size = 'sm', showNumber = true }) => {
  const numRating = Number(rating) || 0;
  const clampedRating = Math.min(Math.max(numRating, 0), 5);
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;

  const sizeClass =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => {
        const starNumber = index + 1;

        if (starNumber <= fullStars) {
          return (
            <FaStar key={index} className={`text-yellow-400 ${sizeClass}`} />
          );
        }

        if (hasHalfStar && starNumber === fullStars + 1) {
          return (
            <FaStarHalfAlt
              key={index}
              className={`text-yellow-400 ${sizeClass}`}
            />
          );
        }

        return (
          <FaRegStar key={index} className={`text-gray-300 ${sizeClass}`} />
        );
      })}
      {showNumber && numRating > 0 && (
        <span
          className={`font-semibold ml-1 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          } text-gray-700`}
        >
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-32 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-gray-200 rounded-2xl h-96"></div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Not Found Component
const NotFound = ({ navigate }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FaUtensils className="text-4xl text-red-500" />
        </div>
        <p className="text-gray-500 text-lg">Item not found</p>
        <p className="text-gray-400 text-sm mt-2">
          The item you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

// Recommended Item Card
const RecommendedItemCard = ({
  item,
  onCardClick,
  onAddToCart,
  isInCart,
  cartQuantity,
  formatPKR,
}) => {
  const discountedPrice =
    item.discount > 0
      ? item.price - (item.price * item.discount) / 100
      : item.price;
  const hasDiscount = item.discount > 0;

  // Calculate average rating from reviews
  const calculateAvgRating = () => {
    if (!item.shop?.reviews?.length) return 0;
    const sum = item.shop.reviews.reduce(
      (acc, review) => acc + (review.rating || 0),
      0
    );
    return sum / item.shop.reviews.length;
  };

  const avgRating = calculateAvgRating();
  const totalReviews = item.shop?.reviews?.length || 0;

  return (
    <div
      onClick={() => onCardClick(item._id)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.picture || 'https://via.placeholder.com/400x300'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            {item.discount}% OFF
          </div>
        )}
        <button
          onClick={(e) => onAddToCart(item, e)}
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-orange-500 hover:text-white transition-all duration-200 transform hover:scale-110"
        >
          <FaShoppingBag className="text-sm" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {item.category || 'Food'}
          </span>
          {isInCart && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
              <FaCheck className="text-xs" />
              {cartQuantity} in cart
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">
          {item.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description?.substring(0, 80) || 'Delicious food item'}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-orange-600">
              Rs. {formatPKR(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through ml-2">
                Rs. {formatPKR(item.price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
            <RatingStars rating={avgRating} size="sm" showNumber={false} />
            <span className="text-xs font-semibold text-gray-700">
              {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
            </span>
          </div>
        </div>
        {totalReviews > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        )}
      </div>
    </div>
  );
};

// Review Component
const ReviewSection = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to review this item
        </p>
      </div>
    );
  }

  const totalRating = reviews.reduce(
    (sum, review) => sum + (review.rating || 0),
    0
  );
  const avgRating = totalRating / reviews.length;
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating]++;
    }
  });

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800">
              {avgRating.toFixed(1)}
            </div>
            <RatingStars rating={avgRating} size="lg" />
            <p className="text-xs text-gray-500 mt-1">
              {reviews.length} reviews
            </p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star];
              const percentage =
                reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-gray-600">{star}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-gray-500 text-xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {review.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {review.user?.name || 'Anonymous'}
                  </p>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerSingleItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { toggleFavorite, isFavorite } = useFavorite();
  const { addToCart, getItemQuantity, isInCart, updateQuantity } = useCart();

  const cartQuantity = getItemQuantity(id);
  const inCart = isInCart(id);
  const isFav = isFavorite(id);

  useEffect(() => {
    fetchItemDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/user/item/${id}`);
      // ✅ Get existing history
      let clickedHistory =
        JSON.parse(localStorage.getItem('foodClicked')) || [];

      // ✅ Avoid duplicates (optional but recommended)
      if (!clickedHistory.includes(id)) {
        clickedHistory.push(id);
      }

      // ✅ Limit size (optional e.g. last 20 items)
      if (clickedHistory.length > 20) {
        clickedHistory.shift(); // remove oldest
      }

      // ✅ Save back
      localStorage.setItem('foodClicked', JSON.stringify(clickedHistory));

      setItem(response.data.item);
      setRecommendedItems(response.data.recommended || []);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!item) return;
    setAddingToCart(true);

    if (inCart) {
      updateQuantity(item._id, quantity, true);
      toast.success(`Updated ${item.name} quantity`);
    } else {
      addToCart(item, quantity);
      toast.success(`Added ${quantity} x ${item.name} to cart`);
    }

    setTimeout(() => setAddingToCart(false), 300);
  };

  const handleBuyNow = () => {
    if (!item) return;
    if (!inCart) {
      addToCart(item, quantity);
    } else {
      updateQuantity(item._id, cartQuantity + quantity, true);
    }
    navigate('/customer/cart');
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(item);
  };

  const handleRecommendedItemClick = (itemId) => {
    navigate(`/customer/item/${itemId}`);
    window.scrollTo(0, 0);
  };

  const handleAddRecommendedToCart = (recommendedItem, e) => {
    e.stopPropagation();
    addToCart(recommendedItem, 1);
    toast.success(`Added ${recommendedItem.name} to cart`);
  };

  // Calculate prices
  const getDiscountedPrice = () => {
    if (item?.discount > 0) {
      return item.price - (item.price * item.discount) / 100;
    }
    return item?.price || 0;
  };

  const getTotalPrice = () => {
    return getDiscountedPrice() * quantity;
  };

  const getSavings = () => {
    if (item?.discount > 0) {
      return (item.price - getDiscountedPrice()) * quantity;
    }
    return 0;
  };

  // Calculate shop rating from reviews
  const calculateShopRating = () => {
    if (!item?.shop?.reviews?.length) return 0;
    const sum = item.shop.reviews.reduce(
      (acc, review) => acc + (review.rating || 0),
      0
    );
    return sum / item.shop.reviews.length;
  };

  const shopRating = calculateShopRating();
  const totalReviews = item?.shop?.reviews?.length || 0;
  const deliveryTime = item?.shop?.deliveryTime || { min: 25, max: 45 };
  const deliveryFee = item?.shop?.deliveryFee || 149.98;

  // Filter out current item from recommendations
  const filteredRecommendations = recommendedItems.filter(
    (recItem) => recItem._id !== item?._id
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!item) {
    return <NotFound navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-all group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative group sticky top-8">
              <img
                src={item.picture}
                alt={item.name}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
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
              >
                <FaHeart
                  className={`text-xl ${
                    isFav ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
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
                    <RatingStars rating={shopRating} size="sm" />
                    <span className="text-sm text-gray-500">
                      ({totalReviews}{' '}
                      {totalReviews === 1 ? 'review' : 'reviews'})
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
                  Rs. {formatPKR(getDiscountedPrice())}
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
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === 'description'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('restaurant')}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === 'restaurant'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Restaurant
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === 'reviews'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({totalReviews})
              </button>
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
                      <h3 className="font-bold text-gray-800">
                        {item.shop.name}
                      </h3>
                      <RatingStars rating={shopRating} size="sm" />
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
                        <span className="text-gray-600">
                          {item.shop.description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <ReviewSection reviews={item.shop?.reviews || []} />
              )}
            </div>

            {/* Quantity Selector */}
            {item.isAvailable !== false && (
              <>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Select Quantity
                  </label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-orange-500 hover:text-white text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-16 text-center font-bold text-gray-800 text-xl">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 99}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-orange-500 hover:text-white text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    {inCart && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                        <FaCheck className="text-sm" />
                        <span className="text-sm font-bold">
                          {cartQuantity} in cart
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 shadow-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="font-semibold text-white">
                        Rs. {formatPKR(getTotalPrice())}
                      </span>
                    </div>
                    {getSavings() > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-400">You Save:</span>
                        <span className="text-green-400 font-bold">
                          -Rs. {formatPKR(getSavings())}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                      <span className="text-lg font-bold text-white">
                        Total Amount:
                      </span>
                      <span className="text-3xl font-bold text-orange-400">
                        Rs. {formatPKR(getTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
                  >
                    {addingToCart ? (
                      <FaSpinner className="text-lg animate-spin" />
                    ) : (
                      <FaShoppingBag className="text-lg" />
                    )}
                    {inCart ? 'Update Cart' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none border border-gray-700"
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
                  <p className="text-red-600 font-bold text-lg">
                    Currently Unavailable
                  </p>
                  <p className="text-red-500 text-sm">
                    Check back later for availability
                  </p>
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
        {filteredRecommendations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  You might also like
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Discover more delicious options
                </p>
              </div>
              <button
                onClick={() => navigate('/customer/menu')}
                className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
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
                  onCardClick={handleRecommendedItemClick}
                  onAddToCart={handleAddRecommendedToCart}
                  isInCart={isInCart(recItem._id)}
                  cartQuantity={getItemQuantity(recItem._id)}
                  formatPKR={formatPKR}
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

export default CustomerSingleItem;
