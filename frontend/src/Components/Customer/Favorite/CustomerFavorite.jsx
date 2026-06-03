// CustomerFavorite.jsx - Main Component
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAllFavorites } from '../../../Store/user/user.favorite.item.slice';
import useFavorite from '../../../hooks/useFavorite';
import useCart from '../../../hooks/useCart';
import ComponentLoading from '../../ComponentLoading';
// Components
import CustomerFavoriteHeader from './CustomerFavoriteHeader';
import CustomerEmptyFavorite from './CustomerEmptyFavorite';
import CustomerFavoriteGrid from './CustomerFavoriteGrid';

// utils
import {
  getCartQuantityMap,
  getIsInCartMap,
} from '../../../utils/favoriteUtils';
import { FaHeart } from 'react-icons/fa';

const CustomerFavorite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: favoriteItems, loading } = useSelector(
    (state) => state.favorites
  );
  const { removeFromFavorites } = useFavorite();
  const { addToCart, updateQuantity, getItemQuantity, isInCart } = useCart();

  const [removingId, setRemovingId] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);

  const handleRemoveFromFavorites = (id, e) => {
    e.stopPropagation();
    setRemovingId(id);
    removeFromFavorites(id, e);
    toast.success('Removed from favorites');
    setRemovingId(null);
  };

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      dispatch(clearAllFavorites());
      toast.success('All favorites removed');
    }
  };

  const handleAddToCart = (item, quantity = 1, e) => {
    e?.stopPropagation();
    setAddingToCartId(item._id);
    addToCart(item, quantity);
    setTimeout(() => setAddingToCartId(null), 300);
  };

  const handleUpdateQuantity = (item, delta, e) => {
    e?.stopPropagation();
    setAddingToCartId(item._id);
    updateQuantity(item._id, delta, true);
    setTimeout(() => setAddingToCartId(null), 300);
  };

  const handleItemClick = (itemId, e) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest('button')) return;
    navigate(`/user/item/${itemId}`);
  };

  const totalFavorites = favoriteItems?.length || 0;

  // Precompute cart data for all items
  const cartQuantities = getCartQuantityMap(favoriteItems, getItemQuantity);
  const isInCartMap = getIsInCartMap(favoriteItems, isInCart);

  if (loading) {
    return <ComponentLoading />;
  }

  if (totalFavorites === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 favorite-scrollbar">
        <CustomerEmptyFavorite />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 favorite-scrollbar">
      <CustomerFavoriteHeader
        totalFavorites={totalFavorites}
        onClearAll={handleClearAllFavorites}
      />
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
          <FaHeart className="text-orange-500" />
          My Favorite
        </h2>
      </div>

      <CustomerFavoriteGrid
        items={favoriteItems}
        cartQuantities={cartQuantities}
        isInCartMap={isInCartMap}
        removingId={removingId}
        addingToCartId={addingToCartId}
        onRemove={handleRemoveFromFavorites}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onItemClick={handleItemClick}
      />
    </div>
  );
};

export default CustomerFavorite;
