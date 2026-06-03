// components/ActionCard.js
import React from 'react';
import { FiPackage, FiCheckCircle, FiLoader } from 'react-icons/fi';

const ActionCard = ({ statusConfig, onPickOrder, onDeliverOrder, isLoading }) => {
  const getColorClass = () => {
    switch (statusConfig.color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      case 'green': return 'from-green-500 to-green-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  // Add description if not present
  const description = statusConfig.description || 
    (statusConfig.step === 1 ? 'Head to the restaurant to pick up the order' :
     statusConfig.step === 2 ? 'Order picked up. Deliver to customer location.' :
     'Order successfully delivered');

  return (
    <div className={`col-span-3 mt-2 bg-gradient-to-r ${getColorClass()} p-5 rounded-xl shadow-sm`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-white">
          <p className="text-sm opacity-90">{description}</p>
          <p className="text-2xl font-bold mt-1">{statusConfig.label}</p>
        </div>
        {statusConfig.action && statusConfig.step === 1 && (
          <button
            onClick={onPickOrder}
            disabled={isLoading}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiPackage className="w-5 h-5" />}
            {statusConfig.action}
          </button>
        )}
        {statusConfig.action && statusConfig.step === 2 && (
          <button
            onClick={onDeliverOrder}
            disabled={isLoading}
            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiCheckCircle className="w-5 h-5" />}
            {statusConfig.action}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionCard;