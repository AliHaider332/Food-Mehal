// utils/favoriteUtils.js
export const formatPKR = (amount) => {
  return new Intl.NumberFormat('ur-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const getDiscountedPrice = (item) => {
  if (item.discount && item.discount > 0) {
    return item.price - (item.price * item.discount) / 100;
  }
  return item.price;
};

export const calculateSavings = (item) => {
  if (item.discount && item.discount > 0) {
    return (item.price * item.discount) / 100;
  }
  return 0;
};

export const getCartQuantityMap = (items, getItemQuantity) => {
  const map = {};
  items.forEach((item) => {
    map[item._id] = getItemQuantity(item._id);
  });
  return map;
};

export const getIsInCartMap = (items, isInCart) => {
  const map = {};
  items.forEach((item) => {
    map[item._id] = isInCart(item._id);
  });
  return map;
};