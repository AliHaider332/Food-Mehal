// utils/cartUtils.js

/**
 * Format amount in Pakistani Rupees
 */
export const formatPKR = (amount) => {
  return new Intl.NumberFormat('ur-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Check if item has discount
 */
export const hasDiscount = (item) => {
  return item?.discount && Number(item.discount) > 0;
};

/**
 * Get discounted price of an item
 */
export const getDiscountedPrice = (item) => {
  if (!hasDiscount(item)) return item?.price || 0;
  const price = Number(item.price) || 0;
  const discount = Number(item.discount) || 0;
  return price - (price * discount) / 100;
};

/**
 * Get savings per item
 */
export const getItemSavings = (item) => {
  if (!hasDiscount(item)) return 0;
  const price = Number(item.price) || 0;
  const discount = Number(item.discount) || 0;
  return (price * discount) / 100;
};

/**
 * Get total price for an item (discounted price * quantity)
 */
export const getItemTotal = (item) => {
  return getDiscountedPrice(item) * (item?.quantity || 0);
};

/**
 * Extract item data from cart item (handles nested structure)
 */
const extractItemData = (cartItem) => {
  // Check if cartItem has nested item structure
  const itemData = cartItem.item || cartItem;
  
  // Extract shop data (could be nested in item or directly on cartItem)
  const shopData = itemData.shop || cartItem.shop;
  
  return {
    id: itemData._id || cartItem._id,
    name: itemData.name || cartItem.name || 'Unknown Item',
    price: Number(itemData.price || cartItem.price || 0),
    discount: Number(itemData.discount || cartItem.discount || 0),
    quantity: Number(cartItem.quantity || 1),
    picture: itemData.picture || cartItem.picture || '',
    category: itemData.category || cartItem.category || 'Uncategorized',
    shop: shopData ? {
      _id: shopData._id,
      name: shopData.name || 'Unknown Shop',
      deliveryFee: Number(shopData.deliveryFee) || 150,
      minOrderAmount: Number(shopData.minOrderAmount) || 500,
      deliveryTime: shopData.deliveryTime || { min: 25, max: 45 },
    } : null,
  };
};

/**
 * Group cart items by shop
 */
export const groupItemsByShop = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return [];
  }

  const shopsMap = new Map();

  cartItems.forEach((cartItem) => {
    try {
      // Extract item data with proper structure
      const itemData = extractItemData(cartItem);
      
      // Skip items without shop data
      if (!itemData.shop || !itemData.shop._id) {
        console.warn('Item missing shop data:', cartItem);
        return;
      }

      const shopId = itemData.shop._id;
      
      if (!shopsMap.has(shopId)) {
        shopsMap.set(shopId, {
          id: shopId,
          name: itemData.shop.name || 'Unknown Shop',
          deliveryFee: itemData.shop.deliveryFee || 150,
          minOrder: itemData.shop.minOrderAmount || 500,
          deliveryTime: itemData.shop.deliveryTime || { min: 25, max: 45 },
          items: [],
          subtotal: 0,
          savings: 0,
          itemCount: 0,
        });
      }

      const shop = shopsMap.get(shopId);
      
      // Calculate totals
      const itemTotal = getItemTotal(itemData);
      const itemSavings = getItemSavings(itemData) * (itemData.quantity || 0);

      // Add item to shop
      shop.items.push({ 
        ...itemData,
        total: itemTotal, 
        savings: itemSavings,
        // Keep original cart item reference if needed
        cartItemId: cartItem._id,
      });
      
      shop.subtotal += itemTotal;
      shop.savings += itemSavings;
      shop.itemCount += itemData.quantity || 0;
      
    } catch (error) {
      console.error('Error processing cart item:', cartItem, error);
    }
  });

  return Array.from(shopsMap.values());
};

/**
 * Calculate cart totals from shops
 */
export const calculateCartTotals = (shops) => {
  if (!shops || !Array.isArray(shops) || shops.length === 0) {
    return {
      subtotal: 0,
      totalSavings: 0,
      totalDelivery: 0,
      grandTotal: 0,
      totalItems: 0,
    };
  }

  const subtotal = shops.reduce((sum, s) => sum + (s.subtotal || 0), 0);
  const totalSavings = shops.reduce((sum, s) => sum + (s.savings || 0), 0);
  const totalDelivery = shops.reduce((sum, s) => sum + (s.deliveryFee || 0), 0);
  const grandTotal = subtotal + totalDelivery;
  const totalItems = shops.reduce((sum, s) => sum + (s.itemCount || 0), 0);
  
  return { 
    subtotal, 
    totalSavings, 
    totalDelivery, 
    grandTotal,
    totalItems,
  };
};

/**
 * Prepare order summary for checkout
 */
