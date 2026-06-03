// components/SellerOrderCancel.jsx
import React, { useState, useEffect } from 'react';
import {
  FaExclamationTriangle,
  FaQuestionCircle,
  FaSync,
  FaBan,
  FaTimes,
  FaStore,
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaUtensils,
  FaMoneyBillWave,
  FaReceipt
} from 'react-icons/fa';
import { GoAlertFill } from "react-icons/go";
import { motion, AnimatePresence } from 'framer-motion';

const SellerOrderCancel = ({
  order,
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
}) => {
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const cancellationReasons = [
    {
      id: 'out_of_stock',
      label: 'Out of Stock',
      icon: FaStore,
      description: 'Item is not available in inventory',
      color: 'orange',
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200',
      hoverClass: 'hover:border-orange-300',
      iconBgClass: 'bg-orange-100',
      iconColorClass: 'text-orange-600',
      selectedBgClass: 'bg-orange-50 border-orange-500',
      checkColor: 'text-orange-500'
    },
    {
      id: 'unable_to_prepare',
      label: 'Unable to Prepare',
      icon: FaUtensils,
      description: 'Cannot prepare this order due to kitchen constraints',
      color: 'red',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      hoverClass: 'hover:border-red-300',
      iconBgClass: 'bg-red-100',
      iconColorClass: 'text-red-600',
      selectedBgClass: 'bg-red-50 border-red-500',
      checkColor: 'text-red-500'
    },
    {
      id: 'customer_request',
      label: 'Customer Requested',
      icon: FaUser,
      description: 'Customer asked to cancel the order',
      color: 'blue',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      hoverClass: 'hover:border-blue-300',
      iconBgClass: 'bg-blue-100',
      iconColorClass: 'text-blue-600',
      selectedBgClass: 'bg-blue-50 border-blue-500',
      checkColor: 'text-blue-500'
    },
    {
      id: 'delivery_issue',
      label: 'Delivery Issue',
      icon: FaMapMarkerAlt,
      description: 'Problems with delivery address or partner',
      color: 'purple',
      bgClass: 'bg-purple-50',
      borderClass: 'border-purple-200',
      hoverClass: 'hover:border-purple-300',
      iconBgClass: 'bg-purple-100',
      iconColorClass: 'text-purple-600',
      selectedBgClass: 'bg-purple-50 border-purple-500',
      checkColor: 'text-purple-500'
    },
    {
      id: 'technical_error',
      label: 'Technical Error',
      icon: GoAlertFill,
      description: 'System or payment processing error',
      color: 'cyan',
      bgClass: 'bg-cyan-50',
      borderClass: 'border-cyan-200',
      hoverClass: 'hover:border-cyan-300',
      iconBgClass: 'bg-cyan-100',
      iconColorClass: 'text-cyan-600',
      selectedBgClass: 'bg-cyan-50 border-cyan-500',
      checkColor: 'text-cyan-500'
    },
    {
      id: 'other',
      label: 'Other',
      icon: FaQuestionCircle,
      description: 'Other reason not listed above',
      color: 'gray',
      bgClass: 'bg-gray-50',
      borderClass: 'border-gray-200',
      hoverClass: 'hover:border-gray-300',
      iconBgClass: 'bg-gray-100',
      iconColorClass: 'text-gray-600',
      selectedBgClass: 'bg-gray-50 border-gray-500',
      checkColor: 'text-gray-500'
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCancelReason('');
      setOtherReason('');
      setSelectedReason('');
    }
  }, [isOpen]);

  const getFullReason = () => {
    if (selectedReason === 'other') {
      return otherReason;
    }
    const reason = cancellationReasons.find((r) => r.id === selectedReason);
    return reason?.label || '';
  };

  const handleConfirm = () => {
    if (getFullReason()) {
      onConfirm(getFullReason());
    }
  };

  if (!isOpen) return null;

  // Calculate order total
  const orderTotal = order.totalAmount || 0;
  const itemCount = order.items?.length || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
              <div className="absolute inset-0 bg-white opacity-10"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full opacity-20 blur-3xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaExclamationTriangle className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Cancel Order
                    </h3>
                    <p className="text-white/80 text-sm mt-0.5">
                      Please provide cancellation reason
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <FaTimes className="text-white text-sm" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Order Summary Card */}
              <div className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Order Summary
                  </p>
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-lg">
                    <FaClock className="text-orange-600 text-xs" />
                    <span className="text-xs font-medium text-orange-600">
                      Pending Cancellation
                    </span>
                  </div>
                </div>
                
                {/* Order Items Preview */}
                <div className="mb-3 max-h-32 overflow-y-auto border-b border-gray-200 pb-3">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-1">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-800 font-medium">₨ {item.price?.toLocaleString()}</span>
                    </div>
                  ))}
                  {itemCount > 3 && (
                    <p className="text-xs text-gray-500 mt-1">+{itemCount - 3} more items</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order ID</span>
                    <span className="text-sm font-mono font-semibold text-gray-900">
                      #{order._id?.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                      ₨ {orderTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancellation Reason Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Reason for Cancellation{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cancellationReasons.map((reason) => {
                    const Icon = reason.icon;
                    const isSelected = selectedReason === reason.id;

                    return (
                      <button
                        key={reason.id}
                        onClick={() => {
                          setSelectedReason(reason.id);
                          if (reason.id !== 'other') {
                            setCancelReason(reason.label);
                          } else {
                            setCancelReason('');
                          }
                        }}
                        className={`
                          group relative p-3 rounded-xl text-left transition-all duration-200
                          ${isSelected 
                            ? `${reason.selectedBgClass} border-2 shadow-md` 
                            : `${reason.bgClass} border ${reason.borderClass} ${reason.hoverClass}`
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected ? reason.iconBgClass : 'bg-gray-200'
                            }`}
                          >
                            <Icon
                              className={`text-sm ${
                                isSelected ? reason.iconColorClass : 'text-gray-500'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm font-semibold ${
                                isSelected ? reason.iconColorClass : 'text-gray-700'
                              }`}
                            >
                              {reason.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {reason.description}
                            </p>
                          </div>
                          {isSelected && (
                            <FaCheckCircle className={`${reason.checkColor} text-sm`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Other Reason Textarea */}
              {selectedReason === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify reason
                  </label>
                  <textarea
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                    placeholder="Enter detailed reason for cancellation..."
                  />
                </motion.div>
              )}

              {/* Financial Impact */}
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <FaMoneyBillWave className="text-green-600 text-sm mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-800">
                      Refund Information
                    </p>
                    <p className="text-xs text-green-700 mt-0.5">
                      Customer will receive a full refund of ₨ {orderTotal.toLocaleString()} 
                      within 5-7 business days after cancellation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GoAlertFill className="text-amber-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Important Information
                    </p>
                    <div className="text-xs text-amber-700 mt-1 space-y-1">
                      <p>• Customer will be notified immediately about cancellation</p>
                      <p>• Refund will be processed within 5-7 business days if applicable</p>
                      <p className="font-semibold">• This action cannot be reversed once confirmed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info (if available) */}
              {order.customer && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <FaReceipt className="text-blue-600" />
                    Customer Details
                  </p>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      <span>{order.customer.name || 'Customer'}</span>
                    </div>
                    {order.customer.phone && (
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-blue-500" />
                        <span>{order.customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium hover:shadow-sm"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirm}
                disabled={!getFullReason() || isCancelling}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isCancelling ? (
                  <>
                    <FaSync className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaBan className="text-sm" />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SellerOrderCancel;