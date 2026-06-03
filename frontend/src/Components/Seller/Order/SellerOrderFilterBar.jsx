// components/SellerOrderFilterBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  FaFilter,
  FaChevronDown,
  FaTimes,
  FaCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFire,
} from 'react-icons/fa';

const SellerOrderFilterBar = ({
  filterStatus,
  setFilterStatus,
  totalLiveOrders,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Define filter options with three main categories
  const statusOptions = [
    {
      value: 'live',
      label: 'Live Orders',
      icon: FaFire,
      color: 'orange',
      description: 'Active and in-progress orders',
      statuses: [
        'pending',
        'accepted',
        'preparing',
        'packed',
        'delivery-accepted',
        'picked',
        'on-the-way',
      ],
    },
    {
      value: 'delivered',
      label: 'Delivered',
      icon: FaCheckCircle,
      color: 'green',
      description: 'Successfully completed orders',
      statuses: ['delivered'],
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      icon: FaTimesCircle,
      color: 'red',
      description: 'Cancelled or refunded orders',
      statuses: ['cancelled'],
    },
  ];

  // Get current selected option
  const getSelectedOption = () => {
    if (filterStatus === 'live') return statusOptions[0];
    if (filterStatus === 'delivered') return statusOptions[1];
    if (filterStatus === 'cancelled') return statusOptions[2];
    // Default to live if no match
    return statusOptions[0];
  };

  const selectedOption = getSelectedOption();
  const SelectedIcon = selectedOption.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle status change
  const handleStatusChange = (value) => {
    setFilterStatus(value);
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      live: 'bg-orange-100 text-orange-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="mb-6 sm:mb-8 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        {/* Live Orders Counter - Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-orange-700">
              {totalLiveOrders} {filterStatus === 'live' && 'Live'} Orders{' '}
              {filterStatus === 'cancelled' && 'Cancelled'}
              {filterStatus === 'delivered' && 'Delivered'}
            </span>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-orange-300 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <FaFilter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Filter Orders
              </span>
            </div>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded-md ${getStatusBadgeStyle(
                selectedOption.value
              )}`}
            >
              {selectedOption.label}
            </span>
            <FaChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {/* Desktop Dropdown */}
        <div className="hidden sm:block relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <FaFilter className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700">
                Filter by:
              </span>
              <span
                className={`text-sm font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5 ${getStatusBadgeStyle(
                  selectedOption.value
                )}`}
              >
                <SelectedIcon className="text-xs" />
                {selectedOption.label}
              </span>
            </div>
            <FaChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-slideDown">
                {/* Options */}
                <div className="py-2">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedOption.value === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full text-left px-4 py-3 transition-all duration-150 flex items-center justify-between group hover:bg-gray-50 ${
                          isSelected ? 'bg-orange-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              option.color === 'orange'
                                ? 'bg-orange-100'
                                : option.color === 'green'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                            }`}
                          >
                            <Icon
                              className={`text-sm ${
                                option.color === 'orange'
                                  ? 'text-orange-600'
                                  : option.color === 'green'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {option.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results Count - Mobile */}
      <div className="mt-4 sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-orange-700">
              {totalLiveOrders} Live
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 animate-slideUp">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filter Orders
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select order type to filter
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Options */}
            <div className="p-4">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOption.value === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center justify-between mb-2 ${
                      isSelected
                        ? 'bg-orange-50 border border-orange-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          option.color === 'orange'
                            ? 'bg-orange-100'
                            : option.color === 'green'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }`}
                      >
                        <Icon
                          className={`text-lg ${
                            option.color === 'orange'
                              ? 'text-orange-600'
                              : option.color === 'green'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {option.label}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-xs" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium text-sm"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerOrderFilterBar;
