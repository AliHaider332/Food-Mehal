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

      async onQueryStarted({ id, status }, { dispatch, queryFulfilled, getState }) {
        const state = getState();
        const queryKey = shopApi.endpoints.getShopLiveOrders.select(undefined);
        const queryResult = queryKey(state);

        // Only update if there's cached data
        if (queryResult.data) {
          const patchResult = dispatch(
            shopApi.util.updateQueryData('getShopLiveOrders', undefined, (draft) => {
              // Handle different response structures
              let orders = draft;

              // If draft is an object with an 'order' property containing the array
              if (draft.order && Array.isArray(draft.order)) {
                orders = draft.order;
              }
              // If draft is directly the array
              else if (Array.isArray(draft)) {
                orders = draft;
              }
              // If draft has a different structure, log it
              else {
                console.warn('Unexpected draft structure:', draft);
                return;
              }

              // Find and update the order
              const orderIndex = orders.findIndex((order) => order._id === id);
              if (orderIndex !== -1) {
                orders[orderIndex] = {
                  ...orders[orderIndex],
                  status: status,
                  updatedAt: new Date().toISOString(),
                };
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        } else {
          try {
            await queryFulfilled;
          } catch (error) {
            console.error('Mutation failed:', error);
          }
        }
      },
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
