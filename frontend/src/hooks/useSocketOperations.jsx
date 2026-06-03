import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { updateOrder } from '../Store/user/user.item.slice';
import { addOrder as deliveryOrderBroadCast } from '../Store/delivery/order.slice';
import { shopApi } from '../services/shop.api';
const useSocketOperations = (socket) => {
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (!socket) return;
    const handleNewOrder = (data) => {
      toast.success(data.message, { toastId: 'new-order' }); // prevent spam
      dispatch(
        shopApi.util.updateQueryData('getShopOrders', undefined, (draft) => {
          draft.unshift(data.order);
        })
      );
    };

    const handleUpdateStatusBySeller = (data) => {
      dispatch(updateOrder(data.order));
    };
    const handleUpdateStatusByCustomer = (data) => {
      dispatch(
        shopApi.util.updateQueryData('getShopOrders', undefined, (draft) => {
          draft.unshift(data.order);
        })
      );
    };
    const handleOutForDeliveryOrder = (data) => {
      dispatch(deliveryOrderBroadCast(data.order));
    };

    socket.on('new-order', handleNewOrder);
    socket.on('update-customer-order', handleUpdateStatusBySeller);
    socket.on('update-seller-order', handleUpdateStatusByCustomer);
    socket.on('new-order-to-deliver', handleOutForDeliveryOrder);
    return () => {
      socket.off('new-order', handleNewOrder);
      socket.off('update-customer-order', handleUpdateStatusBySeller);
      socket.off('update-seller-order', handleUpdateStatusByCustomer);
      socket.off('new-order-to-deliver', handleOutForDeliveryOrder);
    };
  }, [socket, dispatch]);
};

export default useSocketOperations;
