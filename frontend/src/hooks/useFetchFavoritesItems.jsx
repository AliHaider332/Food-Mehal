import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setFavoriteItems,
  setLoading,
} from '../Store/user/user.favorite.item.slice';
import { axiosInstance } from '../Config/axios';
import { toast } from 'react-toastify';

const useFetchFavorites = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getFavorite = async () => {
      try {
        dispatch(setLoading(true));
        const storedFavorites =
          JSON.parse(localStorage.getItem('foodFavorites')) || [];
        if (storedFavorites.length === 0) {
          dispatch(setFavoriteItems([]));
          return;
        }
        const response = await axiosInstance.post('user/user-item-by-id', {
          ids: storedFavorites,
        });

        if (response.data.success) {
          dispatch(setFavoriteItems(response.data.items || []));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        dispatch(setLoading(false));
      }
    };

    getFavorite();
  }, [dispatch]);
};

export default useFetchFavorites;
