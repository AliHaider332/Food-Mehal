import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const deliveryApi = createApi({
  reducerPath: 'deliveryApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/',
    credentials: 'include',
  }),

  tagTypes: ['liveOrder'],

  endpoints: (builder) => ({
    // GET SHOP
    getLiveOrder: builder.query({
      query: () => '/delivery/get-order',
      providesTags: ['liveOrder'],
    }),
    acceptOrder: builder.mutation({
      query: (orderId) => ({
        url: `/delivery/accept-order/${orderId}`,
        method: 'GET',
      }),
      invalidatesTags: ['liveOrder'],
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `/delivery/order-status/${data.orderId}/${data.status}`,
        method: 'GET',
      }),
      invalidatesTags: ['liveOrder'],
    }),
  }),
});

export const {
  useGetLiveOrderQuery,
  useAcceptOrderMutation,
  useUpdateOrderMutation,
} = deliveryApi;
