// Components/Favorite/CustomerFavoriteGrid.jsx
import React from 'react';
import CustomerFavoriteItemCard from './CustomerFavoriteItemCard';

const CustomerFavoriteGrid = ({
  items,
  cartQuantities,
  isInCartMap,
  removingId,
  addingToCartId,
  onRemove,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <CustomerFavoriteItemCard
          key={item._id}
          item={item}
          cartQuantity={cartQuantities[item._id] || 0}
          isInCart={isInCartMap[item._id] || false}
          isRemoving={removingId === item._id}
          isAddingToCart={addingToCartId === item._id}
          onRemove={onRemove}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
};

export default CustomerFavoriteGrid;