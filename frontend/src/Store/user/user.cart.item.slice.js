import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of cart items with quantity property
  ids: {},
  loading: true,
  error: null,
};

const cartItemsSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearAllCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCartItems, setLoading, clearAllCart } =
  cartItemsSlice.actions;

export default cartItemsSlice.reducer;
