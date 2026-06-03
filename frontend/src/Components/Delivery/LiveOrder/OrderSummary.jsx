// components/OrderSummary.js
import React from 'react';
import { MdOutlineShoppingBag } from 'react-icons/md';

const OrderSummary = ({ order }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <MdOutlineShoppingBag className="text-gray-600 text-xl" />
        <h3 className="font-semibold text-gray-800">Order Items</h3>
      </div>
      <div className="space-y-3">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {item.picture && (
                <img
                  src={item.picture}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">
              ₨{item.total?.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>₨{order.totalAmount?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Delivery Fee</span>
          <span>₨{order.shop?.deliveryFee?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2 border-t border-gray-100">
          <span>Total</span>
          <span className="text-green-600">
            ₨{(order.totalAmount + (order.shop?.deliveryFee || 0)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;