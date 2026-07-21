/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTimes,
  FaArrowLeft,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUtensils,
  FaSearch,
} from 'react-icons/fa';
import ItemFilter from './ItemFilter';
import CustomerHomeItem from '../Home/CustomerHomeItem';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFrontPageItemsQuery } from '../../../services/customer.api';
import { incrementViewAllOffset, resetOffset } from '../../../Store/user/customer.page.record';
import ItemSkeleton from './ItemSkeleton';

// ===== Constants =====
const ITEMS_PER_PAGE = 6;
const OBSERVER_ROOT_MARGIN = '200px';

// ===== Sub-components =====
const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
    {Array.from({ length: count }).map((_, index) => (
      <ItemSkeleton key={index} />
    ))}
  </div>
);

const LoadingSpinner = ({ message }) => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
    <span className="ml-2 text-gray-600">{message}</span>
  </div>
);

const EmptyState = ({ isSearchActive, onClearFilters }) => (
  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FaUtensils className="text-4xl text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {isSearchActive ? 'No search results found' : 'No items found'}
      </h3>
      <p className="text-gray-500 mb-4">
        {isSearchActive
          ? 'Try different keywords or check your spelling'
          : 'Try adjusting your filters or search terms'}
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

const Header = ({ navigate, isSearchActive, onResetToNormalView }) => (
  <>
    <button
      onClick={() => navigate(-1)}
      className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors group"
      aria-label="Go back"
    >
      <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
      Back
    </button>

    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Explore Our <span className="text-orange-500">Menu</span>
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Discover delicious dishes crafted with love and the finest ingredients
      </p>
    </div>

    {isSearchActive && (
      <div className="mb-4 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full">
          <FaSearch className="text-sm" />
          <span className="text-sm font-medium">Showing Search Results</span>
          <button
            onClick={onResetToNormalView}
            className="ml-2 text-orange-600 hover:text-orange-800"
            aria-label="Clear search"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
      </div>
    )}
  </>
);

const ItemStats = ({ count, isSearchActive, sortBy }) => {
  const getSortLabel = () => {
    const labels = {
      popular: 'Popularity',
      'price-low': 'Price (Low to High)',
      'price-high': 'Price (High to Low)',
      discount: 'Discount',
    };
    return labels[sortBy] || 'Popularity';
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-sm text-gray-500">
        Showing {count} {count === 1 ? 'item' : 'items'}
        {isSearchActive && <span className="text-orange-500"> (search results)</span>}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {sortBy === 'price-low' && <FaSortAmountUp />}
        {sortBy === 'price-high' && <FaSortAmountDown />}
        <span>Sorted by: {getSortLabel()}</span>
      </div>
    </div>
  );
};

// ===== Main Component =====
const CustomerViewAllItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentOffset = useSelector((state) => state.customerPage.viewAllOffset);

  // State
  const [searchMode, setSearchMode] = useState({
    active: false,
    searching: false,
    results: [],
    term: '',
  });
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'popular',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Refs
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  // ===== API Queries =====
  const {
    data: itemsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetFrontPageItemsQuery(
    { offset: currentOffset, limit: ITEMS_PER_PAGE },
    {
      skip: searchMode.active,
      selectFromResult: (result) => ({
        ...result,
        items: result.data?.items || [],
        hasMore: result.data?.hasMore || false,
      }),
    }
  );

  // Single source of truth for items
  const allItems = searchMode.active ? searchMode.results : itemsData?.items || [];

  // ===== Computed Values =====
  const categories = useMemo(() => {
    const categorySet = new Set();
    allItems.forEach((item) => {
      if (item?.category) categorySet.add(item.category);
    });
    return Array.from(categorySet);
  }, [allItems]);

  const getDiscountedPrice = useCallback((price, discount) => {
    if (discount && discount > 0) {
      return price - (price * discount) / 100;
    }
    return price || 0;
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter((item) => item.category === filters.category);
    }

    // Apply sorting
    const sortFunctions = {
      'price-low': (a, b) =>
        getDiscountedPrice(a.price, a.discount) - getDiscountedPrice(b.price, b.discount),
      'price-high': (a, b) =>
        getDiscountedPrice(b.price, b.discount) - getDiscountedPrice(a.price, a.discount),
      discount: (a, b) => (b.discount || 0) - (a.discount || 0),
      popular: (a, b) => (b.rating || 0) - (a.rating || 0),
    };

    if (sortFunctions[filters.sortBy]) {
      result.sort(sortFunctions[filters.sortBy]);
    }

    return result;
  }, [allItems, filters, getDiscountedPrice]);

  // ===== Handlers =====
  const handleSearchResults = useCallback(
    (results) => {
      setSearchMode((prev) => ({
        ...prev,
        active: true,
        searching: false,
        results: results || [],
        term: results?.length ? searchMode.term : '',
      }));
    },
    [searchMode.term]
  );

  const resetToNormalView = useCallback(() => {
    setSearchMode({ active: false, searching: false, results: [], term: '' });
    setIsInitialLoad(true);
    dispatch(resetOffset());
    setTimeout(refetch, 100);
  }, [dispatch, refetch]);

  const clearFilters = useCallback(() => {
    if (searchMode.active) {
      resetToNormalView();
    } else {
      setFilters({ category: 'all', sortBy: 'popular' });
    }
  }, [searchMode.active, resetToNormalView]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && itemsData?.hasMore && !searchMode.active && !searchMode.searching) {
      dispatch(incrementViewAllOffset(ITEMS_PER_PAGE));
    }
  }, [isFetching, itemsData?.hasMore, dispatch, searchMode.active, searchMode.searching]);

  // ===== Intersection Observer =====
  useEffect(() => {
    const cleanup = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };

    const shouldSetupObserver =
      !searchMode.active &&
      !searchMode.searching &&
      !isLoading &&
      itemsData?.hasMore &&
      filteredItems.length > 0;

    if (!shouldSetupObserver) {
      cleanup();
      return;
    }

    const timer = setTimeout(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      cleanup();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (
            entry.isIntersecting &&
            itemsData?.hasMore &&
            !isFetching &&
            !searchMode.active &&
            !searchMode.searching
          ) {
            handleLoadMore();
          }
        },
        {
          root: null,
          rootMargin: OBSERVER_ROOT_MARGIN,
          threshold: 0,
        }
      );

      observerRef.current.observe(sentinel);
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [
    filteredItems.length,
    isFetching,
    isLoading,
    handleLoadMore,
    searchMode.active,
    searchMode.searching,
    itemsData?.hasMore,
    currentOffset,
  ]);

  // ===== Lifecycle =====
  useEffect(() => {
    dispatch(resetOffset());
    setIsInitialLoad(true);

    return () => {
      setSearchMode({ active: false, searching: false, results: [], term: '' });
    };
  }, [dispatch]);

  useEffect(() => {
    if (!searchMode.active && allItems.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [allItems, searchMode.active, isInitialLoad]);

  // ===== Render Helpers =====
  const renderContent = () => {
    if (filteredItems.length === 0 && !isLoading && !searchMode.searching && !isInitialLoad) {
      return <EmptyState isSearchActive={searchMode.active} onClearFilters={clearFilters} />;
    }

    return (
      <>
        <CustomerHomeItem filteredItems={filteredItems} />

        {searchMode.searching && <LoadingSpinner message="Searching..." />}

        {isFetching && !searchMode.active && currentOffset > 0 && (
          <LoadingSpinner message="Loading more items..." />
        )}

        {/* Infinite scroll sentinel */}
        {!searchMode.active &&
          !searchMode.searching &&
          itemsData?.hasMore &&
          filteredItems.length > 0 &&
          !isFetching && <div ref={sentinelRef} className="h-10" />}

        {/* End message */}
        {!searchMode.active && !itemsData?.hasMore && filteredItems.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>🎉 You've reached the end! No more items to load.</p>
          </div>
        )}
      </>
    );
  };

  // ===== Loading and Error States =====
  if (isInitialLoad && isLoading && allItems.length === 0 && !searchMode.active) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Header
              navigate={navigate}
              isSearchActive={false}
              onResetToNormalView={resetToNormalView}
            />
            <GridSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError && !searchMode.active && allItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUtensils className="text-4xl text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to load items</h3>
          <p className="text-gray-500 mb-4">{error?.data?.message || 'Please try again later'}</p>
          <button
            onClick={() => {
              setIsInitialLoad(true);
              dispatch(resetOffset());
              refetch();
            }}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ===== Main Render =====
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Header
            navigate={navigate}
            isSearchActive={searchMode.active}
            onResetToNormalView={resetToNormalView}
          />

          <ItemFilter
            searchTerm={searchMode.term}
            setSearchTerm={(term) => setSearchMode((prev) => ({ ...prev, term }))}
            selectedCategory={filters.category}
            setSelectedCategory={(category) => setFilters((prev) => ({ ...prev, category }))}
            sortBy={filters.sortBy}
            setSortBy={(sortBy) => setFilters((prev) => ({ ...prev, sortBy }))}
            categories={categories}
            clearFilters={clearFilters}
            setAllItems={handleSearchResults}
            setIsSearching={(searching) => setSearchMode((prev) => ({ ...prev, searching }))}
            isSearchActive={searchMode.active}
            resetToNormalView={resetToNormalView}
          />

          <ItemStats
            count={filteredItems.length}
            isSearchActive={searchMode.active}
            sortBy={filters.sortBy}
          />

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerViewAllItems;
