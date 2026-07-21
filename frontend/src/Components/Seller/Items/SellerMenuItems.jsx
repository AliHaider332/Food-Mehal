import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdRestaurantMenu } from 'react-icons/md';
import SellerItemForm from './SellerItemForm';
import SellerItemsList from './SellerItemsList';
import { useGetShopItemsQuery } from '../../../services/shop.api';
import ComponentLoading from '../../ComponentLoading';

const SellerMenuItems = () => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { data, isLoading } = useGetShopItemsQuery();

  const handleAddItem = () => {
    setIsAddingItem(true);
    setEditingItem(null);
  };

  const handleEditItem = (item) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setEditingItem(item);
    setIsAddingItem(false);
  };

  const handleCancelItemForm = () => {
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const handleItemSuccess = () => {
    setIsAddingItem(false);
    setEditingItem(null);
  };
  if (isLoading) {
    return <ComponentLoading />;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Stats */}
        {!isAddingItem && !editingItem && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                  <MdRestaurantMenu className="text-orange-500 mr-3 text-3xl" />
                  Menu Management
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Manage your restaurant's menu items, prices, and availability
                </p>
              </div>


              <button
                onClick={handleAddItem}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Add New Item</span>
              </button>
            </div>
          </div>
        )}

        {/* Item Form */}
        {(isAddingItem || editingItem) && (
          <div className="mb-8 animate-slide-down">
            <SellerItemForm
              isEditing={editingItem}
              editData={editingItem}
              onCancel={handleCancelItemForm}
              onSuccess={handleItemSuccess}
            />
          </div>
        )}

        {/* Items List Section */}

        <div className="p-6">
          <SellerItemsList onEditItem={handleEditItem} items={data.items} />
        </div>
      </div>
    </div>
  );
};

export default SellerMenuItems;
