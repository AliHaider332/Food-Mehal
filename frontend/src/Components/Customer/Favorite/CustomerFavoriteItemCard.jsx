// Components/Favorite/CustomerFavoriteItemCard.jsx
import React, { useState } from 'react';
import {
  FaHeart,
  FaFire,
  FaTrash,
  FaSpinner,
  FaMinus,
  FaPlus,
  FaCheck,
  FaShoppingBag,
} from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import CustomerFavoriteRatingStars from './CustomerFavoriteRatingStars';
import {
  formatPKR,
  getDiscountedPrice,
  calculateSavings,
} from '../../../utils/favoriteUtils';
import { useNavigate } from 'react-router-dom';
import { getAverageRating } from '../RenderStarts';

const CustomerFavoriteItemCard = ({
  item,
  cartQuantity,
  isInCart,
  isAddingToCart,
  onRemove,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart, // Add this new prop
}) => {
  const navigate = useNavigate();
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const discountedPrice = getDiscountedPrice(item);
  const savings = calculateSavings(item);
  
  

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (isInCart) {
      setShowQuantitySelector(true);
    } else {
      onAddToCart(item, e);
    }
  };

  const handleQuantityUpdate = (delta, e) => {
    e.stopPropagation();
    onUpdateQuantity(item, delta, e);
  };

 

  // New function to handle removing item from cart
  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    if (onRemoveFromCart) {
      onRemoveFromCart(item, e);
    } else {
      // Fallback: use onUpdateQuantity to set quantity to 0
      onUpdateQuantity(item, -cartQuantity, e);
    }
    setShowQuantitySelector(false);
  };
  return (
    <div
      onClick={() => {
        navigate(`/customer/item/${item._id}`);
      }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.picture || 'https://via.placeholder.com/400x300'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {item.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 z-10">
            <FaFire className="text-xs" />
            {item.discount}% OFF
          </div>
        )}

        {/* Remove from Favorites Button */}
        <button
          onClick={(e) => onRemove(item._id, e)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50 z-10"
        >
          <FaHeart className="text-red-500 text-lg" />
        </button>

        {/* Cart Status Badge */}
        {isInCart && (
          <div className="absolute top-3 right-16 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 z-10">
            <FaCheck className="text-xs" />
            In Cart ({cartQuantity})
          </div>
        )}

        {/* Rating Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <CustomerFavoriteRatingStars rating={getAverageRating(item.shop)} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-xl text-gray-800 mb-1 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MdRestaurant className="text-orange-500" />
            {item.category || 'Food Item'}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {item.description || 'Delicious food item ready to be enjoyed'}
        </p>

        {/* Price and Cart Section */}
        <div className="flex items-center justify-between mt-4">
          <div>
            {item.discount > 0 ? (
              <>
                <span className="text-2xl font-bold text-orange-600">
                  {formatPKR(discountedPrice)}{' '}
                  <span className="text-md">PKR</span>
                </span>
                <span className="text-sm text-gray-400 line-through ml-2">
                  {formatPKR(item.price)} <span className="text-sm">PKR</span>
                </span>
                <span className="text-xs text-green-600 block">
                  Save {formatPKR(savings)} <span className="text-xm">PKR</span>
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-orange-600">
                {formatPKR(item.price)} <span className="text-md">PKR</span>
              </span>
            )}
          </div>

          {/* Quantity Selector or Add Button */}
          {showQuantitySelector ? (
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={(e) => handleQuantityUpdate(-1, e)}
                disabled={isAddingToCart}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-50"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="w-10 text-center font-semibold text-gray-800">
                {isAddingToCart ? (
                  <FaSpinner className="text-orange-500 animate-spin mx-auto" />
                ) : (
                  cartQuantity
                )}
              </span>
              <button
                onClick={(e) => handleQuantityUpdate(1, e)}
                disabled={isAddingToCart}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-colors disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
              </button>
              <button
                onClick={handleRemoveFromCart} // Changed from handleCloseSelector
                className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                title="Remove from cart"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              disabled={isAddingToCart}
              className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 ${
                isInCart ? 'bg-green-500 from-green-500 to-green-600' : ''
              }`}
            >
              {isAddingToCart ? (
                <FaSpinner className="text-sm animate-spin" />
              ) : (
                <FaShoppingBag className="text-sm" />
              )}
              {isInCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
            </button>
          )}
        </div>

        {/* Quick Note */}
        {isInCart && !showQuantitySelector && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Click button to adjust quantity
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerFavoriteItemCard;
