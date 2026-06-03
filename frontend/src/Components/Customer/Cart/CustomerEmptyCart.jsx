import React from 'react';
import { FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerEmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-8 transition-colors"
      >
        <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
        <span>Continue Shopping</span>
      </button>
      <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaShoppingBag className="text-5xl text-orange-500" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">
          Your cart is empty
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added any items yet. Explore our delicious menu
          and satisfy your cravings!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Browse Menu
        </button>
      </div>
    </div>
  );
};

export default CustomerEmptyCart;
