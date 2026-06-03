// components/DeleteConfirmationModal.jsx
import React from 'react';
import { FaTrash } from 'react-icons/fa';

const SellerDeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-modal-slide-in">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-trash-alt text-3xl text-red-600">
                <FaTrash/>
              </i>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
            Delete Item
          </h3>
          
          {/* Message */}
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-red-600">"{itemName}"</span>?
            <br />
            <span className="text-sm text-gray-500">This action cannot be undone.</span>
          </p>
          
          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt"></i>
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes modal-slide-in {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-modal-slide-in {
          animation: modal-slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SellerDeleteConfirmationModal;