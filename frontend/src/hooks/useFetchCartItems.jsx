import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCartItems,
  setLoading,
} from '../Store/user/user.cart.item.slice';
import { axiosInstance } from '../Config/axios';
import { toast } from 'react-toastify';

const useFetchCartItems = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        dispatch(setLoading(true));

        // ---- STEP 1: Get localStorage ----
        const raw = JSON.parse(localStorage.getItem('foodCart'));

        let rawCart = {};

        // CASE 1: already object {id: qty}
        if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
          rawCart = raw;
        }

        // CASE 2: old array format → convert to object
        else if (Array.isArray(raw)) {
          raw.forEach((obj) => {
            const id = Object.keys(obj)[0];
            rawCart[id] = obj[id];
          });
        }

        // CASE 3: empty
        if (!rawCart) rawCart = {};

        const ids = Object.keys(rawCart);
        if (ids.length === 0) {
          dispatch(setCartItems([]));
          return;
        }

        // ---- STEP 2: Fetch items from backend ----
        const response = await axiosInstance.post('user/user-item-by-id', {
          ids,
        });

        if (response.data.success) {
          const items = response.data.items || [];

          // attach quantities
          const finalCart = items.map((item) => ({
            ...item,
            quantity: rawCart[item._id],
          }));

          dispatch(setCartItems(finalCart));
          
        }
      } catch (err) {
        toast.error('Failed to load cart');
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    getCartItems();
  }, []);
};

export default useFetchCartItems;
