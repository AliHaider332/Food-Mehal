// components/SellerEmptyOrderState.jsx
import React from 'react';
import { FaShoppingCart, FaStore } from 'react-icons/fa';

const SellerEmptyOrderState = () => {
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20"></div>
        <FaShoppingCart className="text-7xl text-gray-300 mb-4 relative mx-auto" />
      </div>
      <p className="text-gray-500 text-lg mt-4">No order yet.</p>
      <p className="text-gray-400 text-sm mt-2">
        Share your shop link with customers to start receiving orders
      </p>
    </div>
  );
};

export default SellerEmptyOrderState;
