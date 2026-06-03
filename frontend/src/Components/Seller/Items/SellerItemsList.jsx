// components/ItemsList.jsx
import React, { useState } from 'react';
import SellerItemCard from './SellerItemCard';
import { toast } from 'react-toastify';
import SellerDeleteConfirmationModal from './SellerDeleteConfirmationModal';
import { MdRestaurantMenu } from 'react-icons/md';
import { useDeleteItemMutation } from '../../../services/shop.api';

const SellerItemsList = ({ onEditItem, items }) => {
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSellerItem] = useDeleteItemMutation();

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      const res = await deleteSellerItem(deleteItem._id);
      if (res.data.success) {
        toast.success(`${deleteItem?.name} has been deleted successfully!`);
      } else {
        toast.error(res.data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error.response?.data?.message || 'Error deleting item');
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteItem(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20"></div>
          <MdRestaurantMenu className="text-7xl text-gray-300 mb-4 relative mx-auto" />
        </div>
        <p className="text-gray-500 text-lg mt-4">No menu items yet.</p>
        <p className="text-gray-400 text-sm mt-2">
          Click "Add New Menu Item" to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Bar - Shows total items count */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-lg">
          <span className="text-sm font-semibold text-orange-700">
            Total Items: {items.length}
          </span>
        </div>
      </div>

      {/* Responsive Grid Layout with auto-sizing */}
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
        {items.map((item) => (
          <div key={item._id} className="h-full">
            <SellerItemCard
              item={item}
              onEditItem={onEditItem}
              onDeleteItem={handleDeleteClick}
            />
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <SellerDeleteConfirmationModal
        isOpen={deleteItem}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={ deleteItem?.name}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default SellerItemsList;
