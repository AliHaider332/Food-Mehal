import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const favoriteItemsSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavoriteItems: (state, action) => {
      state.items = action.payload; // array
      state.loading = false;
    },

    addFavoriteItem: (state, action) => {
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFavoriteItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    clearAllFavorites: (state) => {
      state.items = [];
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setFavoriteItems,
  addFavoriteItem,
  removeFavoriteItem,
  clearAllFavorites,
  setLoading,
} = favoriteItemsSlice.actions;

export default favoriteItemsSlice.reducer;