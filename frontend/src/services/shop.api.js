import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shopApi = createApi({
  reducerPath: 'shopApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/',
    credentials: 'include',
  }),

  tagTypes: ['shop', 'items', 'orders'],

  endpoints: (builder) => ({
    // GET SHOP
    getShop: builder.query({
      query: () => '/shop/get-shop',

      providesTags: ['shop'],
    }),

    // GET Items
    getShopItems: builder.query({
      query: () => '/shop/get-items',
      providesTags: ['items'],
    }),

    // CREATE / UPDATE SHOP
    setShop: builder.mutation({
      query: (data) => ({
        url: '/shop/create-update-shop',
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['shop'],
    }),

    //items mutations
    createItem: builder.mutation({
      query: (data) => ({
        url: `/shop/create-item`,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: ['items'],
    }),
    updateItem: builder.mutation({
      query: (data) => ({
        url: `/shop/update-item/${data.id}`,
        method: 'PUT',
        body: data.data,
      }),

      invalidatesTags: ['items'],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/shop/delete-item/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['items'],
    }),
    getShopAnalytics: builder.query({
      query: () => '/shop/get-shop-analytics',
    }),

    // GET ORDERS
    getShopLiveOrders: builder.query({
      query: () => '/shop/get-live-shop-order',
      providesTags: ['live-orders'],
    }),
    getShopDeliveredOrders: builder.query({
      query: () => '/shop/get-delivered-shop-order',
    }),
    getShopCancelledOrders: builder.query({
      query: () => '/shop/get-cancelled-shop-order',
    }),
    updateShopOrder: builder.mutation({
      query: (data) => ({
        url: `/shop/order/${data.id}/status`,
        method: 'PUT',
        body: { status: data.status },
      }),
      invalidatesTags: ['live-orders'],
    }),
    cancelShopOrder: builder.mutation({
      query: (data) => ({
        url: `delivery/cancel-order/${data.id}`,
        method: 'POST',
        body: { role: data.role, reason: data.reason },
      }),
      invalidatesTags: ['live-orders'],
    }),
  }),
});

export const {
  useGetShopQuery,
  useSetShopMutation,
  useGetShopItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,

  useGetShopLiveOrdersQuery,
  useGetShopDeliveredOrdersQuery,
  useGetShopCancelledOrdersQuery,
  useUpdateShopOrderMutation,
  useCancelShopOrderMutation,
  useGetShopAnalyticsQuery,
} = shopApi;
