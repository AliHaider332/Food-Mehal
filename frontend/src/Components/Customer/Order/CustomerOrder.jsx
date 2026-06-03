import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  FaShoppingCart,
  FaReceipt,
  FaChevronDown,
  FaFilter,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import CustomerSingleOrder from './CustomerSingleOrder';
import CustomerOrderHeader from './CustomerOrderHeader';
import ComponentLoading from '../../ComponentLoading';

const CustomerOrder = () => {
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.userItems);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const statusOptions = useMemo(
    () => [
      {
        value: 'All',
        label: 'Live Orders',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      {
        value: 'Delivered',
        label: 'Delivered',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        value: 'Cancelled',
        label: 'Cancelled',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      },
    ],
    []
  );

  const getStatusBadgeStyle = useCallback(
    (status) => {
      const option = statusOptions.find((opt) => opt.value === status);
      return option?.badgeColor || 'bg-gray-50 text-gray-700 border-gray-200';
    },
    [statusOptions]
  );

  const groupedOrders = useMemo(() => {
    if (!orders?.length) return [];

    switch (selectedStatus) {
      case 'All':
        return orders.filter(
          (order) =>
            order.status !== 'delivered' && order.status !== 'cancelled'
        );
      case 'Delivered':
        return orders.filter((order) => order.status === 'delivered');
      case 'Cancelled':
        return orders.filter((order) => order.status === 'cancelled');
      default:
        return [];
    }
  }, [orders, selectedStatus]);

  const handleStatusChange = useCallback((status) => {
    setSelectedStatus(status);
    setIsOpen(false);
    setIsMobileMenuOpen(false);

    // Optional: Track analytics
    if (window.gtag) {
      window.gtag('event', 'filter_orders', { status });
    }
  }, []);

  const handleBackToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleViewAllOrders = useCallback(() => {
    handleStatusChange('All');
  }, [handleStatusChange]);

  // Close dropdown on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Loading state
  if (loading) {
    return <ComponentLoading />;
  }

  // Empty state
  if (!orders?.length) {
    return (
      <div className="min-h-scree">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <CustomerOrderHeader totalOrders={0} />
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FaShoppingCart className="text-4xl sm:text-5xl text-orange-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                No Orders Yet
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Looks like you haven't placed any orders yet. Start exploring
                restaurants and order your favorite food!
              </p>
              <button
                onClick={handleBackToHome}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
              >
                Browse Restaurants
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <CustomerOrderHeader totalOrders={orders.length} />

        {/* Main Content */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            {/* Title Section */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center justify-center sm:justify-start gap-3">
                <FaReceipt className="text-orange-500 text-3xl sm:text-4xl" />
                My Orders
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track, manage, and view your order history
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-orange-300 transition-all duration-200 shadow-sm"
                aria-label="Filter orders"
              >
                <div className="flex items-center gap-2">
                  <FaFilter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Filter Orders
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-md ${getStatusBadgeStyle(
                      selectedStatus
                    )}`}
                  >
                    {selectedStatus}
                  </span>
                  <FaChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </button>

              {/* Mobile Bottom Sheet */}
              {isMobileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 animate-slideUp shadow-2xl">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Filter Orders
                      </h3>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close filter"
                      >
                        <FaTimes className="text-gray-400" />
                      </button>
                    </div>
                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center justify-between mb-2 ${
                            selectedStatus === option.value
                              ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          {selectedStatus === option.value && (
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500 text-center">
                        Showing {groupedOrders.length} order
                        {groupedOrders.length !== 1 && 's'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Filter Dropdown */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200 shadow-sm"
                aria-label="Filter orders"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2">
                  <FaFilter className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  <span className="text-sm font-medium text-gray-700">
                    Filter by:
                  </span>
                  <span
                    className={`text-sm font-semibold px-2 py-0.5 rounded-md ${getStatusBadgeStyle(
                      selectedStatus
                    )}`}
                  >
                    {selectedStatus}
                  </span>
                </div>
                <FaChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-slideDown">
                    <div className="py-2">
                      <div className="px-4 py-2 bg-gray-50">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Status
                        </p>
                      </div>
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className={`w-full text-left px-4 py-3 transition-all duration-150 flex items-center justify-between group ${
                            selectedStatus === option.value
                              ? 'bg-orange-50 text-orange-700'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          {selectedStatus === option.value && (
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Showing {groupedOrders.length} order
                        {groupedOrders.length !== 1 && 's'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {groupedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaReceipt className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No {selectedStatus === 'All' ? 'Live' : selectedStatus} Orders
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                You don't have any{' '}
                {selectedStatus === 'All'
                  ? 'active'
                  : selectedStatus.toLowerCase()}{' '}
                orders at the moment.
              </p>
              {selectedStatus !== 'All' && (
                <button
                  onClick={handleViewAllOrders}
                  className="text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors"
                >
                  View all orders →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {groupedOrders.map((order, index) => (
              <CustomerSingleOrder
                key={order._id || index}
                order={order}
                expandedOrder={expandedOrder}
                setExpandedOrder={setExpandedOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style >{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-slideDown {
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default CustomerOrder;
