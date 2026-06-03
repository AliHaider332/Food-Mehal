// Store/shop/items.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  liveOrder: null,
  loading: true,
  error: null,
};

const orderItemsSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
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
      if (action.payload) {
        const id = action.payload._id;
        state.orders = state.orders.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },
    setLiveOrders: (state, action) => {
      if (action.payload) {
        state.liveOrder = action.payload;
      } else {
        state.liveOrder = null;
      }
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrders, setLoading, addOrder, updateOrder, setLiveOrders } =
  orderItemsSlice.actions;
export default orderItemsSlice.reducer;
