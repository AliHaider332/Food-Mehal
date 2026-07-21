import React from 'react';
import { useGetFrontPageItemsQuery } from '../../../services/customer.api';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import CustomerHomeItem from './CustomerHomeItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  incrementHomeOffset,
 
} from '../../../Store/user/customer.page.record';

// Skeleton Loader Component for Items
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

const CustomerItemPortion = () => {
  const currentOffset = useSelector((state) => state.customerPage.homeOffset);
  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const limit = 3;

  const {
    data: itemsData,
    isLoading: isItemsLoading,
    isFetching,
  } = useGetFrontPageItemsQuery({
    offset: currentOffset,
    limit: limit,
  });

  // Get all accumulated items from the cache (merged automatically by RTK Query)
  const allItems = itemsData?.items || [];
  const totalItems = itemsData?.total || 0;
  const hasMore = itemsData?.hasMore || false;

  // Determine which button to show
  const hasExactlyNineItems = allItems.length === 9 && totalItems > 9;
  const hasMoreThanNine = allItems.length > 9;
  const showViewAll = hasMoreThanNine || hasExactlyNineItems;
  const displayItems = showViewAll ? allItems.slice(0, 9) : allItems;

  const handleLoadMore = () => {
    if (!isFetching && hasMore && allItems.length < 9) {
      dispatch(incrementHomeOffset(limit));
    }
  };

  

  return (
    <div className="mt-10 flex flex-col">
      {/* Header with counter */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div>
          {!isItemsLoading && allItems.length > 9 && (
            <p className="text-sm text-gray-500">
              Showing 9 of {allItems.length} items
            </p>
          )}
        </div>
      </div>

      {/* Show loading skeleton for initial items */}
      {isItemsLoading && currentOffset === 0 ? (
        <GridSkeleton count={3} />
      ) : allItems.length > 0 ? (
        <>
          <CustomerHomeItem filteredItems={displayItems} />

          {/* Button Logic */}
          <div className="w-full flex flex-col items-center justify-center mb-8 mt-6">
            {/* Show loading skeleton when loading more */}
            {isFetching && currentOffset > 0 && (
              <div className="w-full mt-6 animate-fade-in">
                <GridSkeleton count={3} />
              </div>
            )}

            {/* Case 1: Show View All button when we have 9 or more items */}
            {showViewAll && (
              <button
                onClick={() => navigate('menu')}
                className="group flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-base transition-all duration-300 hover:gap-3 bg-transparent border-none cursor-pointer"
              >
                <span>View All {totalItems}+ Items</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            )}

            {/* Case 2: Show Load More button when less than 9 items and more available */}
            {!showViewAll && hasMore && allItems.length < 9 && (
              <button
                className={`px-14 py-2.5 border-[1px] border-[#1a9cb8] bg-transparent text-[#1a9cb8] font-light rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 flex items-center gap-2 ${
                  isFetching ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={handleLoadMore}
                disabled={isFetching}
              >
                {isFetching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a9cb8] border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            )}

            {/* Show end message when no more items */}
            {!hasMore && allItems.length < 9 && (
              <div className="text-center text-gray-400 text-sm py-4 flex flex-col items-center gap-2">
                <GiForkKnifeSpoon className="text-3xl text-gray-300" />
                <span>✨ You've reached the end! ✨</span>
              </div>
            )}
          </div>
        </>
      ) : (
        !isItemsLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
              <GiForkKnifeSpoon className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Items Found
            </h3>
          </div>
        )
      )}
    </div>
  );
};

export default CustomerItemPortion;
