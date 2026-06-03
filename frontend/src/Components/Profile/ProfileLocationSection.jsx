import React, { useState } from 'react';
import { MdLocationOn, MdMyLocation } from 'react-icons/md';
import { FaSpinner, FaCheckCircle, FaMapMarkerAlt, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

const ProfileLocationSection = ({ location, userLocation, onGetLocation, isGettingLocation, locationError }) => {
  const [showLocationInfo, setShowLocationInfo] = useState(false);

  return (
    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <label className="text-xs font-semibold text-teal-500 uppercase tracking-wide flex items-center">
          <MdLocationOn className="mr-1" />
          Location Coordinates
        </label>
        <div className="flex gap-2">
          {location?.coordinates && (
            <button
              onClick={() => setShowLocationInfo(!showLocationInfo)}
              className="text-teal-500 hover:text-teal-600 text-xs flex items-center"
            >
              <FaInfoCircle className="mr-1" />
              {showLocationInfo ? 'Hide' : 'Details'}
            </button>
          )}
          <button
            onClick={onGetLocation}
            disabled={isGettingLocation}
            className="text-xs bg-teal-500 text-white px-2 py-1 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {isGettingLocation ? (
              <FaSpinner className="animate-spin text-xs" />
            ) : (
              <MdMyLocation className="text-xs" />
            )}
            <span>Update</span>
          </button>
        </div>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="bg-red-50 rounded-lg p-2 mb-3 border border-red-200">
          <p className="text-xs text-red-700 flex items-center">
            <FaInfoCircle className="mr-1 text-xs" />
            {locationError}
          </p>
        </div>
      )}

      {/* New Location Captured */}
      {location?.coordinates && location !== userLocation && (
        <div className="bg-green-50 rounded-lg p-2 mb-3 border border-green-200">
          <p className="text-xs text-gray-700 flex items-center">
            <FaCheckCircle className="text-green-500 mr-1 text-xs" />
            <span className="font-mono text-xs">
              New: {location.coordinates[1].toFixed(6)}, {location.coordinates[0].toFixed(6)}
            </span>
          </p>
        </div>
      )}

      {/* Current saved location display */}
      {userLocation?.coordinates && !location && (
        <div className="bg-blue-50 rounded-lg p-2 mb-3 border border-blue-200">
          <p className="text-xs text-gray-700 flex items-center">
         
            <span className="font-mono text-xs">
              Current: {userLocation.coordinates[1].toFixed(6)}, {userLocation.coordinates[0].toFixed(6)}
            </span>
          </p>
        </div>
      )}

      {/* Display current location */}
      {(location?.coordinates || userLocation?.coordinates) && (
        <div className="space-y-2">
          <p className="text-gray-800 flex items-center font-mono text-sm">
       
            Lat: {(location?.coordinates?.[1] || userLocation?.coordinates?.[1])?.toFixed(6)}, 
            Lng: {(location?.coordinates?.[0] || userLocation?.coordinates?.[0])?.toFixed(6)}
          </p>
          {showLocationInfo && (
            <a
              href={`https://www.google.com/maps?q=${location?.coordinates?.[1] || userLocation?.coordinates?.[1]},${location?.coordinates?.[0] || userLocation?.coordinates?.[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 text-xs flex items-center mt-2 inline-flex"
            >
              <FaExternalLinkAlt className="mr-1 text-xs" />
              <span>View on Google Maps</span>
            </a>
          )}
        </div>
      )}

      {!location?.coordinates && !userLocation?.coordinates && (
        <p className="text-sm text-gray-500 italic">No location set</p>
      )}
    </div>
  );
};

export default ProfileLocationSection;