import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/auth.slice';
import userItemsReducer from './user/user.item.slice';
import cartItemsReducer from './user/user.cart.item.slice';
import favoriteItemsReducer from './user/user.favorite.item.slice';
import orderItemsSlice from './delivery/order.slice';
import { shopApi } from '../services/shop.api';
import { deliveryApi } from '../services/delivery.api';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    [shopApi.reducerPath]: shopApi.reducer,
    [deliveryApi.reducerPath]: deliveryApi.reducer,
    userItems: userItemsReducer,
    cart: cartItemsReducer,
    favorites: favoriteItemsReducer,
    delivery: orderItemsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopApi.middleware, deliveryApi.middleware),
});
