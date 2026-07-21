import React from 'react';
import { FaUtensils } from 'react-icons/fa';

const NotFound = React.memo(({ navigate }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FaUtensils className="text-4xl text-red-500" />
        </div>
        <p className="text-gray-500 text-lg">Item not found</p>
        <p className="text-gray-400 text-sm mt-2">
          The item you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
));

export default NotFound;
