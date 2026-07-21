/* eslint-disable react-hooks/set-state-in-effect */
// CustomerFavorite.jsx - Main Component
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import useFavorite from '../../../hooks/useFavorite';
import useCart from '../../../hooks/useCart';
import ComponentLoading from '../../ComponentLoading';
// Components
import CustomerFavoriteHeader from './CustomerFavoriteHeader';
import CustomerEmptyFavorite from './CustomerEmptyFavorite';
import CustomerFavoriteGrid from './CustomerFavoriteGrid';

import { FaHeart } from 'react-icons/fa';
import { useGetFavoriteQuery } from '../../../services/customer.api';

const CustomerFavorite = () => {
  const navigate = useNavigate();
  // console.log({ data, isLoading, error });
  const { data, isLoading: loading } = useGetFavoriteQuery();

  const favoriteItems = data?.data || [];

  const { toggleFavorite } = useFavorite();
  const { addToCart, updateQuantity } = useCart();

  const [addingToCartId, setAddingToCartId] = useState(null);

  const handleRemoveFromFavorites = (id, e) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      toast.success('All favorites removed');
    }
  };

  const handleAddToCart = (item, e) => {
    e?.stopPropagation();
    setAddingToCartId(item._id);
    addToCart(item._id);
    setTimeout(() => setAddingToCartId(null), 300);
  };

  const handleUpdateQuantity = (item, delta, e) => {
    e?.stopPropagation();
    setAddingToCartId(item._id);
    updateQuantity(item._id, delta, true);
    setAddingToCartId(null);
  };

  const handleItemClick = (itemId, e) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest('button')) return;
    navigate(`/customer/item/${itemId}`);
  };

  const totalFavorites = favoriteItems?.length || 0;

  if (loading) {
    return <ComponentLoading />;
  }

  if (totalFavorites === 0) {
    return <CustomerEmptyFavorite />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CustomerFavoriteHeader
        totalFavorites={totalFavorites}
        onClearAll={handleClearAllFavorites}
      />
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
          <FaHeart className="text-orange-500" />
          My Favorite
        </h2>
        <p className="text-gray-500 mt-2">{totalFavorites} items</p>
      </div>

      <CustomerFavoriteGrid
        items={favoriteItems}
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
