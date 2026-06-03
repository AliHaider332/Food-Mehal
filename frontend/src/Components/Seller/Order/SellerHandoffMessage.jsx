// components/SellerHandoffMessage.jsx
import React from 'react';
import { FaTruck, FaBell } from 'react-icons/fa';

const SellerHandoffMessage = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-t border-green-100">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white animate-pulse">
            <FaTruck />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
            <FaBell className="text-green-600" />
            Waiting for Delivery Partner
          </p>
          <p className="text-xs text-green-600 mt-0.5">
            Nearby delivery boys have been notified. A delivery partner will accept and pick up the order shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerHandoffMessage;