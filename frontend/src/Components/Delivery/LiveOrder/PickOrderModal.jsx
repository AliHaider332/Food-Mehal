// components/PickOrderModal.js
import React from 'react';
import { FiPackage, FiLoader } from 'react-icons/fi';

const PickOrderModal = ({ isOpen, shopName, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FiPackage className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Pickup</h3>
          <p className="text-gray-500 mb-4">
            Have you picked up the order from {shopName}?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Processing...' : 'Yes, Order Picked'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickOrderModal;