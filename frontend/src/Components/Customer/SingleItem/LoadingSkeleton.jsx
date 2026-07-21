import React from 'react';

const LoadingSkeleton = React.memo(() => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-32 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-gray-200 rounded-2xl h-96"></div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
));

export default LoadingSkeleton;
