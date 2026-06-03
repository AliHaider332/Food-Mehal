// components/SellerDeliveryBoyInfo.jsx
import React from 'react';
import { FaTruck, FaMotorcycle, FaUserCheck, FaPhone, FaEnvelope, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SellerDeliveryBoyInfo = ({ deliveryBoy, showDeliveryInfo, setShowDeliveryInfo, orderId }) => {
  const isExpanded = showDeliveryInfo === orderId;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-3 border-t border-blue-100">
      <button
        onClick={() => setShowDeliveryInfo(isExpanded ? null : orderId)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-md">
            <FaTruck />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-blue-900">Delivery Partner Assigned</p>
            <p className="text-xs text-blue-600">{deliveryBoy.name || 'Delivery Professional'}</p>
          </div>
        </div>
        {isExpanded ? (
          <FaChevronUp className="text-blue-500 group-hover:scale-110 transition-transform" />
        ) : (
          <FaChevronDown className="text-blue-500 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-blue-200 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-blue-800 bg-white/50 p-2 rounded-lg">
              <FaUserCheck className="text-blue-500" />
              <span className="font-medium">Name:</span>
              <span>{deliveryBoy.name || 'Not specified'}</span>
            </div>
            {deliveryBoy.phone && (
              <div className="flex items-center gap-2 text-sm text-blue-800 bg-white/50 p-2 rounded-lg">
                <FaPhone className="text-blue-500" />
                <span className="font-medium">Phone:</span>
                <span>{deliveryBoy.phone}</span>
              </div>
            )}
            {deliveryBoy.email && (
              <div className="flex items-center gap-2 text-sm text-blue-800 bg-white/50 p-2 rounded-lg">
                <FaEnvelope className="text-blue-500" />
                <span className="font-medium">Email:</span>
                <span>{deliveryBoy.email}</span>
              </div>
            )}
            {deliveryBoy.vehicleNumber && (
              <div className="flex items-center gap-2 text-sm text-blue-800 bg-white/50 p-2 rounded-lg">
                <FaMotorcycle className="text-blue-500" />
                <span className="font-medium">Vehicle:</span>
                <span>{deliveryBoy.vehicleNumber}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDeliveryBoyInfo;