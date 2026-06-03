// Components/Favorite/CustomerEmptyFavorite.jsx
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerEmptyFavorite = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <FaHeart className="text-4xl text-orange-500" />
        </div>
        <p className="text-gray-500 text-lg">No favorites yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Save your favorite dishes by clicking the heart icon
        </p>
        <button
          onClick={() => navigate('/user')}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default CustomerEmptyFavorite;