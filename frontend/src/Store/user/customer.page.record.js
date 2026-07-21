import { createSlice } from '@reduxjs/toolkit';
// Store/user/customer.page.record.js
const initialState = {
  homeOffset: 0,      // For CustomerItemPortion
  viewAllOffset: 0,   // For CustomerViewAllItems
};

export const customerPageSlice = createSlice({
  name: 'customerPage',
  initialState,
  reducers: {
    incrementHomeOffset: (state, action) => {
      state.homeOffset += action.payload;
    },
    resetHomeOffset: (state) => {
      state.homeOffset = 0;
    },
    incrementViewAllOffset: (state, action) => {
      state.viewAllOffset += action.payload;
    },
    resetViewAllOffset: (state) => {
      state.viewAllOffset = 0;
    },
    resetOffset: (state) => {
      state.viewAllOffset = 0;
    },
  },
});

export const { setCurrentOffset, incrementHomeOffset,incrementViewAllOffset, resetOffset } =
customerPageSlice.actions;

export default customerPageSlice.reducer;
