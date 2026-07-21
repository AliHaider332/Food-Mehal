import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { shopApi } from '../services/shop.api';
import { customerApi } from '../services/customer.api';
import { deliveryApi } from '../services/delivery.api';
const useSocketOperations = (socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;
    // useSocketOperations.jsx
    const handleNewOrder = (data) => {
      toast.success(data.message, { toastId: 'new-order' });

      dispatch(
        shopApi.util.updateQueryData('getShopLiveOrders', undefined, (draft) => {
          const exists = draft.order.some((order) => order._id === data.order._id);

          if (!exists) {
            draft.order.unshift(data.order);
          }
        })
      );
    };

    const handleUpdateStatusBySeller = (data) => {
      dispatch(
        customerApi.util.updateQueryData('getOrder', undefined, (draft) => {
          if (!draft.order || !Array.isArray(draft.order)) return;

          const index = draft.order.findIndex((order) => order._id === data.order._id);

          if (index !== -1) {
            draft.order[index] = data.order;
          }
        })
      );
    };

    const handleUpdateStatusByCustomer = ({ order, status }) => {
      // Update an order inside Live Orders
      const updateLiveOrder = () => {
        dispatch(
          shopApi.util.updateQueryData('getShopLiveOrders', undefined, (draft) => {
            if (!draft.order) return;

            const index = draft.order.findIndex((o) => o._id === order._id);

            if (index !== -1) {
              draft.order[index] = order;
            }
          })
        );
      };

      // Remove from Live Orders
      const removeFromLive = () => {
        dispatch(
          shopApi.util.updateQueryData('getShopLiveOrders', undefined, (draft) => {
            if (!draft.order) return;

            draft.order = draft.order.filter((o) => o._id !== order._id);
          })
        );
      };

      // Add to another cache
      const addToCache = (endpoint) => {
        dispatch(
          shopApi.util.updateQueryData(endpoint, undefined, (draft) => {
            if (!draft.order) return;

            const exists = draft.order.some((o) => o._id === order._id);

            if (!exists) {
              draft.order.unshift(order);
            }
          })
        );
      };

      switch (status) {
        case 'cancel':
          removeFromLive();
          addToCache('getShopCancelledOrders');
          break;

        case 'delivered':
          removeFromLive();
          addToCache('getShopDeliveredOrders');
          break;

        default:
          // accepted, picked, on_the_way, preparing, etc.
          updateLiveOrder();
          break;
      }
    };

    const handleOutForDeliveryOrder = (data) => {
      toast.success('New order arrived');

      dispatch(
        deliveryApi.util.updateQueryData('getLiveOrder', undefined, (draft) => {
          if (!draft.order || !Array.isArray(draft.order)) return;
          const exists = draft.order.some((order) => order._id === data.order._id);

          if (!exists) {
            draft.order.unshift(data.order);
          }
        })
      );
    };
    const handleLiveTrakingBetweenDeliveyCustomer = (data) => {
      dispatch(
        customerApi.util.updateQueryData('getOrder', undefined, (draft) => {
          if (!draft.order || !Array.isArray(draft.order)) return;

          const order = draft.order.find((o) => o._id === data.orderId);

          if (order) {
            order.deliveryBoy.location.coordinates = data.location.coordinates;
            console.log('Coordinates:', order?.deliveryBoy?.location?.coordinates);
          }
        })
      );
    };

    socket.on('new-order', handleNewOrder);
    socket.on('update-customer-order', handleUpdateStatusBySeller);
    socket.on('update-seller-order', handleUpdateStatusByCustomer);
    socket.on('new-order-to-deliver', handleOutForDeliveryOrder);
    socket.on('receive-live-location', handleLiveTrakingBetweenDeliveyCustomer);
    return () => {
      socket.off('new-order', handleNewOrder);
      socket.off('update-customer-order', handleUpdateStatusBySeller);
      socket.off('update-seller-order', handleUpdateStatusByCustomer);
      socket.off('new-order-to-deliver', handleOutForDeliveryOrder);
      socket.off('receive-live-location', handleLiveTrakingBetweenDeliveyCustomer);
    };
  }, [socket, dispatch]);
};

export default useSocketOperations;
