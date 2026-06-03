// components/LocationInfo.js
import React from 'react';
import { FiEye } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import { FaStore } from 'react-icons/fa';

const LocationInfo = ({ shop, deliveryLocation }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <FaStore className="text-blue-500" />
          <h3 className="font-semibold text-gray-800">Pickup Location</h3>
        </div>
        <p className="text-sm text-gray-600">{shop?.name}</p>
        <p className="text-xs text-gray-400 font-mono mt-1">
          {shop?.location?.address}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <MdLocationOn className="text-red-500 text-xl" />
          <h3 className="font-semibold text-gray-800">Delivery Location</h3>
        </div>
        <p className="text-sm text-gray-600">Customer Address</p>
        <p className="text-xs text-gray-400 font-mono mt-1">
          {deliveryLocation}
        </p>
      </div>
    </div>
  );
};

export default LocationInfo;
