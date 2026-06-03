import React from 'react';
import { formatDate } from '../../../utils/deliveryUtils';
const DeliveredOrderCard = ({ order }) => {
  

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Shop Header */}
      <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
        <img
          src={order.shop?.picture}
          alt={order.shop?.name}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{order.shop?.name}</h3>
          <p className="text-xs text-gray-500">
            Ordered on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
          Delivered
        </div>
      </div>

      {/* Items List */}
      <div className="p-4">
        <div className="space-y-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-500 text-sm w-6">
                  {item.quantity}×
                </span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-600 text-sm">₨{item.total}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-3"></div>

        {/* Order Summary */}
        <div className="flex justify-between items-center pt-1">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-lg font-bold text-gray-800">
            ₨{order.totalAmount}
          </span>
        </div>

        {order.totalSavings > 0 && (
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-green-600">You saved</span>
            <span className="text-green-600">₨{order.totalSavings}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveredOrderCard;
