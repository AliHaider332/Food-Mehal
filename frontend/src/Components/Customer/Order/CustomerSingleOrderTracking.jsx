import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicTrackingMap from '../../DynamicTrackingMap';
import { FaMapMarkerAlt, FaStore, FaRoute, FaMotorcycle } from 'react-icons/fa';
import { getSocket } from '../../../Config/socket';
import { setDeliveryBoyLocation } from '../../../Store/user/user.item.slice';
const CustomerSingleOrderTracking = memo(({ setShowTracking, order }) => {
  const [trackingStats, setTrackingStats] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const shopLocation = order.shop?.location;
  const deliveryLocation = user?.location;
  const deliveryBoyLocation = order.deliveryLocation;
  console.log('hi', setShowTracking, order);

  useEffect(() => {
    const socket = getSocket();
    const handleLiveLocation = (data) => {
      console.log('jfjs');

      if (data.orderId !== order._id) return;
      dispatch(
        setDeliveryBoyLocation({ orderId: order._id, location: data.location })
      );
    };
    socket.on('receive-live-location', handleLiveLocation);
    return () => {
      socket.off('receive-live-location', handleLiveLocation);
    };
  }, [dispatch, order._id]);
  return (
    <div className="border-b border-gray-200">
      <div className="relative">
        {/* Tracking Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaRoute className="text-orange-500" />
            <h3 className="font-semibold text-gray-800">Live Tracking</h3>
          </div>
          <button
            onClick={() => setShowTracking(false)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Hide Map
          </button>
        </div>

        {/* Map Container */}
        <div className="p-4" style={{ height: '450px' }}>
          <DynamicTrackingMap
            shopLocation={shopLocation}
            deliveryLocation={deliveryLocation}
            deliveryBoyLocation={deliveryBoyLocation}
            status={order.status}
            onRouteCalculated={setTrackingStats}
            isCustomerView={true}
          />
        </div>

        {/* Tracking Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 border-t border-gray-200">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FaStore className="text-blue-500 text-sm" />
              <p className="text-xs font-medium text-gray-500">RESTAURANT</p>
            </div>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {order.shop?.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">Ready to serve you</p>
          </div>

          {order.status?.toLowerCase() === 'picked' && (
            <div className="bg-orange-50 rounded-lg p-3 shadow-sm border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <FaMotorcycle className="text-orange-500 text-sm" />
                <p className="text-xs font-medium text-orange-600">
                  DELIVERY PARTNER
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                On the way to you
              </p>
              {trackingStats && (
                <p className="text-xs text-orange-600 mt-1">
                  {trackingStats.distance} km away • {trackingStats.duration}{' '}
                  min ETA
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt className="text-green-500 text-sm" />
              <p className="text-xs font-medium text-gray-500">YOUR LOCATION</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {user?.location.address}
            </p>
            <p className="text-xs text-gray-400 mt-1">Ready for delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CustomerSingleOrderTracking;
