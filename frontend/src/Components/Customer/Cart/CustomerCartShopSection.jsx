// Components/Cart/CustomerCartShopSection.jsx
import React from 'react';
import { FaStore, FaClock, FaLeaf } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import CartItem from './CustomerCartItem';
import CustomerCartProgressBar from './CustomerCartProgressBar';
import { formatPKR } from '../../../utils/cartUtils';

const CustomerCartShopSection = ({
  shop,
  processingItem,
  onQuantityChange,
  onRemove,
}) => {
  // Use shopName instead of name
  const shopTotal = shop.subtotal + (shop.deliveryFee || 0);
  const hasMinOrder = shop.subtotal < (shop.minOrderAmount || 0);
  


  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaStore className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">
                {shop.shopName || shop.name || 'Restaurant'}
              </h3>
              <div className="flex items-center gap-3 text-white/90 text-xs flex-wrap">
                <span className="flex items-center gap-1">
                  <MdDeliveryDining /> Delivery: {formatPKR(shop.deliveryFee || 50)}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock /> {shop.deliveryTime?.min || 20}-{shop.deliveryTime?.max || 40} min
                </span>
                {shop.isOpen !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    shop.isOpen ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'
                  }`}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            <span className="text-white text-sm font-semibold">
              Min Order: {formatPKR(shop.minOrder || 100)}
            </span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100">
        {shop.items && shop.items.length > 0 ? (
          shop.items.map((item) => (
            <CartItem
              key={item.id || item._id}
              item={item}
              processingItem={processingItem}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-400">
            No items in this shop
          </div>
        )}
      </div>

      {/* Shop Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-t-2 border-orange-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="font-bold text-xl text-gray-800">
              {formatPKR(shop.subtotal || 0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Delivery Fee</p>
            <p className="font-bold text-gray-800">
              {formatPKR(shop.deliveryFee || 50)}
            </p>
          </div>
          <div className="space-y-1 bg-orange-500 px-5 py-2 rounded-xl">
            <p className="text-sm text-white/90">Shop Total</p>
            <p className="font-bold text-xl text-white">
              {formatPKR(shopTotal)}
            </p>
          </div>
        </div>

        {shop.savings > 0 && (
          <div className="mt-3 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <FaLeaf />
            <span className="text-sm font-medium">
              Saved {formatPKR(shop.savings)} on this shop!
            </span>
          </div>
        )}

        {hasMinOrder && (
          <CustomerCartProgressBar
            current={shop.subtotal || 0}
            target={shop.minOrderAmount || 100}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerCartShopSection;
