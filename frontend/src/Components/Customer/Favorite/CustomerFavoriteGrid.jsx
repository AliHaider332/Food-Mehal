// Components/Favorite/CustomerFavoriteGrid.jsx
import React from 'react';
import CustomerFavoriteItemCard from './CustomerFavoriteItemCard';
import useCart from '../../../hooks/useCart';
import { useSelector } from 'react-redux';

const CustomerFavoriteGrid = ({
  items,
  addingToCartId,
  onRemove,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const { getItemQuantity, isInCart } = useCart();
  const favIds = useSelector((state) => state.auth.user.favorite);
  // console.log(favIds);

  const favoriteItems = items.filter((item) => favIds.includes(item._id));
  // console.log(favoriteItems);
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteItems.map((item) => (
        <CustomerFavoriteItemCard
          key={item._id}
          item={item}
          cartQuantity={getItemQuantity(item._id) || 0}
          isInCart={isInCart(item._id) || false}
          onRemove={onRemove}
          isAddingToCart={addingToCartId === item._id}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
};

export default CustomerFavoriteGrid;
