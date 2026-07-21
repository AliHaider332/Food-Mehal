import React, { useState } from 'react';
import { FaStore } from 'react-icons/fa';
import ShopRegistrationForm from './ShopRegistrationForm';
import SellerShopDetails from './SellerShopDetails';
import ShopEditForm from './ShopEditForm';
import { useGetShopQuery } from '../../../services/shop.api';
import ComponentLoading from '../../ComponentLoading';

const SellerFront = () => {
  const [isEditingShop, setIsEditingShop] = useState(false);
  const { data, isLoading } = useGetShopQuery();
  const handleEditShop = () => {
    setIsEditingShop(true);
  };
  const handleCancelEditShop = () => {
    setIsEditingShop(false);
  };
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  if (isLoading) {
    return <ComponentLoading />;
  }

  // If no shop info, show registration form
  if (!data?.shop) {
    return <ShopRegistrationForm />;
  }

  // If shop info exists, show dashboard
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FaStore className="text-orange-500 mr-3 text-3xl" />
              Shop Dashboard
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Manage your restaurant profile and details</p>
          </div>
        </div>

        {/* Shop Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!isEditingShop ? (
            <SellerShopDetails onEdit={handleEditShop} shopData={data?.shop} />
          ) : (
            <ShopEditForm onCancel={handleCancelEditShop} shopData={data?.shop} />
          )}
        </div>

        {/* Add CSS animation */}
        <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
      </div>
    </div>
  );
};

export default SellerFront;
