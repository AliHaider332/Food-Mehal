// components/SellerOrderProgress.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FaClock,
  FaStore,
  FaUtensils,
  FaBoxes,
  FaUserCheck,
  FaBoxOpen,
  FaMotorcycle,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const SellerOrderProgress = ({ currentStatus }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const initialRenderRef = useRef(true);

  const steps = [
    { key: 'pending', label: 'Pending', icon: FaClock, shortLabel: 'Pending' },
    { key: 'accepted', label: 'Accepted', icon: FaStore, shortLabel: 'Acc.' },
    {
      key: 'preparing',
      label: 'Preparing',
      icon: FaUtensils,
      shortLabel: 'Prep.',
    },
    { key: 'packed', label: 'Packed', icon: FaBoxes, shortLabel: 'Packed' },
    {
      key: 'delivery-accepted',
      label: 'Assigned',
      icon: FaUserCheck,
      shortLabel: 'Assign',
    },
    { key: 'picked', label: 'Picked', icon: FaBoxOpen, shortLabel: 'Pick' },
    {
      key: 'on-the-way',
      label: 'On Way',
      icon: FaMotorcycle,
      shortLabel: 'On Way',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: FaCheckCircle,
      shortLabel: 'Done',
    },
  ];

  const currentIndex = steps.findIndex((step) => step.key === currentStatus);

  // Check for mobile view - only runs on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set active step to current index only on initial load or when currentStatus changes
  // But prevent unnecessary updates if already at that step
  useEffect(() => {
    if (initialRenderRef.current) {
      setActiveStep(currentIndex >= 0 ? currentIndex : 0);
      initialRenderRef.current = false;
    } else if (currentIndex >= 0 && activeStep !== currentIndex && !isMobile) {
      // Only update activeStep on desktop when currentStatus changes
      setActiveStep(currentIndex);
    }
  }, [currentIndex, isMobile, activeStep]);

  const getStatusDescription = (status) => {
    const descriptions = {
      pending: 'Order received, waiting for confirmation',
      accepted: 'Order accepted by shop',
      preparing: 'Shop is preparing your order',
      packed: 'Order is packed and ready for pickup',
      'delivery-accepted': 'Delivery partner assigned to your order',
      picked: 'Order picked up by delivery partner',
      'on-the-way': 'Order is on the way to your location',
      delivered: 'Order delivered successfully',
      cancelled: 'Order has been cancelled',
    };
    return descriptions[status] || '';
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  if (currentStatus === 'cancelled') {
    return (
      <div className="px-4 sm:px-6 py-4 bg-red-50 border-t border-red-100">
        <div className="flex items-center justify-center gap-2 text-red-600">
          <FaTimesCircle className="text-lg sm:text-xl" />
          <span className="font-semibold text-sm sm:text-base">
            Order Cancelled
          </span>
        </div>
      </div>
    );
  }

  // Mobile Carousel View
  if (isMobile) {
    const CurrentIcon = steps[activeStep]?.icon;
    const isStepCompleted = activeStep <= currentIndex;

    return (
      <div className="px-4 py-4 border-t border-gray-100">
        {/* Mobile Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeStep > 0
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Previous step"
            >
              <FaChevronLeft className="text-sm" />
            </button>

            {/* Current Step Display */}
            <div className="flex flex-col items-center">
              <div
                className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                ${
                  isStepCompleted
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400'
                }
                ${
                  activeStep === currentIndex
                    ? 'ring-4 ring-orange-300 scale-110'
                    : ''
                }
              `}
              >
                {CurrentIcon && <CurrentIcon className="text-2xl" />}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-semibold ${
                    isStepCompleted ? 'text-orange-600' : 'text-gray-500'
                  }`}
                >
                  {steps[activeStep]?.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Step {activeStep + 1} of {steps.length}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              disabled={activeStep === steps.length - 1}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                activeStep < steps.length - 1
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Next step"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>
                {Math.round(((activeStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeStep
                    ? 'w-6 bg-orange-500'
                    : idx <= currentIndex
                    ? 'w-1.5 bg-orange-300'
                    : 'w-1.5 bg-gray-300'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Description */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
              {getStatusDescription(currentStatus)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Timeline View
  return (
    <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
      <div className="relative">
        {/* Timeline Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center flex-1 min-w-0">
                  {/* Step Circle */}
                  <div
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                      }
                      ${isCurrent ? 'ring-4 ring-orange-300 scale-110' : ''}
                    `}
                  >
                    <Icon className="text-sm sm:text-lg" />
                  </div>

                  {/* Step Label - Hide on very small screens */}
                  <div className="text-xs mt-2 text-center font-medium hidden sm:block">
                    <span
                      className={
                        isCompleted ? 'text-orange-600' : 'text-gray-400'
                      }
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Short Label for Tablet */}
                  <div className="text-xs mt-1 text-center font-medium block sm:hidden md:hidden">
                    <span
                      className={
                        isCompleted ? 'text-orange-600' : 'text-gray-400'
                      }
                    >
                      {step.shortLabel}
                    </span>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-1 sm:mx-2 rounded-full transition-all duration-500
                      ${
                        idx < currentIndex
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                          : 'bg-gray-200'
                      }
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Status Description */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3">
            {getStatusDescription(currentStatus)}
          </p>
        </div>

        {/* Progress Percentage */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full">
            <span className="text-xs text-orange-600 font-medium">
              Overall Progress
            </span>
            <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-semibold text-orange-600">
              {Math.round(((currentIndex + 1) / steps.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderProgress;
