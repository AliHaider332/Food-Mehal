// Components/Cart/CustomerCartShopSection.jsx
import React from 'react';
import { FaStore, FaClock, FaLeaf } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import CartItem from './CustomerCartItem';
import CustomerCartProgressBar from './CustomerCartProgressBar';
import { formatPKR } from '../../../utils/cartutils';

const CustomerCartShopSection = ({
  shop,
  processingItem,
  onQuantityChange,
  onRemove,
}) => {
  const shopTotal = shop.subtotal + shop.deliveryFee;

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaStore className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">{shop.name}</h3>
              <div className="flex items-center gap-3 text-white/90 text-xs">
                <span className="flex items-center gap-1">
                  <MdDeliveryDining /> Delivery: {formatPKR(shop.deliveryFee)}{' '}
                  PKR
                </span>
                <span className="flex items-center gap-1">
                  <FaClock /> {shop.deliveryTime?.min}-{shop.deliveryTime?.max}{' '}
                  min
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            <span className="text-white text-sm font-semibold">
              Min Order: {formatPKR(shop.minOrder)}
            </span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100">
        {shop.items.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            processingItem={processingItem}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Shop Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-t-2 border-orange-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="font-bold text-xl text-gray-800">
              {formatPKR(shop.subtotal)} PKR
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Delivery Fee</p>
            <p className="font-bold text-gray-800">
              {formatPKR(shop.deliveryFee)} PKR
            </p>
          </div>
          <div className="space-y-1 bg-orange-500 px-5 py-2 rounded-xl">
            <p className="text-sm text-white/90">Shop Total</p>
            <p className="font-bold text-xl text-white">
              {formatPKR(shopTotal)} PKR
            </p>
          </div>
        </div>

        {shop.savings > 0 && (
          <div className="mt-3 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <FaLeaf />
            <span className="text-sm font-medium">
              Saved {formatPKR(shop.savings)} PKR on this shop!
            </span>
          </div>
        )}

        {shop.subtotal < shop.minOrder && (
          <CustomerCartProgressBar
            current={shop.subtotal}
            target={shop.minOrder}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerCartShopSection;
