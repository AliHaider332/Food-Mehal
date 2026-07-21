import React, { useCallback, useMemo } from 'react';
import { FaCheck, FaShoppingBag } from 'react-icons/fa';
import { renderRatingStars } from '../RenderStarts';


const formatPKR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return new Intl.NumberFormat('ur-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};




const RecommendedItemCard = React.memo(({ item, onCardClick, isInCart, cartQuantity }) => {
  const discountedPrice = useMemo(() => {
    return item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price;
  }, [item.price, item.discount]);

  const hasDiscount = item.discount > 0;

  const avgRating = useMemo(() => {
    if (!item.shop?.reviews?.length) return 0;
    const sum = item.shop.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / item.shop.reviews.length;
  }, [item.shop?.reviews]);

  const totalReviews = item.shop?.reviews?.length || 0;

  const handleClick = useCallback(() => {
    onCardClick(item._id);
  }, [item._id, onCardClick]);

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
      role="button"
      tabIndex={0}
      aria-label={`View ${item.name}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.picture || 'https://via.placeholder.com/400x300'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            {item.discount}% OFF
          </div>
        )}
        <button
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-orange-500 hover:text-white transition-all duration-200 transform hover:scale-110"
          aria-label={`Add ${item.name} to cart`}
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
            <div className="flex items-center gap-0.5">{renderRatingStars(avgRating)}</div>

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
});
export default RecommendedItemCard;
