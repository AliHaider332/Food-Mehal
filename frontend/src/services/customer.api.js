import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include',
  }),
  tagTypes: ['FrontItems', 'Favorite', 'Cart', 'Order', 'Item', 'Recommendations'],
  endpoints: (builder) => ({
    getFrontPageShops: builder.query({
      query: () => '/customer/customer-frontpage-shop',
    }),

    getFrontPageItems: builder.query({
      query: ({ offset = 0, limit = 3 }) =>
        `/customer/customer-frontpage-item?offset=${offset}&limit=${limit}`,

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },

      merge: (currentCache, newItems, { arg }) => {
        if (arg.offset === 0) {
          return newItems;
        }

        const existingItems = currentCache?.items || [];
        const newItemsList = newItems?.items || [];

        const existingIds = new Set(existingItems.map((item) => item._id));

        const uniqueNewItems = newItemsList.filter((item) => !existingIds.has(item._id));

        return {
          ...newItems,
          items: [...existingItems, ...uniqueNewItems],
        };
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.offset !== previousArg?.offset;
      },
    }),

    getSingleItem: builder.query({
      query: (id) => `/customer/item/${id}`,
      providesTags: (result, error, id) => [{ type: 'Item', id }],
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Get recommended items based on item ID
    getRecommendedItems: builder.query({
      query: ({ itemId, limit = 10, category } = {}) => {
        let url = `/customer/recommendations/${itemId}`;
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (params.toString()) url += `?${params.toString()}`;
        return url;
      },
      providesTags: (result, error, { itemId }) => [{ type: 'Recommendations', id: itemId }],
      transformResponse: (response) => {
        return response.data;
      },
    }),

    addToCart: builder.mutation({
      query: ({ itemId, quantity, operation }) => ({
        url: '/customer/add-to-cart',
        method: 'POST',
        body: {
          item: itemId,
          quantity,
          operation,
        },
      }),
      invalidatesTags: ['Cart'],
    }),

    getCartItems: builder.query({
      query: () => '/customer/get-cart-post',
      providesTags: ['Cart'],
    }),

    addToFavorite: builder.mutation({
      query: (itemId) => ({
        url: '/customer/add-to-favorite',
        method: 'POST',
        body: {
          item: itemId,
        },
      }),
      invalidatesTags: ['Favorite'],
    }),
    getFavorite: builder.query({
      query: () => '/customer/get-favorite-post',
      providesTags: ['Favorite'],
    }),

    getOrder: builder.query({
      query: () => '/customer/customer-order',
      providesTags: ['Order'],
    }),
    getCancelOrder: builder.mutation({
      query: ({ id, role, reason }) => ({
        url: `/delivery/cancel-order/${id}`,
        method: 'POST',
        body: {
          role,
          reason,
        },
      }),
      invalidatesTags: ['Order'],
    }),
    getReviewShop: builder.mutation({
      query: ({ orderId, rating, comment, shopId }) => ({
        url: `/customer/${orderId}/review`,
        method: 'POST',
        body: {
          rating,
          comment,
          shopId,
        },
      }),
      invalidatesTags: ['Order'],
    }),

    getPlaceOrder: builder.mutation({
      query: (orderPayload) => ({
        url: `/customer/place-order`,
        method: 'POST',
        body: orderPayload,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetFrontPageShopsQuery,
  useGetFrontPageItemsQuery,
  useGetSingleItemQuery,
  useGetRecommendedItemsQuery,
  useAddToCartMutation,
  useAddToFavoriteMutation,
  useGetFavoriteQuery,
  useGetCartItemsQuery,
  useGetOrderQuery,
  useGetCancelOrderMutation,
  useGetReviewShopMutation,
  useGetPlaceOrderMutation,
} = customerApi;
