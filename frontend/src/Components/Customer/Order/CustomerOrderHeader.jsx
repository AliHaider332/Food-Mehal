import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CustomerOrderHeader = ({ totalOrders }) => {
  const navigate = useNavigate();
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
        <div className="bg-white px-5 py-2 rounded-full shadow-sm">
          <span className="text-gray-600">Orders: </span>
          <span className="font-bold text-orange-600">{totalOrders}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderHeader;
