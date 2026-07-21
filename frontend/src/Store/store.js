import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/auth.slice';

// import orderItemsSlice from './delivery/order.slice';
import { shopApi } from '../services/shop.api';
import { deliveryApi } from '../services/delivery.api';
import { customerApi } from '../services/customer.api';

import customerPageReducer from './user/customer.page.record';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    [shopApi.reducerPath]: shopApi.reducer,
    [deliveryApi.reducerPath]: deliveryApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    customerPage: customerPageReducer,

    // delivery: orderItemsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      shopApi.middleware,
      deliveryApi.middleware,
      customerApi.middleware
    ),
});
