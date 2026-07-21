// Components/Favorite/CustomerFavoriteHeader.jsx
import React from 'react';
import { FaHeart, FaTrash,FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerFavoriteHeader = ({ totalFavorites, onClearAll }) => {
  const navigate=useNavigate()
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-8 transition-colors"
      >
        <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
        <span>Continue Shopping</span>
      </button>

      <div className="flex gap-3">
        <button
          onClick={onClearAll}
          className="px-5 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <FaTrash className="text-sm" />
          <span className="hidden sm:inline">Clear Favorite</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerFavoriteHeader;
