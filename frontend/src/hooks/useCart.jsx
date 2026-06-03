import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCartItems } from '../Store/user/user.cart.item.slice';

const useCart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, loading } = useSelector((state) => state.cart);

  // Sync cart to localStorage
  const syncLocalStorage = useCallback((cart) => {
    const ls = {};
    cart.forEach((item) => {
      ls[item._id] = item.quantity;
    });
    localStorage.setItem('foodCart', JSON.stringify(ls));
  }, []);

  // Remove item from cart ✅ (moved up)
  const removeFromCart = useCallback(
    (itemId, showToast = true) => {
      const item = cartItems.find((c) => c._id === itemId);
      const newCart = cartItems.filter((c) => c._id !== itemId);

      dispatch(setCartItems(newCart));
      syncLocalStorage(newCart);

      if (showToast && item) {
        toast.info(`${item.name} removed from cart`);
      }
    },
    [cartItems, dispatch, syncLocalStorage]
  );

  // Add item to cart
  const addToCart = useCallback(
    (item, quantity = 1) => {
      if (!item) return;

      const existing = cartItems.find((c) => c._id === item._id);
      let newCart;

      if (existing) {
        newCart = cartItems.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + quantity } : c
        );
      } else {
        newCart = [...cartItems, { ...item, quantity }];
      }

      dispatch(setCartItems(newCart));
      syncLocalStorage(newCart);
    },
    [cartItems, dispatch, syncLocalStorage]
  );

  // Update quantity (+ / -)
  const updateQuantity = useCallback(
    (itemId, delta, showToast = false) => {
      const item = cartItems.find((c) => c._id === itemId);
      if (!item) return;

      const newQty = item.quantity + delta;

      if (newQty <= 0) {
        removeFromCart(itemId, showToast);
        return;
      }

      const newCart = cartItems.map((c) =>
        c._id === itemId ? { ...c, quantity: newQty } : c
      );

      dispatch(setCartItems(newCart));
      syncLocalStorage(newCart);
    },
    [cartItems, dispatch, syncLocalStorage, removeFromCart] // ✅ fixed dependency
  );

  // Set exact quantity
  const setQuantity = useCallback(
    (itemId, newQuantity, showToast = false) => {
      if (newQuantity <= 0) {
        removeFromCart(itemId, showToast);
        return;
      }

      const item = cartItems.find((c) => c._id === itemId);
      if (!item) return;

      const newCart = cartItems.map((c) =>
        c._id === itemId ? { ...c, quantity: newQuantity } : c
      );

      dispatch(setCartItems(newCart));
      syncLocalStorage(newCart);
    },
    [cartItems, dispatch, syncLocalStorage, removeFromCart] // ✅ added dependency
  );

  // Clear cart
  const clearCart = useCallback(() => {
    dispatch(setCartItems([]));
    localStorage.removeItem('foodCart');
  }, [dispatch]);

  // Get item quantity
  const getItemQuantity = useCallback(
    (itemId) => {
      const item = cartItems.find((c) => c._id === itemId);
      return item?.quantity || 0;
    },
    [cartItems]
  );

  // Check if item exists
  const isInCart = useCallback(
    (itemId) => {
      return cartItems.some((c) => c._id === itemId);
    },
    [cartItems]
  );

  // Cart summary
  const getCartSummary = useCallback(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalSavings = cartItems.reduce((sum, item) => {
      if (item.discount && item.discount > 0) {
        const discountedPrice = item.price - (item.price * item.discount) / 100;
        return sum + (item.price - discountedPrice) * item.quantity;
      }
      return sum;
    }, 0);

    const total = cartItems.reduce((sum, item) => {
      const price = item.discount
        ? item.price - (item.price * item.discount) / 100
        : item.price;
      return sum + price * item.quantity;
    }, 0);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, totalSavings, total, totalItems };
  }, [cartItems]);

  return {
    // State
    cartItems,
    loading,

    // Actions
    addToCart,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,

    // Helpers
    getItemQuantity,
    isInCart,
    getCartSummary,
  };
};

export default useCart;