export const prepareOrderSummary = (shops, totals, totalItems) => {
  if (!shops || !Array.isArray(shops) || shops.length === 0) {
    return {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleString(),
      shops: [],
      subtotal: 0,
      savings: 0,
      delivery: 0,
      grandTotal: 0,
      totalItems: 0,
    };
  }

  return {
    id: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toLocaleString(),
    shops: shops.map((shop) => ({
      shopId: shop.id,
      shopName: shop.name,
      deliveryFee: shop.deliveryFee,
      deliveryTime: shop.deliveryTime,
      items: shop.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        discount: item.discount,
        picture: item.picture,
        originalPrice: item.originalPrice || item.price,
      })),
      subtotal: shop.subtotal,
      savings: shop.savings,
      total: shop.subtotal + shop.deliveryFee,
      itemCount: shop.itemCount,
    })),
    subtotal: totals?.subtotal || 0,
    savings: totals?.totalSavings || 0,
    delivery: totals?.totalDelivery || 0,
    grandTotal: totals?.grandTotal || 0,
    totalItems: totalItems || 0,
  };
};

/**
 * Validate minimum order requirements
 */
export const validateMinOrders = (shops) => {
  if (!shops || !Array.isArray(shops)) {
    return { isValid: true, errors: [] };
  }

  const errors = [];
  shops.forEach((shop) => {
    const minOrder = Number(shop.minOrder) || 0;
    const subtotal = Number(shop.subtotal) || 0;
    
    if (subtotal < minOrder && minOrder > 0) {
      errors.push({
        shopId: shop.id,
        shopName: shop.name,
        minOrder: minOrder,
        currentTotal: subtotal,
        message: `${shop.name} requires minimum order of ${formatPKR(minOrder)}`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate item summary for display
 */
export const getItemSummary = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) {
    return {
      totalItems: 0,
      totalPrice: 0,
      totalSavings: 0,
      uniqueItems: 0,
    };
  }

  let totalItems = 0;
  let totalPrice = 0;
  let totalSavings = 0;

  cartItems.forEach((cartItem) => {
    const itemData = extractItemData(cartItem);
    const quantity = itemData.quantity || 0;
    const price = itemData.price || 0;
    const discount = itemData.discount || 0;
    
    totalItems += quantity;
    totalPrice += price * quantity;
    totalSavings += (price * discount / 100) * quantity;
  });

  return {
    totalItems,
    totalPrice,
    totalSavings,
    uniqueItems: cartItems.length,
  };
};

/**
 * Check if cart has any discounted items
 */
export const hasDiscountedItems = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return false;
  
  return cartItems.some((cartItem) => {
    const itemData = extractItemData(cartItem);
    return hasDiscount(itemData);
  });
};

/**
 * Get delivery fee breakdown by shop
 */
export const getDeliveryFeeBreakdown = (shops) => {
  if (!shops || !Array.isArray(shops)) return [];
  
  return shops.map(shop => ({
    shopName: shop.name,
    deliveryFee: shop.deliveryFee,
    isFree: shop.deliveryFee === 0,
  }));
};

/**
 * Calculate estimated delivery time
 */
export const getEstimatedDeliveryTime = (shops) => {
  if (!shops || !Array.isArray(shops) || shops.length === 0) {
    return { min: 0, max: 0 };
  }

  let maxMin = 0;
  let maxMax = 0;

  shops.forEach(shop => {
    if (shop.deliveryTime) {
      maxMin = Math.max(maxMin, shop.deliveryTime.min || 0);
      maxMax = Math.max(maxMax, shop.deliveryTime.max || 0);
    }
  });

  return { min: maxMin, max: maxMax };
};

/**
 * Format cart items for API payload
 */
export const formatCartForAPI = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return [];

  return cartItems.map((cartItem) => {
    const itemData = extractItemData(cartItem);
    return {
      itemId: itemData.id,
      quantity: itemData.quantity,
      price: itemData.price,
      discount: itemData.discount,
      total: getItemTotal(itemData),
    };
  });
};

/**
 * Check if cart is valid for checkout
 */
export const isValidCartForCheckout = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return { isValid: false, reason: 'Cart is empty' };
  }

  // Check for invalid quantities
  const invalidItems = cartItems.filter((cartItem) => {
    const itemData = extractItemData(cartItem);
    return !itemData.quantity || itemData.quantity <= 0;
  });

  if (invalidItems.length > 0) {
    return { 
      isValid: false, 
      reason: 'Some items have invalid quantities',
      invalidItems,
    };
  }

  // Check for missing price
  const missingPrice = cartItems.filter((cartItem) => {
    const itemData = extractItemData(cartItem);
    return !itemData.price || Number(itemData.price) <= 0;
  });

  if (missingPrice.length > 0) {
    return {
      isValid: false,
      reason: 'Some items have missing prices',
      missingPrice,
    };
  }

  return { isValid: true };
};

/**
 * Get cart statistics
 */
export const getCartStatistics = (cartItems) => {
  const summary = getItemSummary(cartItems);
  const shops = groupItemsByShop(cartItems);
  const totals = calculateCartTotals(shops);

  return {
    ...summary,
    shopCount: shops.length,
    ...totals,
    hasDiscounts: hasDiscountedItems(cartItems),
    estimatedDelivery: getEstimatedDeliveryTime(shops),
  };
};