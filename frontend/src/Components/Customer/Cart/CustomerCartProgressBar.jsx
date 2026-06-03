// Components/Cart/ProgressBar.jsx
import React from 'react';
import { formatPKR } from '../../../utils/cartutils';

const CustomerCartProgressBar = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = target - current;

  if (remaining <= 0) return null;

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-amber-600">
          Add {formatPKR(remaining)} more to meet min order
        </span>
        <span className="text-gray-500">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CustomerCartProgressBar;
