import React from 'react';

const CustomerCartSkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4">
            <div className="flex gap-4">
              <div className="w-48 h-48 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCartSkeletonLoader;
