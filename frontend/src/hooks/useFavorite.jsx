import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAddToFavoriteMutation } from '../services/customer.api';
import { toggleFavoriteLocal } from '../Store/auth/auth.slice';

const useFavorite = () => {
  const { user } = useSelector((state) => state.auth);
  const [addToFavorite] = useAddToFavoriteMutation();
  const dispatch = useDispatch();

  // Check favorite
  const favoriteSet = new Set(user?.favorite || []);
  const isFavorite = (itemId) => favoriteSet.has(itemId);
  // Toggle favorite
  const toggleFavorite = useCallback(
    async (itemId) => {
      dispatch(toggleFavoriteLocal(itemId));

      try {
        await addToFavorite(itemId).unwrap();
      } catch (error) {
        dispatch(toggleFavoriteLocal(itemId)); // rollback
        console.error(error);
      }
    },
    [addToFavorite, dispatch]
  );

  return {
    toggleFavorite,
    isFavorite,
  };
};

export default useFavorite;
