import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorDisplay = React.memo(({ error, onRetry }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-red-50 rounded-2xl shadow-lg p-12 text-center border border-red-200">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FaExclamationTriangle className="text-4xl text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Item</h3>
        <p className="text-gray-600 mb-4">
          {error?.data?.message ||
            error?.message ||
            'Something went wrong while loading the item details.'}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
));

export default ErrorDisplay
