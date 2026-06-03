import React, { useEffect } from 'react';
import { axiosInstance } from '../Config/axios';
import { useDispatch } from 'react-redux';
import { setItems, setLoading, setShops } from '../Store/user/user.item.slice';
const useGetUserItemShop = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getItems = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axiosInstance.post('/user/user-data', {
          favorite: localStorage.getItem('foodFavorites'),
          cart: localStorage.getItem('foodCart'),
          clicked: localStorage.getItem('foodClicked'),
        });
        dispatch(setItems(res.data?.items || []));
        dispatch(setShops(res.data?.shops || []));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    getItems();
  }, [dispatch]);
};

export default useGetUserItemShop;
