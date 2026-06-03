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
} = authSlice.actions;

export default authSlice.reducer;
