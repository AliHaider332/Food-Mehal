// components/SellerShopDetails.jsx
import React, { useState } from 'react';
import {
  FaStore,
  FaShoppingCart,
  FaUtensils,
  FaTruck,
  FaPhone,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRegSmile,
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import SellerShopReviews from './SellerShopReviews';

const SellerShopDetails = ({ onEdit, shopData }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!shopData?.reviews || shopData.reviews.length === 0) return 0;
    const sum = shopData.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return (sum / shopData.reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const totalReviews = shopData?.reviews?.length || 0;

  // Format phone number for better display
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Not provided';
    return phone;
  };

  // Format currency in PKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  // Get status color and text
  const getStatusInfo = () => {
    if (!shopData)
      return {
        color: 'gray',
        text: 'Unknown',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
      };
    if (shopData.isOpen) {
      return {
        color: 'green',
        text: 'Open for Business',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700',
      };
    } else {
      return {
        color: 'red',
        text: 'Currently Closed',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700',
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="w-full  rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header with gradient */}
      <div className="relative px-6 py-6 md:px-8 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FaStore className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Restaurant Dashboard
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                Manage your restaurant profile and track performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {shopData ? (
          <>
            {/* Shop Header Section with Image and Rating */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 pb-6 border-b border-gray-100">
              {/* Shop Image */}
              {shopData.picture && (
                <div className="relative group flex-shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    {!imageLoaded && !imageError && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                    )}
                    {imageError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <FaStore className="text-4xl text-gray-400" />
                        <span className="text-xs text-gray-500 mt-2">
                          No Image
                        </span>
                      </div>
                    ) : (
                      <img
                        src={shopData.picture}
                        alt={shopData.name}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Shop Basic Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {shopData.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        {renderStars(parseFloat(averageRating))}
                      </div>
                      <span className="text-lg font-semibold text-gray-700">
                        {averageRating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({totalReviews} reviews)
                      </span>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.textColor}`}
                      >
                        {statusInfo.text}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {shopData.cuisines?.map((cuisine, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onEdit(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <FaStore className="text-sm" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Rating Distribution Section */}
            {totalReviews > 0 && (
              <SellerShopReviews reviews={shopData?.reviews} />
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<FaUtensils />}
                title="Menu Items"
                value={shopData.totalItems || 0}
                color="orange"
              />
              <StatCard
                icon={<FaShoppingCart />}
                title="Total Orders"
                value={shopData.totalOrders || 0}
                color="green"
              />
              <StatCard
                icon={<FaStar />}
                title="Avg Rating"
                value={averageRating}
                color="yellow"
              />
              <StatCard
                icon={<FaRegSmile />}
                title="Happy Customers"
                value={totalReviews}
                color="blue"
              />
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <InfoCard
                icon={<FaMapMarkerAlt />}
                title="Address"
                value={shopData.location.address || 'Not provided'}
                color="blue"
              />
              <InfoCard
                icon={<FaPhone />}
                title="Phone Number"
                value={formatPhoneNumber(shopData.phone)}
                color="green"
              />
              <InfoCard
                icon={<MdDeliveryDining />}
                title="Delivery Time"
                value={`${shopData.deliveryTime?.min || 25} - ${
                  shopData.deliveryTime?.max || 45
                } minutes`}
                color="purple"
              />
              <InfoCard
                icon={<FaTruck />}
                title="Delivery Information"
                value={
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Fee:</span>
                      <span className="font-semibold">
                        {formatCurrency(shopData.deliveryFee || 150)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Order:</span>
                      <span className="font-semibold">
                        {formatCurrency(shopData.minOrderAmount || 500)}
                      </span>
                    </div>
                  </div>
                }
                color="yellow"
              />
            </div>

            {/* Description Section */}
            {shopData.description && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      About {shopData.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {shopData.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // No shop data state
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-6">
              <FaStore className="text-5xl text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Shop Registered Yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't registered your shop on our platform. Start selling
              and reach more customers today!
            </p>
            <button
              onClick={() => onEdit(true)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
            >
              Register Your Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    orange: 'from-orange-500 to-amber-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
  };

  return (
    <div className="group relative overflow-hidden bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>
      <div
        className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${colors[color]} rounded-lg mb-2 shadow-md`}
      >
        <div className="text-white text-lg">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{title}</p>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: 'from-blue-50 to-indigo-50 border-blue-100',
    green: 'from-green-50 to-emerald-50 border-green-100',
    purple: 'from-purple-50 to-pink-50 border-purple-100',
    yellow: 'from-yellow-50 to-amber-50 border-yellow-100',
  };

  return (
    <div className={`bg-gradient-to-r ${colors[color]} rounded-xl p-4 border`}>
      <div className="flex items-start gap-3">
        <div className={`text-lg`}>{icon}</div>
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {title}
          </h3>
          {typeof value === 'string' ? (
            <p className="text-gray-800 text-sm md:text-base font-medium">
              {value}
            </p>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerShopDetails;
