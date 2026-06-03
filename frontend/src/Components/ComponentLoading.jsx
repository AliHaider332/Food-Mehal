import React from 'react';
import { FaFire } from 'react-icons/fa';

const ComponentLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FaFire className="text-orange-500 text-2xl animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">
        Loading delicious food...
      </p>
    </div>
  );
};

export default ComponentLoading;
