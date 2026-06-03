import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatOrderId } from '../../../utils/deliveryUtils';
import DynamicTrackingMap from '../../DynamicTrackingMap';
import {
  FiMap,
  FiX,
  FiNavigation,
  FiMapPin,
  FiClock,
  FiInfo,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  MdRestaurant,
  MdDeliveryDining,
  MdLocationOn,
  MdDirections,
} from 'react-icons/md';
import { FaMotorcycle, FaStore } from 'react-icons/fa';

const RouteMapModal = memo(({ isOpen, order, onClose }) => {
  const [mapLoading, setMapLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  if (!isOpen || !order) return null;

  const deliveryBoyLocation = user?.location;

  // Calculate estimated distance between locations (mock calculation)
  const calculateDistance = () => {
    if (
      !order?.shop?.location?.coordinates ||
      !order?.deliveryLocation?.coordinates
    )
      return null;
    const lat1 = order.shop.location.coordinates[1];
    const lon1 = order.shop.location.coordinates[0];
    const lat2 = order.deliveryLocation.coordinates[1];
    const lon2 = order.deliveryLocation.coordinates[0];
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const totalDistance = calculateDistance();
  const estimatedTime = totalDistance ? Math.ceil(totalDistance * 2) : null; // Rough estimate: 2 min per km

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <FiMap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    Delivery Route
                  </h3>
                </div>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <FaStore className="w-3 h-3" />
                  Order #{formatOrderId(order._id)} • {order.shop.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-100 transition-colors p-2 hover:bg-white/10 rounded-xl"
              >
                <FiX className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="flex flex-wrap gap-3 mt-4">
              {totalDistance && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <FiNavigation className="w-4 h-4 text-white" />
                  <div>
                    <p className="text-xs text-blue-200">Total Distance</p>
                    <p className="text-sm font-semibold text-white">
                      {totalDistance.toFixed(1)} km
                    </p>
                  </div>
                </div>
              )}
              {estimatedTime && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-white" />
                  <div>
                    <p className="text-xs text-blue-200">Est. Travel Time</p>
                    <p className="text-sm font-semibold text-white">
                      {estimatedTime} min
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-white" />
                <div>
                  <p className="text-xs text-blue-200">Delivery Fee</p>
                  <p className="text-sm font-semibold text-white">
                    ₨{order.deliveryFee?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="px-6 py-5 bg-gradient-to-br from-gray-50 to-gray-100">
            <div
              style={{ height: '480px', width: '100%' }}
              className="rounded-xl overflow-hidden shadow-xl relative"
            >
              {mapLoading && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FiMap className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                      Loading route map...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Please wait</p>
                  </div>
                </div>
              )}
              <DynamicTrackingMap
                shopLocation={order.shop.location}
                deliveryLocation={order.deliveryLocation}
                deliveryBoyLocation={deliveryBoyLocation}
                status="delivery-accepted"
                isCustomerView={false}
                onLoad={() => setMapLoading(false)}
              />
            </div>
          </div>

          {/* Route Details Footer */}
          <div className="px-6 py-5 bg-white border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pickup Location */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MdRestaurant className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    Pickup From {order.shop.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {order.shop.location.address}
                  </p>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MdLocationOn className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                    Deliver To Customer
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {order.deliveryLocation.address}
                  </p>
                </div>
              </div>

              {/* Your Location */}
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FaMotorcycle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                    Your Current Location
                  </p>
                 
                  <p className="text-xs text-gray-500 mt-1">
                    {deliveryBoyLocation?.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle directions - open in Google Maps
                  const shopCoords = order.shop.location.coordinates;
                  const deliveryCoords = order.deliveryLocation.coordinates;
                  const url = `https://www.google.com/maps/dir/${shopCoords[1]},${shopCoords[0]}/${deliveryCoords[1]},${deliveryCoords[0]}`;
                  window.open(url, '_blank');
                }}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <MdDirections className="w-4 h-4" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

RouteMapModal.displayName = 'RouteMapModal';

export default RouteMapModal;
