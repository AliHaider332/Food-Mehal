// components/delivery/DeliveryOrders.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import OrderCard from './OrderCard';
import { calculateDistance } from '../../../utils/deliveryUtils';
import RouteMapModal from './RouteMapModal';
import { useAcceptOrderMutation } from '../../../services/delivery.api';
import { FaMotorcycle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FiPackage, FiMapPin } from 'react-icons/fi';
import { MdDeliveryDining } from 'react-icons/md';

const DeliveryOrders = ({ orders }) => {
  const { user } = useSelector((state) => state.auth);
  const [acceptOrder] = useAcceptOrderMutation();
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [modalState, setModalState] = useState({
    isOpen: false,
    showRoute: false,
    selectedOrder: null,
  });

  const ordersWithDistance = useMemo(() => {
    const userLocation = user?.location?.coordinates;
    return (
      orders?.map((order) => ({
        ...order,
        distance: calculateDistance(
          userLocation,
          order?.shop?.location?.coordinates
        ),
        estimatedDeliveryTime: order.shop.deliveryTime,
        earnings: order.shop.deliveryFee || 0,
      })) || []
    );
  }, [orders, user]);

  // Sort by distance (closest first)
  const sortedOrders = useMemo(() => {
    return [...ordersWithDistance].sort((a, b) => a.distance - b.distance);
  }, [ordersWithDistance]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleAccept = useCallback(
    async (orderId) => {
      setAcceptingOrderId(orderId);
      try {
        await acceptOrder(orderId);
      } finally {
        setAcceptingOrderId(null);
      }
    },
    [acceptOrder]
  );

  const handleViewRoute = useCallback((order) => {
    setModalState({ isOpen: true, showRoute: true, selectedOrder: order });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ isOpen: false, showRoute: false, selectedOrder: null });
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Empty state
  if (!orders?.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] p-8">
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 mb-6 animate-pulse">
            <FiPackage className="w-16 h-16 text-blue-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <MdDeliveryDining className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Delivery Orders Available
          </h3>
          <p className="text-gray-500 max-w-md">
            Check back later for new orders near you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                  <FaMotorcycle className="text-blue-500 mr-3 text-3xl" />
                  Delivery Hub
                </h2>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <FiMapPin className="text-sm" />
                  Orders nearest to you first
                </p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {currentOrders.length > 0 && (
            <>
              <div className="space-y-4">
                {currentOrders.map((order, index) => (
                  <div
                    key={order._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <OrderCard
                      order={order}
                      distance={order.distance}
                      earnings={order.earnings}
                      onViewRoute={handleViewRoute}
                      onAccept={handleAccept}
                      acceptingOrderId={acceptingOrderId}
                      isExpanded={expandedOrderId === order._id}
                      onToggleExpand={() => toggleExpand(order._id)}
                    />
                  </div>
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
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          (pageNumber === currentPage - 2 && currentPage > 3) ||
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
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
          )}
        </div>
      </div>

      <RouteMapModal
        isOpen={modalState.isOpen}
        order={modalState.selectedOrder}
        onClose={closeModal}
      />
    </>
  );
};

export default DeliveryOrders;
