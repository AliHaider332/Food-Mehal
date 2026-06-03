/* eslint-disable react-hooks/rules-of-hooks */
// components/SellerOrder.jsx
import React, { useState, useMemo } from 'react';
import {
  FaStore,
  FaFire,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import SellerOrderFilterBar from './SellerOrderFilterBar';
import SellerOrderCard from './SellerOrderCard';
import SellerOrderEmptyState from './SellerOrderEmptyState';
import { toast } from 'react-toastify';
import ComponentLoading from '../../ComponentLoading';
import {
  useGetShopLiveOrdersQuery,
  useGetShopDeliveredOrdersQuery,
  useGetShopCancelledOrdersQuery,
  useUpdateShopOrderMutation,
} from '../../../services/shop.api';

const SellerOrder = () => {
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('live');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [updateOrder] = useUpdateShopOrderMutation();

  // Conditionally fetch data based on filter status
  const {
    data: liveOrder,
    isLoading: liveOrderLoading,
    refetch: refetchLive,
  } = useGetShopLiveOrdersQuery(undefined, {
    skip: filterStatus !== 'live',
  });

  const {
    data: deliveredOrder,
    isLoading: deliveredOrderLoading,
    refetch: refetchDelivered,
  } = useGetShopDeliveredOrdersQuery(undefined, {
    skip: filterStatus !== 'delivered',
  });

  const {
    data: cancelledOrder,
    isLoading: cancelledOrderLoading,
    refetch: refetchCancelled,
  } = useGetShopCancelledOrdersQuery(undefined, {
    skip: filterStatus !== 'cancelled',
  });

  // Determine current loading state and orders based on filter
  const isLoading =
    liveOrderLoading || deliveredOrderLoading || cancelledOrderLoading;

  // Get orders based on filter status - FIXED MAPPING
  const getFilteredOrders = () => {
    if (filterStatus === 'live') {
      return liveOrder?.order || [];
    } else if (filterStatus === 'delivered') {
      return deliveredOrder?.order || [];
    } else if (filterStatus === 'cancelled') {
      return cancelledOrder?.order || [];
    }
    return [];
  };

  // Sort orders by date (newest first)
  const filteredOrders = useMemo(() => {
    const orders = getFilteredOrders();
    if (!orders || !Array.isArray(orders)) return [];
    return [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [liveOrder, deliveredOrder, cancelledOrder, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filter changes
  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
    setCurrentPage(1);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await updateOrder({
        id: orderId,
        status: newStatus,
      }).unwrap();

      if (response.success) {
        // Show toast notifications for different status updates
        const statusMessages = {
          packed:
            'Order marked as packed! Delivery partners have been notified.',
          accepted: 'Order has been accepted successfully!',
          preparing: 'Order is now being prepared.',
          'on-the-way': 'Order is on the way to customer!',
          delivered: 'Order has been delivered successfully! 🎉',
          cancelled: 'Order has been cancelled.',
        };

        const message = statusMessages[newStatus];
        if (message) {
          if (newStatus === 'delivered') {
            toast.success(message);
          } else if (newStatus === 'cancelled') {
            toast.error(message);
          } else {
            toast.info(message);
          }
        }

        // Refetch current orders after update
        if (filterStatus === 'live') {
          refetchLive();
        } else if (filterStatus === 'delivered') {
          refetchDelivered();
        } else if (filterStatus === 'cancelled') {
          refetchCancelled();
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(
        error?.data?.message ||
          'Failed to update order status. Please try again.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Get header info based on filter
  const getHeaderInfo = () => {
    const headers = {
      live: {
        title: 'Live Orders',
        icon: FaFire,
        color: 'orange',
        description: 'Active orders that need your attention',
        bgGradient: 'from-orange-500 to-amber-500',
        statsColor: 'bg-orange-100 text-orange-700',
      },
      delivered: {
        title: 'Delivered Orders',
        icon: FaCheckCircle,
        color: 'green',
        description: 'Successfully completed orders',
        bgGradient: 'from-green-500 to-emerald-500',
        statsColor: 'bg-green-100 text-green-700',
      },
      cancelled: {
        title: 'Cancelled Orders',
        icon: FaTimesCircle,
        color: 'red',
        description: 'Orders that were cancelled',
        bgGradient: 'from-red-500 to-rose-500',
        statsColor: 'bg-red-100 text-red-700',
      },
    };
    return headers[filterStatus] || headers.live;
  };

  const headerInfo = getHeaderInfo();
  const HeaderIcon = headerInfo.icon;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FaStore className="text-orange-500 mr-3 text-3xl" />
              Order Management
            </h2>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <FaClock className="text-sm" />
              Track, manage, and update your orders in real-time
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        {
          <SellerOrderFilterBar
            filterStatus={filterStatus}
            setFilterStatus={handleFilterChange}
            totalLiveOrders={filteredOrders?.length}
          />
        }

        {/* Active Filter Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${headerInfo.statsColor}`}>
              <HeaderIcon className="text-sm" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {headerInfo.title}
              </h2>
              <p className="text-sm text-gray-500">{headerInfo.description}</p>
            </div>
          </div>
        </div>
        {isLoading && <ComponentLoading />}

        {/* Empty State */}
        {(!filteredOrders || filteredOrders.length === 0) && (
          <SellerOrderEmptyState />
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 && (
          <>
            {currentOrders.length > 0 ? (
              <>
                {/* Order Cards */}
                <div className="space-y-4">
                  {currentOrders.map((order) => (
                    <SellerOrderCard
                      key={order._id}
                      order={order}
                      updatingOrderId={updatingOrderId}
                      onUpdateStatus={updateOrderStatus}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center gap-2 bg-white rounded-xl shadow-sm p-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                      >
                        <FaArrowLeft className="text-sm" />
                      </button>

                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          // Show first, last, current, and neighbors
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  currentPage === pageNumber
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (
                            (pageNumber === currentPage - 2 &&
                              currentPage > 3) ||
                            (pageNumber === currentPage + 2 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <span
                                key={pageNumber}
                                className="w-8 text-center text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                      >
                        <FaArrowRight className="text-sm" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              // No orders for current filter
              <SellerOrderEmptyState />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SellerOrder;
