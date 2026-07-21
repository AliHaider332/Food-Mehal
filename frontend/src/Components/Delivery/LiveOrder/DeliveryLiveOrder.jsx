// DeliveryLiveOrder.jsx (Fixed)
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaLocationArrow, FaMotorcycle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatDateTime, getOrderStatusConfig } from '../../../utils/deliveryUtils';
import OrderTimeline from './OrderTimeline';
import OrderSummary from './OrderSummary';
import LocationInfo from './LocationInfo';
import PickOrderModal from './PickOrderModal';
import ActionCard from './ActionCard';
import { setCoordinates } from '../../../Store/auth/auth.slice';
import { getSocket } from '../../../Config/socket';
import { useUpdateOrderMutation } from '../../../services/delivery.api';
import DeliverySideOrderTracking from '../../DeliverySideOrderTracking';
import { MdOutlineDeliveryDining } from 'react-icons/md';

const DeliveryLiveOrder = ({ order }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [updateOrder] = useUpdateOrderMutation();
  // FIXED: Use array destructuring instead of object destructuring
  const [loading, setLoading] = useState(false);
  const [showPickModal, setShowPickModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order?.status || 'accepted');
  const [locationError, setLocationError] = useState(null);

  const statusConfig = getOrderStatusConfig(currentStatus);
  const shopLocation = order.shop?.location;
  const deliveryLocation = order.deliveryLocation;
  const deliveryBoyLocation = user?.location;

  const handlePickOrder = useCallback(() => setShowPickModal(true), []);

  const confirmPickOrder = useCallback(async () => {
    setLoading(true);
    try {
      const response = await updateOrder({
        orderId: order._id,
        status: 'picked',
      }).unwrap();

      if (response.success) {
        toast.success('Order picked up successfully!');
        setCurrentStatus('picked');
        setShowPickModal(false);

        // Emit socket event
        const socket = getSocket();
        socket.emit('order-picked', {
          orderId: order._id,
          deliveryBoyId: user?._id,
        });
      }
    } catch (error) {
      console.error('Error picking order:', error);
      toast.error(error?.data?.message || 'Failed to pick order');
    } finally {
      setLoading(false);
    }
  }, [order._id, updateOrder, user?._id]);

  const handleDeliverOrder = useCallback(async () => {
    setLoading(true);
    try {
      const response = await updateOrder({
        orderId: order._id,
        status: 'delivered',
      }).unwrap();

      if (response.success) {
        toast.success('Order delivered successfully! 🎉');
        setCurrentStatus('delivered');

        // Stop location tracking
        const socket = getSocket();
        socket.emit('order-delivered', {
          orderId: order._id,
          deliveryBoyId: user?._id,
        });
      }
    } catch (error) {
      console.error('Error delivering order:', error);
      toast.error(error?.data?.message || 'Failed to deliver order');
    } finally {
      setLoading(false);
    }
  }, [order._id, updateOrder, user?._id]);

  // Location tracking
  useEffect(() => {
    if (!order || currentStatus === 'delivered') return;

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported');
      return;
    }

    let watchId;
    let lastEmittedLocation = null;
    const EMIT_INTERVAL = 3000; // Emit every 5 seconds

    const startTracking = () => {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };

          dispatch(setCoordinates(newLocation.coordinates));

          // Throttle location emissions
          const now = Date.now();
          if (!lastEmittedLocation || now - lastEmittedLocation.timestamp >= EMIT_INTERVAL) {
            const socket = getSocket();
            console.log('Location is emmited');

            socket.emit('live-location', {
              user: order.user,
              orderId: order._id,
              location: newLocation,
              status: currentStatus,
            });

            lastEmittedLocation = {
              coords: newLocation.coordinates,
              timestamp: now,
            };
          }

          setLocationError(null);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.warning(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    startTracking();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [dispatch, order, currentStatus]);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMotorcycle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">No Order Found</h3>
          <p className="text-gray-500 mt-2">Please select an order to track</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg">
                  <FaMotorcycle className="text-white text-2xl md:text-3xl" />
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Live Delivery Tracking
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <p className="text-gray-500 text-sm">
                  Order #{order._id?.slice(-8)} • {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${
                statusConfig.bgColor || 'bg-blue-50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  currentStatus === 'delivered' ? 'bg-green-500' : 'bg-blue-500'
                }`}
              />
              <span
                className={`text-sm font-semibold ${statusConfig.textColor || 'text-blue-700'}`}
              >
                {statusConfig.trackingMessage || currentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Location Warning */}
          {locationError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2">
              <div className="w-5 h-5 text-yellow-600 flex-shrink-0">⚠️</div>
              <div>
                <p className="text-sm text-yellow-800 font-medium">Location Warning</p>
                <p className="text-xs text-yellow-700">{locationError}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-5">
            <OrderTimeline order={order} currentStatus={currentStatus} />
            <OrderSummary order={order} />
            <LocationInfo
              shop={order.shop}
              deliveryLocation={order?.deliveryLocation?.address || 'Delivery Address'}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Map Container */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MdOutlineDeliveryDining /> Live Tracking Map
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Real-time location updates every 5 seconds
                </p>
              </div>
              <div className="p-4">
                <DeliverySideOrderTracking
                  shopLocation={shopLocation}
                  deliveryLocation={deliveryLocation}
                  deliveryBoyLocation={deliveryBoyLocation}
                  status={currentStatus}
                />
              </div>
            </div>

            <ActionCard
              statusConfig={statusConfig}
              onPickOrder={handlePickOrder}
              onDeliverOrder={handleDeliverOrder}
              isLoading={loading}
              currentStatus={currentStatus}
              order={order}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <PickOrderModal
        isOpen={showPickModal}
        shopName={order.shop?.name}
        onConfirm={confirmPickOrder}
        onCancel={() => setShowPickModal(false)}
        isLoading={loading}
      />
    </div>
  );
};

export default DeliveryLiveOrder;

{
  /* <DynamicTrackingMap
                  shopLocation={shopLocation}
                  deliveryLocation={deliveryLocation}
                  deliveryBoyLocation={deliveryBoyLocation}
                  status={currentStatus}
                  routeStats={routeStats}
                  onRouteCalculated={setRouteStats}
                /> */
}
