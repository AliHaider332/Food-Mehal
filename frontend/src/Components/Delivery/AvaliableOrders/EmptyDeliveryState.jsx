// DeliveryLiveOrder.js (Complete working version)
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaMotorcycle } from 'react-icons/fa';
import { useDeliveryActions } from '../../hooks/useDeliveryActions';
import {
  formatDateTime,
  getOrderStatusConfig,
} from '../../../utils/deliveryUtils';
import OrderTimeline from './OrderTimeline';
import OrderSummary from './OrderSummary';
import LocationInfo from './LocationInfo';
import ActionCard from './ActionCard';
import PickOrderModal from './PickOrderModal';
import MapModal from './MapModal';
import EmptyDeliveryState from './EmptyDeliveryState';
import DeliverySideOrderTracking from '../../DeliverySideOrderTracking';

const DeliveryLiveOrder = ({ order }) => {
  const { user } = useSelector((state) => state.auth);
  const { handleUpdateOrderStatus, loading: apiLoading } = useDeliveryActions();
  const [showPickModal, setShowPickModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [routeStats, setRouteStats] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || 'delivery-accepted'
  );

  if (!order) {
    return <EmptyDeliveryState />;
  }

  const statusConfig = getOrderStatusConfig(currentStatus);
  const shopLocation = order.shop?.location;
  const deliveryLocation = order.deliveryLocation;
  const deliveryBoyLocation = user?.location;

  const handlePickOrder = useCallback(() => setShowPickModal(true), []);

  const confirmPickOrder = useCallback(async () => {
    const updatedOrder = await handleUpdateOrderStatus(order._id, 'picked');
    if (updatedOrder) {
      setCurrentStatus('picked');
      setShowPickModal(false);
    }
  }, [order._id, handleUpdateOrderStatus]);

  const handleDeliverOrder = useCallback(async () => {
    const updatedOrder = await handleUpdateOrderStatus(order._id, 'delivered');
    if (updatedOrder) setCurrentStatus('delivered');
  }, [order._id, handleUpdateOrderStatus]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaMotorcycle className="text-blue-600 text-2xl" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Live Delivery Tracking
          </h1>
        </div>
        <div className="flex flex-wrap justify-between items-center">
          <p className="text-gray-500">
            Order #{order._id?.slice(-8)} • {formatDateTime(order.createdAt)}
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <span className="animate-pulse">●</span>
            <span>{statusConfig.trackingMessage}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-5">
          <OrderTimeline order={order} currentStatus={currentStatus} />
          <OrderSummary order={order} />
          <LocationInfo
            shop={order.shop}
            deliveryLocation={deliveryLocation}
            onViewFullMap={() => setShowMapModal(true)}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-gray-800">Live Tracking</h3>
                </div>
                {routeStats && (
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Distance:</span>
                      <span className="font-medium">
                        {routeStats.distance} km
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">ETA:</span>
                      <span className="font-medium">
                        {routeStats.duration} min
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <DeliverySideOrderTracking
                shopLocation={shopLocation}
                deliveryLocation={deliveryLocation}
                deliveryBoyLocation={deliveryBoyLocation}
                status={currentStatus}
                onRouteCalculated={setRouteStats}
              />
            </div>
          </div>

          <ActionCard
            statusConfig={statusConfig}
            onPickOrder={handlePickOrder}
            onDeliverOrder={handleDeliverOrder}
            isLoading={apiLoading}
          />
        </div>
      </div>

      {/* Modals */}
      <PickOrderModal
        isOpen={showPickModal}
        shopName={order.shop?.name}
        onConfirm={confirmPickOrder}
        onCancel={() => setShowPickModal(false)}
        isLoading={apiLoading}
      />

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        shopLocation={shopLocation}
        deliveryLocation={deliveryLocation}
        deliveryBoyLocation={deliveryBoyLocation}
        status={currentStatus}
      />
    </div>
  );
};

export default DeliveryLiveOrder;
