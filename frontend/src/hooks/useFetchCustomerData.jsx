import React from 'react';
import useGetUserItemShop from './useGetUserItemShop';
import useFetchFavoritesItems from './useFetchFavoritesItems';
import useFetchCart from './useFetchCartItems';
import useFetchCustomerOrder from './useFetchCustomerOrder';

const useFetchCustomerData = () => {
  useGetUserItemShop();
  useFetchFavoritesItems();
  useFetchCart();
  useFetchCustomerOrder();
};

export default useFetchCustomerData;
