// Store/shop/items.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  shops: [],
  orders: [],
  loading: false,
  error: null,

  // ✅ ADD THESE
  skip: 0,
  hasMore: true,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action) => {
      if (action.payload) {
        state.items = action.payload;
      } else {
        state.items = [];
      }
      state.loading = false;
    },
    addItem: (state, action) => {
      if (action.payload) {
        state.items = [action.payload, ...state.items];
      }
      state.loading = false;
    },
    addMoreItem: (state, action) => {
      if (action.payload) {
        const moreItems = action.payload;
        state.items = [...state.items, ...moreItems];
      }
    },
    setSkip: (state, action) => {
      state.skip = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    clearItems: (state) => {
      state.items = [];
      state.skip = 0;
      state.hasMore = true;
      state.loading = false;
    },
    setShops: (state, action) => {
      if (action.payload) {
        state.shops = action.payload;
      } else {
        state.shops = [];
      }
      state.loading = false;
    },
    setOrders: (state, action) => {
      if (action.payload) {
        state.orders = action.payload;
      } else {
        state.orders = [];
      }
      state.loading = false;
    },
    addOrder: (state, action) => {
      if (action.payload) {
        state.orders = [action.payload, ...state.orders];
      }
      state.loading = false;
    },
    updateOrder: (state, action) => {
      if (!action.payload._id || !action.payload) {
        state.loading = false;
        return;
      }
      state.orders = state.orders.map((item) =>
        item._id === action.payload._id ? { ...item, ...action.payload } : item
      );
      state.loading = false;
    },

    setDeliveryBoyLocation: (state, action) => {
      const { orderId, location } = action.payload;
      console.log(orderId, location);
      
      if (!orderId) return;

      state.orders = state.orders.map((item) =>
        item._id === orderId
          ? {
              ...item,
              deliveryLocation: location,
            }
          : item
      );
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Store/shop/items.slice.js - Add these to the exports
export const {
  setItems,
  setLoading,
  addItem,
  addMoreItem,
  setShops,
  setOrders,
  addOrder,
  updateOrder,
  setSkip, // Add this
  setHasMore, // Add this
  clearItems, // Add this
  setDeliveryBoyLocation,
} = itemsSlice.actions;
export default itemsSlice.reducer;
