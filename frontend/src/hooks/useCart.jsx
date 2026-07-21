/* eslint-disable react-hooks/immutability */
import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddToCartMutation } from '../services/customer.api';
import {
  addCartState,
  manageCartQuantity,
  removeCartState,
  clearCartState,
  updateCartItems,
} from '../Store/auth/auth.slice';

const useCart = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [addToCartMutation, { isLoading }] = useAddToCartMutation();

  // Get cart items from user state (only IDs and quantities)
  const cartItems = user?.cart || [];

  // Get item quantity
  const getItemQuantity = useCallback(
    (itemId) => {
      if (!itemId) return 0;
      const item = cartItems.find((c) => c.item === itemId);
      return item?.quantity || 0;
    },
    [cartItems]
  );

  // Get full item details from cart (just the cart entry)
  const getCartItem = useCallback(
    (itemId) => {
      if (!itemId) return null;
      return cartItems.find((c) => c.item === itemId) || null;
    },
    [cartItems]
  );

  // Add item to cart - only stores ID and quantity
  const addToCart = useCallback(
    async (itemId, quantity = 1) => {
      // Validate inputs
      if (!itemId) {
        console.error('addToCart: Missing itemId');
        return { success: false, error: 'Missing item ID' };
      }

      if (quantity <= 0) {
        console.warn('addToCart: Quantity must be positive');
        return { success: false, error: 'Invalid quantity' };
      }

      try {
        // Optimistic update - store only ID and quantity
        dispatch(addCartState({ 
          item: itemId, 
          quantity: quantity 
        }));

        const response = await addToCartMutation({
          itemId,
          quantity,
          operation: 'increment',
        }).unwrap();

        // Update with server response (should contain updated cart with IDs and quantities)
        if (response?.data) {
          dispatch(updateCartItems(response.data.cart));
        }

        return { success: true, data: response };
      } catch (error) {
        // Rollback on error
        dispatch(removeCartState(itemId));
        console.error('Add to cart error:', error);
        throw error;
      }
    },
    [addToCartMutation, dispatch]
  );

  // Update quantity (+ / -)
  const updateQuantity = useCallback(
    async (itemId, delta) => {
      if (!itemId) {
        console.error('updateQuantity: Missing itemId');
        return { success: false, error: 'Missing item ID' };
      }

      const currentQty = getItemQuantity(itemId);
      const newQty = Math.max(0, currentQty + delta);

      // Validate
      if (newQty === currentQty) {
        return { success: true, message: 'No change in quantity' };
      }

      // Optimistic update
      dispatch(
        manageCartQuantity({
          itemId,
          quantity: newQty,
        })
      );

      try {
        let response;

        if (newQty <= 0) {
          // Remove item if quantity is 0
          response = await addToCartMutation({
            itemId,
            quantity: 0,
            operation: 'delete',
          }).unwrap();
        } else {
          response = await addToCartMutation({
            itemId,
            quantity: Math.abs(delta),
            operation: delta > 0 ? 'increment' : 'decrement',
          }).unwrap();
        }

        // Update with server response
        if (response?.data) {
          dispatch(updateCartItems(response.data.cart));
        }

        return { success: true, data: response };
      } catch (error) {
        // Rollback on error
        dispatch(
          manageCartQuantity({
            itemId,
            quantity: currentQty,
          })
        );
        console.error('Update quantity error:', error);
        throw error;
      }
    },
    [addToCartMutation, getItemQuantity, dispatch]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId) => {
      if (!itemId) {
        console.error('removeFromCart: Missing itemId');
        return { success: false, error: 'Missing item ID' };
      }

      try {
        // Optimistic update
        dispatch(removeCartState(itemId));

        const response = await addToCartMutation({
          itemId,
          quantity: 0,
          operation: 'remove',
        }).unwrap();

        // Update with server response
        if (response?.data) {
          dispatch(updateCartItems(response.data.cart));
        }

        return { success: true, data: response };
      } catch (error) {
        // Rollback - add item back
        const item = cartItems.find((c) => c.item === itemId);
        if (item) {
          dispatch(addCartState(item));
        }
        console.error('Remove from cart error:', error);
        throw error;
      }
    },
    [addToCartMutation, dispatch, cartItems]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      if (cartItems.length === 0) {
        return { success: true };
      }
  
      dispatch(clearCartState());
  
      await addToCartMutation({
        operation: 'clear',
      }).unwrap();
  
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false, error: error.message };
    }
  }, [addToCartMutation, dispatch, cartItems]);

  // Check if item exists in cart
  const isInCart = useCallback(
    (itemId) => {
      if (!itemId) return false;
      return cartItems.some((c) => c.item === itemId);
    },
    [cartItems]
  );

  // Get cart summary (based on IDs only, prices will be calculated with full item data)
  const getCartSummary = useCallback(() => {
    const totalItems = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    return {
      totalItems,
      uniqueItems: cartItems.length,
      itemCount: cartItems.length,
      isEmpty: cartItems.length === 0,
    };
  }, [cartItems]);

  // Get cart items grouped by category (needs full item data)
  const getGroupedItems = useCallback((itemsWithDetails = []) => {
    const groups = {};
    itemsWithDetails.forEach((item) => {
      const category = item.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, []);

  // Calculate savings (needs full item data)
  const getTotalSavings = useCallback((itemsWithDetails = []) => {
    return itemsWithDetails.reduce((sum, item) => {
      if (item.discount && item.discount > 0) {
        const savings = ((item.price * item.discount) / 100) * (item.quantity || 0);
        return sum + savings;
      }
      return sum;
    }, 0);
  }, []);

  // Get full cart items by merging with fetched item details
  const getFullCartItems = useCallback((fetchedItems = []) => {
    if (!cartItems.length || !fetchedItems.length) return [];
    
    // Create a map of fetched items by ID for quick lookup
    const itemMap = new Map();
    fetchedItems.forEach(item => {
      if (item && item._id) {
        itemMap.set(item._id, item);
      }
    });
    
    // Merge cart quantities with fetched item details
    return cartItems
      .map(cartItem => {
        const fullItem = itemMap.get(cartItem.item);
        if (!fullItem) return null;
        
        return {
          ...fullItem,
          quantity: cartItem.quantity,
          // Calculate discounted price if applicable
          discountedPrice: fullItem.discount && fullItem.discount > 0
            ? fullItem.price - (fullItem.price * fullItem.discount) / 100
            : fullItem.price
        };
      })
      .filter(item => item !== null); // Remove items that weren't found
  }, [cartItems]);

  return {
    // State
    cartItems, // Only contains { item: id, quantity: number }
    isLoading,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,

    // Helpers
    getItemQuantity, // Returns quantity for a specific item ID
    getCartItem, // Returns the cart entry { item: id, quantity: number }
    isInCart,
    getCartSummary, // Returns basic summary (counts only)
    getGroupedItems, // Requires full item data
    getTotalSavings, // Requires full item data
    getFullCartItems, // Merges cart IDs with fetched item details
  };
};

export default useCart;