import React from 'react';

const ItemSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-gray-200"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
      </div>
    </div>
  </div>
);

export default ItemSkeleton;
