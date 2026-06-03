// CustomerHome.jsx - Navigate to menu on View All
import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomerHomeItem from './CustomerHomeItem';
import CustomerHomeShop from './CustomerHomeShop';
import ComponentLoading from '../../ComponentLoading';
import { axiosInstance } from '../../../Config/axios';
import { addMoreItem } from '../../../Store/user/user.item.slice';
import HomeSliderState from './HomeSliderState';
// Skeleton Loader Component for Items (matching actual card dimensions)
const ItemSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse mb-5">
      <div className="w-full h-56 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  );
};

// Grid Skeleton Component
const GridSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {Array(count)
        .fill()
        .map((_, index) => (
          <ItemSkeleton key={index} />
        ))}
    </div>
  );
};

const CustomerHome = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { items, shops, loading } = useSelector((state) => state.userItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filteredItems = items;
  const hasManyItems = filteredItems.length > 9;
  // Always show only first 9 items on homepage
  const displayItems = filteredItems.slice(0, 9);
  const onLoadMore = async () => {
    // Fixed condition: Check if isLoadingMore OR NOT hasMore
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextSkip = skip + 3;

    try {
      const res = await axiosInstance.post(
        `/user/user-more-data?limit=3&skip=${nextSkip}`,
        {
          favorite: localStorage.getItem('foodFavorites'),
          cart: localStorage.getItem('foodCart'),
          clicked: localStorage.getItem('foodClicked'),
        }
      );

      const newItems = res.data?.items || [];

      if (newItems.length > 0) {
        dispatch(addMoreItem(newItems));
        setSkip(nextSkip);
      }

      // Update hasMore based on remaining items
      const remainingItems = res.data?.remaining;
      setHasMore(remainingItems > 0);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  if (loading) {
    return <ComponentLoading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <HomeSliderState />
      {/* Recommended Shops Section with Improved Slider */}
      {shops && shops.length > 0 && <CustomerHomeShop shops={shops} />}
      {/* Popular Dishes Section */}
      {filteredItems.length > 0 ? (
        <div id="popular-dishes-section" className="mt-10 flex flex-col">
          {/* Header with counter */}
          <div className="flex justify-between items-center mb-4 px-2">
            <div>
              {filteredItems.length > 9 && (
                <p className="text-sm text-gray-500">
                  Showing 9 of {filteredItems.length} items
                </p>
              )}
            </div>
          </div>

          <CustomerHomeItem filteredItems={displayItems} />

          {/* Button Logic */}
          <div className="w-full flex flex-col items-center justify-center mb-8 mt-6">
            {/* Show loading skeleton */}
            {isLoadingMore && (
              <div className="w-full mt-6 animate-fade-in">
                <GridSkeleton count={3} />
              </div>
            )}

            {/* Case 1: More than 9 items - Show View All button that navigates to menu */}
            {hasManyItems && (
              <button
                onClick={() => {
                  navigate('menu');
                }}
                className="group flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-base transition-all duration-300 hover:gap-3 bg-transparent border-none cursor-pointer"
              >
                <span>View All {filteredItems.length} Items</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            )}

            {/* Case 2: Items less than or equal to 9 - Show Load More button if applicable */}
            {!hasManyItems && hasMore && (
              <button
                className={`px-14 py-2.5 border-[1px] border-[#1a9cb8] bg-transparent text-[#1a9cb8] font-light rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 flex items-center gap-2 ${
                  isLoadingMore ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={onLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a9cb8] border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            )}

            {/* Show end message when no more items to load and items <= 9 */}
            {!hasManyItems && !hasMore && filteredItems.length > 0 && (
              <div className="text-center text-gray-400 text-sm py-4 flex flex-col items-center gap-2">
                <GiForkKnifeSpoon className="text-3xl text-gray-300" />
                <span>✨ You've reached the end! ✨</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
            <GiForkKnifeSpoon className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Items Found
          </h3>
        </div>
      )}
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden mt-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Order Your Favorite Food?
          </h2>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Join thousands of happy customers and get delicious food delivered
            to your doorstep
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Ordering
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CustomerHome;
