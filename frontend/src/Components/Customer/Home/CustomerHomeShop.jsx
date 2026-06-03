import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingBag,
} from 'react-icons/fa';
import { MdDeliveryDining, MdVerified } from 'react-icons/md';
import { GiTakeMyMoney, GiForkKnifeSpoon } from 'react-icons/gi';

const CustomerHomeShop = ({ shops = [] }) => {
  const [currentShopIndex, setCurrentShopIndex] = useState(0);
  const navigate = useNavigate();

  // Get visible shops for slider (4 per slide)
  const getVisibleShops = () => {
    if (!shops || shops.length === 0) return [];
    const startIndex = currentShopIndex * 4;
    const endIndex = startIndex + 4;
    return shops.slice(startIndex, endIndex);
  };

  const visibleShops = getVisibleShops();
  const totalSlides = Math.ceil((shops?.length || 0) / 4);

  const nextShopSlide = () => {
    if (shops && shops.length > 0) {
      const maxIndex = Math.max(0, Math.ceil(shops.length / 4) - 1);
      setCurrentShopIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const prevShopSlide = () => {
    setCurrentShopIndex((prev) => Math.max(prev - 1, 0));
  };

  // Calculate average rating from reviews
  const getAverageRating = (shop) => {
    if (!shop.reviews || shop.reviews.length === 0) return 0;
    const total = shop.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / shop.reviews.length).toFixed(1);
  };
  const renderRatingStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-yellow-300 text-sm" />
      );
    }
    return stars;
  };

  // Generate rating badge color based on score
  const getRatingBadgeColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.5) return 'bg-green-500';
    if (numRating >= 4.0) return 'bg-emerald-500';
    if (numRating >= 3.5) return 'bg-lime-500';
    if (numRating >= 3.0) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (!shops || shops.length === 0) {
    return (
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Recommended Shops
            </h2>
            <p className="text-gray-500">Popular restaurants near you</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <GiForkKnifeSpoon className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No shops available at the moment
          </p>
          <p className="text-gray-300 text-sm mt-2">
            Check back later for delicious options!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 px-1">
        <div className="relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
          <div className="pl-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Recommended Shops
            </h2>
            <p className="text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Popular restaurants near you
            </p>
          </div>
        </div>
        {totalSlides > 1 && (
          <div className="flex gap-3">
            <button
              onClick={prevShopSlide}
              disabled={currentShopIndex === 0}
              className={`p-3 rounded-full transition-all duration-300 shadow-md ${
                currentShopIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-lg'
              }`}
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              onClick={nextShopSlide}
              disabled={currentShopIndex === totalSlides - 1}
              className={`p-3 rounded-full transition-all duration-300 shadow-md ${
                currentShopIndex === totalSlides - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-lg'
              }`}
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Shop Slider Container */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {visibleShops.map((shop, idx) => {
            const avgRating = getAverageRating(shop);

            const totalReviews = shop.reviews?.length || 0;

            return (
              <div
                onClick={() => navigate(`shop/${shop._id}`)}
                key={shop._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer group animate-fade-in relative"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Image Section */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={shop.picture}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Open Status Badge */}
                  {shop.isOpen ? (
                    <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      Open Now
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      Closed
                    </div>
                  )}

                  {/* Delivery Fee Badge */}
                  {shop.deliveryFee && (
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md">
                      <span className="text-orange-600">Delivery</span>{' '}
                      <span className="text-gray-800">
                        Rs. {shop.deliveryFee}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Shop Name and Verified Badge */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-gray-800 line-clamp-1 flex-1 group-hover:text-orange-600 transition-colors duration-300">
                      {shop.name}
                    </h3>
                    {shop.verified && (
                      <MdVerified className="text-blue-500 text-lg flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Enhanced Rating Section */}
                  <div className="mb-4">
                    {/* Rating Row */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`${getRatingBadgeColor(
                          avgRating
                        )} text-white px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1`}
                      >
                        <span>{avgRating || 'New'}</span>
                        {avgRating > 0 && (
                          <FaStar className="text-white text-[10px]" />
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderRatingStars(avgRating)}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        ({totalReviews}{' '}
                        {totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>

                  {/* Shop Details */}
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center">
                        <FaClock className="text-orange-500 text-xs" />
                      </div>
                      <span>
                        {shop.deliveryTime?.min}-{shop.deliveryTime?.max} mins
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center">
                        <MdDeliveryDining className="text-orange-500 text-sm" />
                      </div>
                      <span>
                        Min. order{' '}
                        <span className="font-semibold text-gray-700">
                          Rs. {shop.minOrderAmount || 100}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center">
                        <FaMapMarkerAlt className="text-orange-500 text-xs" />
                      </div>
                      <span className="line-clamp-1">
                        {shop.address?.split(',')[0] || 'Nearby'}
                      </span>
                    </div>
                  </div>

                  {/* Cuisines Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {shop.cuisines?.slice(0, 3).map((cuisine, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-medium shadow-sm"
                      >
                        {cuisine}
                      </span>
                    ))}
                    {shop.cuisines?.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                        +{shop.cuisines.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Action Hint */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <FaShoppingBag size={10} />
                    <span>View Menu</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slider Dots */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentShopIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentShopIndex
                    ? 'w-8 h-2.5 bg-gradient-to-r from-orange-500 to-orange-600'
                    : 'w-2 h-2 bg-gray-300 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomerHomeShop;
