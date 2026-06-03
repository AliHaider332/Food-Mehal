// Components/Cart/CustomerCartOrderSummaryCard.jsx
import React from 'react';
import {
  FaShoppingBag,
  FaTruck,
  FaGift,
  FaMapMarkerAlt,
  FaCreditCard,
} from 'react-icons/fa';
import { formatPKR } from '../../../utils/cartutils';

const CustomerCartOrderSummaryCard = ({
  totalItems,
  subtotal,
  totalSavings,
  totalDelivery,
  grandTotal,
  address,
  onCheckout,
}) => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-8">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FaShoppingBag className="text-orange-400" />
          Order Summary
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Review your order before placing
        </p>
      </div>

      {/* Scrollable content with custom scrollbar */}
      <div
        className="custom-scrollbar"
        style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}
      >
        <div className="p-6 space-y-4">
          <div className="space-y-3 border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Subtotal ({totalItems} items)
              </span>
              <span className="font-semibold">{formatPKR(subtotal)} PKR</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <span className="flex items-center gap-1">
                  <FaGift /> Total Savings
                </span>
                <span className="font-bold">
                  -{formatPKR(totalSavings)} PKR
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-gray-600">
                <FaTruck /> Delivery Fee
              </span>
              <span className="font-semibold">
                {formatPKR(totalDelivery)} PKR
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-800">Grand Total</span>
            <span className=" text-2xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {formatPKR(grandTotal)} PKR
            </span>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 mt-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-700">Delivery Location</p>
                <p className="text-gray-500 text-xs">{address}</p>
              </div>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              Delivery Instructions
            </p>
            <p className="text-xs text-gray-600">
              Please ensure you have exact change. Our delivery partner will
              call you upon arrival.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed bottom button section */}
      <div className="p-6 pt-0">
        <button
          onClick={onCheckout}
          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
        >
          <FaShoppingBag /> Proceed to Checkout
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-4">
          <FaCreditCard />
          <span>Cash on Delivery only</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerCartOrderSummaryCard;
