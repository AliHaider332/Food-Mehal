// Components/Cart/CustomerCartConfirmationModal.jsx
import React from 'react';
import {
  FaTimes,
  FaStore,
  FaCheckCircle,
  FaGift,
  FaCreditCard,
  FaSpinner,
} from 'react-icons/fa';
import { formatPKR } from '../../../utils/cartutils';

const CustomerCartConfirmationModal = ({
  orderSummary,
  isPlacingOrder,
  onClose,
  onConfirm,
}) => {
  if (!orderSummary) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #f97316;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ea580c;
          }
          @media (max-width: 640px) {
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
          }
        `}</style>

        <div className="custom-scrollbar h-full">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center rounded-t-2xl sm:rounded-t-3xl z-10">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Confirm Order{orderSummary.shops.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                {orderSummary.shops.length} order(s) will be placed
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <FaTimes className="text-gray-500 text-lg sm:text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
            {/* Order Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
                    ORDER ID
                  </p>
                  <p className="font-mono font-bold text-xs sm:text-sm break-all">
                    {orderSummary.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">
                    DATE
                  </p>
                  <p className="text-xs sm:text-sm font-medium">
                    {orderSummary.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders by Shop */}
            {orderSummary.shops.map((shop, idx) => (
              <div
                key={idx}
                className="border-2 border-orange-100 rounded-xl sm:rounded-2xl overflow-hidden hover:border-orange-200 transition-all hover:shadow-md"
              >
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 sm:px-5 py-2.5 sm:py-3">
                  <h4 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base">
                    <FaStore className="text-sm sm:text-base" /> {shop.shopName}
                  </h4>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="space-y-2">
                    {shop.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="font-bold text-orange-600 w-6 sm:w-8 text-sm sm:text-base flex-shrink-0">
                            {item.quantity}x
                          </span>
                          <span className="text-gray-700 text-sm sm:text-base break-words flex-1">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-semibold text-sm sm:text-base whitespace-nowrap ml-2">
                          {formatPKR(item.total)} PKR
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 border-t-2 border-orange-100 bg-orange-50/50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Food Total</span>
                        <span>{formatPKR(shop.subtotal)} PKR</span>
                      </div>
                      {shop.savings > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm text-green-600">
                          <span>Savings</span>
                          <span>-{formatPKR(shop.savings)} PKR</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Delivery</span>
                        <span>{formatPKR(shop.deliveryFee)} PKR</span>
                      </div>
                      <div className="flex justify-between font-bold pt-1.5 sm:pt-2 border-t border-orange-200">
                        <span className="text-sm sm:text-base">Shop Total</span>
                        <span className="text-orange-600 text-base sm:text-lg">
                          {formatPKR(shop.total)} PKR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Overall Total Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 sticky bottom-0 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <span className="text-base sm:text-lg font-bold text-gray-800">
                  Overall Total
                </span>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {formatPKR(orderSummary.grandTotal)} PKR
                </span>
              </div>
              {orderSummary.savings > 0 && (
                <p className="text-xs sm:text-sm text-green-600 text-right mt-1 flex items-center justify-end gap-1">
                  <FaGift className="text-xs sm:text-sm" /> Saved{' '}
                  {formatPKR(orderSummary.savings)} PKR
                </p>
              )}
              <div className="mt-3 sm:mt-4 pt-3 border-t border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FaCreditCard className="text-green-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                      Payment Method
                    </p>
                    <p className="text-xs text-gray-500">Cash on Delivery</p>
                  </div>
                </div>
                <FaCheckCircle className="text-green-500 text-xl sm:text-2xl" />
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-3 bg-white/50 p-2 rounded-lg text-center">
                Pay {formatPKR(orderSummary.grandTotal)} PKR in cash when your
                order arrives
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-gray-50 p-4 sm:p-5 flex gap-3 sm:gap-4 border-t border-gray-200 rounded-b-2xl sm:rounded-b-3xl">
            <button
              onClick={onClose}
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all font-medium text-sm sm:text-base active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPlacingOrder}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
            >
              {isPlacingOrder ? (
                <>
                  <FaSpinner className="animate-spin text-sm sm:text-base" />
                  <span className="hidden sm:inline">Processing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-sm sm:text-base" />
                  <span>Confirm Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCartConfirmationModal;
