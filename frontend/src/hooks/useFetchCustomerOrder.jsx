import React, { useEffect } from 'react';
import { axiosInstance } from '../Config/axios';
import { useDispatch } from 'react-redux';
import { setOrders } from '../Store/user/user.item.slice';
const useFetchCustomerOrder = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await axiosInstance.get('/user/my-order');
        dispatch(setOrders(res.data.order));
      } catch (error) {
        console.log(error);
      }
    };
    getItems();
    dispatch;
  }, [dispatch]);
};

export default useFetchCustomerOrder;
