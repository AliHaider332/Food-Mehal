// components/OrderTimeline.js
import React from 'react';
import { FiClock, FiCheckCircle, FiPackage } from 'react-icons/fi';
import { formatDateTime } from "../../../utils/deliveryUtils"

const OrderTimeline = ({ order, currentStatus }) => {
  const getStepStatus = (step) => {
    const steps = {
      1:
        currentStatus === 'delivery-accepted' ||
        currentStatus === 'picked' ||
        currentStatus === 'delivered',
      2: currentStatus === 'picked' || currentStatus === 'delivered',
      3: currentStatus === 'delivered',
    };
    return steps[step];
  };

  const steps = [
    {
      step: 1,
      label: 'Order Accepted',
      time: order.updatedAt,
      active: getStepStatus(1),
      icon: <FiCheckCircle className="w-4 h-4" />,
    },
    {
      step: 2,
      label: 'Order Picked Up',
      time:
        currentStatus === 'picked' || currentStatus === 'delivered'
          ? new Date().toISOString()
          : null,
      active: getStepStatus(2),
      icon: <FiPackage className="w-4 h-4" />,
    },
    {
      step: 3,
      label: 'Delivered to Customer',
      time: currentStatus === 'delivered' ? new Date().toISOString() : null,
      active: getStepStatus(3),
      icon: <FiCheckCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiClock className="text-blue-500" />
        Delivery Status
      </h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-6 relative">
          {steps.map((step) => (
            <div key={step.step} className="flex gap-3 relative">
              <div
                className={`z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.active ? (
                  step.icon
                ) : (
                  <span className="text-xs">{step.step}</span>
                )}
              </div>
              <div>
                <p
                  className={`font-medium ${
                    step.active ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                {step.time && (
                  <p className="text-xs text-gray-400">
                    {formatDateTime(step.time)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
