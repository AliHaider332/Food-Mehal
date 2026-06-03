// utils/cartUtils.js
export const formatPKR = (amount) => {
  return new Intl.NumberFormat('ur-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const hasDiscount = (item) => item.discount && Number(item.discount) > 0;

export const getDiscountedPrice = (item) => {
  if (!hasDiscount(item)) return item.price;
  return item.price - (item.price * item.discount) / 100;
};

export const getItemSavings = (item) => {
  if (!hasDiscount(item)) return 0;
  return (item.price * item.discount) / 100;
};

export const getItemTotal = (item) => getDiscountedPrice(item) * item.quantity;

export const groupItemsByShop = (cartItems) => {
  const shopsMap = new Map();

  cartItems.forEach((item) => {
    const shopId = item.shop?._id;
    if (!shopsMap.has(shopId)) {
      shopsMap.set(shopId, {
        id: shopId,
        name: item.shop.name,
        deliveryFee: item.shop.deliveryFee || 150,
        minOrder: item.shop.minOrderAmount || 500,
        deliveryTime: item.shop.deliveryTime || { min: 25, max: 45 },
        items: [],
        subtotal: 0,
        savings: 0,
      });
    }

    const shop = shopsMap.get(shopId);
    const itemTotal = getItemTotal(item);
    const itemSavings = getItemSavings(item) * item.quantity;

    shop.items.push({ ...item, total: itemTotal, savings: itemSavings });
    shop.subtotal += itemTotal;
    shop.savings += itemSavings;
  });

  return Array.from(shopsMap.values());
};

export const calculateCartTotals = (shops) => {
  const subtotal = shops.reduce((sum, s) => sum + s.subtotal, 0);
  const totalSavings = shops.reduce((sum, s) => sum + s.savings, 0);
  const totalDelivery = shops.reduce((sum, s) => sum + s.deliveryFee, 0);
  const grandTotal = subtotal + totalDelivery;
  
  return { subtotal, totalSavings, totalDelivery, grandTotal };
};

export const prepareOrderSummary = (shops, totals) => {
  return {
    id: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toLocaleString(),
    shops: shops.map((shop) => ({
      shopId: shop.id,
      shopName: shop.name,
      deliveryFee: shop.deliveryFee,
      deliveryTime: shop.deliveryTime,
      items: shop.items.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        discount: item.discount,
        picture: item.picture,
      })),
      subtotal: shop.subtotal,
      savings: shop.savings,
      total: shop.subtotal + shop.deliveryFee,
    })),
    subtotal: totals.subtotal,
    savings: totals.totalSavings,
    delivery: totals.totalDelivery,
    grandTotal: totals.grandTotal,
  };
};