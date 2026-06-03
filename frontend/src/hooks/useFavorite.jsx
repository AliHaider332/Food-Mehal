import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFavoriteItem,
  removeFavoriteItem,
} from '../Store/user/user.favorite.item.slice';

const useFavorite = () => {
  const dispatch = useDispatch();
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  // Sync localStorage (centralized)
  const syncLocalStorage = useCallback((favorites) => {
    const ids = favorites.map((item) => item._id);
    localStorage.setItem('foodFavorites', JSON.stringify(ids));
  }, []);

  // Check favorite
  const isFavorite = useCallback(
    (itemId) => {
      return favoriteItems.some((item) => item._id === itemId);
    },
    [favoriteItems]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    (item, e) => {
      e?.stopPropagation();

      const exists = favoriteItems.find((fav) => fav._id === item._id);

      let updatedFavorites;

      if (exists) {
        updatedFavorites = favoriteItems.filter((fav) => fav._id !== item._id);

        dispatch(removeFavoriteItem(item._id));
      } else {
        updatedFavorites = [...favoriteItems, item];

        dispatch(addFavoriteItem(item));
      }

      syncLocalStorage(updatedFavorites);
    },
    [favoriteItems, dispatch, syncLocalStorage]
  );

  // Remove separately
  const removeFromFavorites = useCallback(
    (id, e) => {
      e?.stopPropagation();

      const updatedFavorites = favoriteItems.filter((item) => item._id !== id);

      dispatch(removeFavoriteItem(id));
      syncLocalStorage(updatedFavorites);
    },
    [favoriteItems, dispatch, syncLocalStorage]
  );

  return {
    toggleFavorite,
    isFavorite,
    removeFromFavorites,
  };
};

export default useFavorite;
