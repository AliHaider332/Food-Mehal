import React from 'react';
import DeliveryLiveOrder from './LiveOrder/DeliveryLiveOrder';
import DeliveryOrders from './AvaliableOrders/DeliveryOrders';
import { useGetLiveOrderQuery } from '../../services/delivery.api';
import ComponentLoading from '../ComponentLoading';
import './Deliver.css';
const DeliveryMain = () => {
  const { data, isLoading } = useGetLiveOrderQuery();

  if (isLoading) {
    return <ComponentLoading />;
  }

  return (
    <>
      {data?.live ? (
        <DeliveryLiveOrder order={data?.order} />
      ) : (
        <DeliveryOrders orders={data?.order} />
      )}
    </>
  );
};

export default DeliveryMain;
