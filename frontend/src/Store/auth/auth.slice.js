import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  allowForgotPassword: false,
  loading: true,
  isError: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
      state.isError = false;
    },

    setCoordinates: (state, action) => {
      if (state.user?.location) {
        state.user.location.coordinates = action.payload;
      }
    },

    setForgotPasswordPage: (state, action) => {
      state.allowForgotPassword = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUnauthorized: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
    },

    setError: (state) => {
      state.isError = true;
      state.loading = false;
    },

    resetUser: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.allowForgotPassword = false;
      state.loading = false;
      state.isError = false;
    },

    toggleFavoriteLocal: (state, action) => {
      const itemId = action.payload;

      if (!state.user.favorite) {
        state.user.favorite = [];
      }

      const exists = state.user.favorite.includes(itemId);

      if (exists) {
        state.user.favorite = state.user.favorite.filter((id) => id !== itemId);
      } else {
        state.user.favorite = [...state.user.favorite, itemId];
      }
    },
    // In your auth.slice.js - Only store ID and quantity
    addCartState: (state, action) => {
      const { item, quantity } = action.payload;

      if (!item || !state.user) return;

      // Check if item already exists
      const existingItem = state.user.cart.find(
        (cartItem) => cartItem.item === item
      );

      if (existingItem) {
        // Update existing item quantity
        existingItem.quantity = (existingItem.quantity || 0) + (quantity || 1);
      } else {
        // Add new item with only ID and quantity
        state.user.cart.push({
          item: item,
          quantity: quantity || 1,
        });
      }
    },

    manageCartQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;

      if (!itemId || !state.user) return;

      const itemIndex = state.user.cart.findIndex(
        (item) => item.item === itemId
      );

      if (itemIndex === -1) {
        if (quantity > 0) {
          // Item doesn't exist, add it
          state.user.cart.push({
            item: itemId,
            quantity: quantity,
          });
        }
        return;
      }

      if (quantity <= 0) {
        // Remove item
        state.user.cart.splice(itemIndex, 1);
      } else {
        // Update quantity
        state.user.cart[itemIndex].quantity = quantity;
      }
    },

    removeCartState: (state, action) => {
      const itemId = action.payload;

      if (!itemId || !state.user) return;

      state.user.cart = state.user.cart.filter((item) => item.item !== itemId);
    },

    clearCartState: (state) => {
      if (state.user) {
        state.user.cart = [];
      }
    },

    updateCartItems: (state, action) => {
      if (state.user && action.payload) {
        state.user.cart = action.payload;
      }
    },
  },
});

export const {
  setUser,
  setLoading,
  setForgotPasswordPage,
  resetUser,
  setCoordinates,
  setUnauthorized,
  setError,
  toggleFavoriteLocal,
  addCartState,
  removeCartState,
  manageCartQuantity,
  clearCartState,
  updateCartItems,
} = authSlice.actions;

export default authSlice.reducer;
