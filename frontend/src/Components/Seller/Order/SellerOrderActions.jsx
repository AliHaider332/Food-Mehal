// components/SellerOrderActions.jsx
import React, { useState } from 'react';
import {
  FaSync,
  FaCheck,
  FaUtensils,
  FaBoxes,
  FaTimes,
  FaArrowRight,
  FaBell,
} from 'react-icons/fa';
import SellerOrderCancel from './SellerOrderCancel';

import { useCancelShopOrderMutation } from '../../../services/shop.api';

const SellerOrderActions = ({ order, updatingOrderId, onUpdateStatus }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelOrder] = useCancelShopOrderMutation();
  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      pending: [
        {
          value: 'accepted',
          label: 'Accept Order',
          color: 'green',
          icon: FaCheck,
          description: 'Confirm and start processing',
        },
      ],
      accepted: [
        {
          value: 'preparing',
          label: 'Start Preparing',
          color: 'blue',
          icon: FaUtensils,
          description: 'Begin food preparation',
        },
      ],
      preparing: [
        {
          value: 'packed',
          label: 'Mark as Packed',
          color: 'pink',
          icon: FaBoxes,
          description: 'Ready for delivery pickup',
        },
      ],
    };

    const actions = statusFlow[currentStatus] || [];

    // Add cancel option for non-final statuses (before packed)
    if (
      currentStatus !== 'delivered' &&
      currentStatus !== 'cancelled' &&
      currentStatus !== 'packed' &&
      currentStatus !== 'delivery-accepted' &&
      currentStatus !== 'picked' &&
      currentStatus !== 'on-the-way'
    ) {
      actions.push({
        value: 'cancelled',
        label: 'Cancel Order',
        color: 'red',
        icon: FaTimes,
        description: 'Cancel this order',
        requiresConfirmation: true,
      });
    }

    return actions;
  };

  const handleCancelOrder = async (reason) => {
    setIsCancelling(true);
    try {
      const response = cancelOrder({
        id: order._id,
        role: 'seller',
        reason,
      });

      if (response.success) {
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.value === 'cancelled') {
      setShowCancelModal(true);
    } else {
      onUpdateStatus(order._id, action.value);
    }
  };

  const nextStatuses = getNextStatuses(order.status);

  if (nextStatuses.length === 0) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Info Text with Icon */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaBell className="text-orange-500 text-sm" />
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Next Step:</span>{' '}
              {nextStatuses[0]?.description || 'Update order status'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            {nextStatuses.map((action) => {
              const Icon = action.icon;
              const isLoading = updatingOrderId === order._id;

              return (
                <button
                  key={action.value}
                  onClick={() => handleActionClick(action)}
                  disabled={isLoading}
                  className={`
                    group relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-200
                    flex items-center gap-2 shadow-md hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transform hover:scale-105 active:scale-95
                    overflow-hidden
                    ${
                      action.color === 'red' &&
                      'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white'
                    }
                    ${
                      action.color === 'green' &&
                      'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    }
                    ${
                      action.color === 'blue' &&
                      'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                    }
                    ${
                      action.color === 'pink' &&
                      'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                    }
                  `}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

                  {isLoading ? (
                    <>
                      <FaSync className="animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Icon className="text-base group-hover:scale-110 transition-transform duration-200" />
                      <span>{action.label}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <SellerOrderCancel
        isOpen={showCancelModal}
        order={order}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        isCancelling={isCancelling}
      />
    </>
  );
};

export default SellerOrderActions;
