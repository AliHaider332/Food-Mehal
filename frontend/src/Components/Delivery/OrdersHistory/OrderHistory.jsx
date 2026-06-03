import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../Config/axios';
import DeliveredOrderCard from './DeliveredOrderCard';
import ComponentLoading from '../../ComponentLoading';
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('delivery/delivery-history');
        setOrders(res.data.order || []);
        setError(null);
      } catch (error) {
        console.log(error);
        setError('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (loading) {
    <ComponentLoading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No delivered orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <DeliveredOrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
