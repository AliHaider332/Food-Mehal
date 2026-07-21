import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  FaSearch,
  FaFilter,
  FaArrowUp,
  FaTag,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';
import { axiosInstance } from '../../../Config/axios';

// ===== Constants =====
const MIN_SEARCH_LENGTH = 2;

// ===== Sub-components =====
const SearchInput = ({ value, onChange, isLoading, onClear, onSearch, isSearchActive }) => (
  <div className="relative group">
    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
    <input
      type="text"
      placeholder="Search for your favorite dishes (e.g., 'spicy pasta', 'vegan options', 'best desserts')..."
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSearch();
        }
      }}
      className="w-full pl-11 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
      autoComplete="off"
      aria-label="Search dishes"
    />
    {isLoading && (
      <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
        <FaSpinner className="text-orange-500 animate-spin text-lg" />
      </div>
    )}
    {value && !isLoading && (
      <button
        onClick={onClear}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Clear search"
      >
        <FaTimes className="text-sm" />
      </button>
    )}
    <button
      onClick={onSearch}
      disabled={isLoading || !value.trim() || value.trim().length < MIN_SEARCH_LENGTH}
      className={`absolute right-14 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
        isLoading || !value.trim() || value.trim().length < MIN_SEARCH_LENGTH
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-orange-500 text-white hover:bg-orange-600'
      }`}
      aria-label="Search"
    >
      Search
    </button>
  </div>
);

const SearchResultInfo = ({ info }) => {
  if (!info) return null;

  if (info.error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-slideDown">
        <div className="flex items-center gap-2">
          <FaTimes className="text-red-500" />
          <p className="text-red-700">{info.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl animate-slideDown">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FaSearch className="text-orange-500" />
          <p className="text-orange-700">
            <span className="font-semibold">Search results</span> for "{info.query}"
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
            {info.resultCount} items found
          </span>
          {info.semantic && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1">
              <FaTag className="text-xs" />
              AI-powered
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, icon: Icon, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      <Icon className="text-orange-500 text-xs" />
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 cursor-pointer hover:border-orange-300"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// ===== Main Component =====
const ItemFilter = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  clearFilters,
  setAllItems,
  setIsSearching,
  isSearchActive,
  resetToNormalView,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const [searchResultInfo, setSearchResultInfo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const abortControllerRef = useRef(null);

  // ===== Sort Options =====
  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: FaArrowUp },
    { value: 'price-low', label: 'Price: Low to High', icon: FaSortAmountDown },
    { value: 'price-high', label: 'Price: High to Low', icon: FaSortAmountUp },
    { value: 'discount', label: 'Biggest Discount', icon: FaTag },
  ];

  // ===== Category Options =====
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  // ===== Search Logic with Abort Controller =====
  const performSearch = useCallback(
    async (query) => {
      const trimmedQuery = query.trim();

      // Don't search if query is too short
      if (!trimmedQuery || trimmedQuery.length < MIN_SEARCH_LENGTH) {
        setSearchResultInfo({
          query: trimmedQuery || '',
          error: true,
          message: `Please enter at least ${MIN_SEARCH_LENGTH} characters to search`,
        });
        setIsSearchingAPI(false);
        if (setIsSearching) setIsSearching(false);
        return;
      }

      // If same query, don't search again
      if (trimmedQuery === lastSearchQuery && searchResultInfo?.query === trimmedQuery) {
        return;
      }

      setIsSearchingAPI(true);
      if (setIsSearching) setIsSearching(true);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await axiosInstance.post(
          '/customer/search-item',
          { queryText: trimmedQuery },
          { signal: controller.signal }
        );

        if (response.data?.items) {
          if (setAllItems) {
            setAllItems(response.data.items);
          }
          setSearchResultInfo({
            query: trimmedQuery,
            resultCount: response.data.items.length,
            semantic: response.data.isSemantic || false,
            timestamp: Date.now(),
          });
          setSearchTerm(trimmedQuery);
          setLastSearchQuery(trimmedQuery);
        }
      } catch (error) {
        // Don't show error if request was aborted
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
          console.log('Search request was cancelled');
          return;
        }

        console.error('Search error:', error);
        setSearchResultInfo({
          query: trimmedQuery,
          error: true,
          message: error.response?.data?.message || 'Search failed. Please try again.',
        });
      } finally {
        setIsSearchingAPI(false);
        if (setIsSearching) setIsSearching(false);
        abortControllerRef.current = null;
      }
    },
    [setAllItems, setSearchTerm, setIsSearching, lastSearchQuery, searchResultInfo]
  );

  // ===== Handlers =====
  const handleSearchClick = useCallback(() => {
    if (localSearchTerm.trim().length >= MIN_SEARCH_LENGTH) {
      performSearch(localSearchTerm);
    } else {
      // Show error for short queries
      setSearchResultInfo({
        query: localSearchTerm || '',
        error: true,
        message: `Please enter at least ${MIN_SEARCH_LENGTH} characters to search`,
      });
    }
  }, [localSearchTerm, performSearch]);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setLocalSearchTerm(value);

      // If empty, clear results
      if (!value.trim()) {
        setSearchResultInfo(null);
        setSearchTerm('');
        setIsSearchingAPI(false);
        if (setIsSearching) setIsSearching(false);

        if (isSearchActive && resetToNormalView) {
          resetToNormalView();
        } else if (setAllItems && !isSearchActive) {
          setAllItems([]);
        }
        setLastSearchQuery('');
      }
    },
    [isSearchActive, resetToNormalView, setAllItems, setSearchTerm, setIsSearching]
  );

  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm('');
    setSearchTerm('');
    setSearchResultInfo(null);
    setIsSearchingAPI(false);
    if (setIsSearching) setIsSearching(false);
    setLastSearchQuery('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (resetToNormalView) {
      resetToNormalView();
    } else if (setAllItems) {
      setAllItems([]);
    }
  }, [resetToNormalView, setAllItems, setSearchTerm, setIsSearching]);

  const handleClearAllFilters = useCallback(() => {
    handleClearSearch();
    if (clearFilters) {
      clearFilters();
    }
  }, [handleClearSearch, clearFilters]);

  // ===== Sync localSearchTerm with prop =====
  useEffect(() => {
    if (!isSearchActive && searchTerm === '') {
      setLocalSearchTerm('');
      setSearchResultInfo(null);
      setLastSearchQuery('');
    }
  }, [searchTerm, isSearchActive]);

  // ===== Cleanup =====
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ===== Count active filters =====
  const activeFiltersCount = [
    selectedCategory !== 'all',
    searchTerm !== '',
    sortBy !== 'popular',
  ].filter(Boolean).length;

  // ===== Render =====
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
      {/* Search Section */}
      <div className="p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={localSearchTerm}
              onChange={handleSearchChange}
              onSearch={handleSearchClick}
              isLoading={isSearchingAPI}
              onClear={handleClearSearch}
              isSearchActive={isSearchActive}
            />
            {/* Show minimum characters hint */}
            {localSearchTerm && localSearchTerm.trim().length < MIN_SEARCH_LENGTH && (
              <div className="mt-1 text-xs text-gray-500">
                Type at least {MIN_SEARCH_LENGTH} characters then click Search or press Enter
              </div>
            )}
            {localSearchTerm &&
              localSearchTerm.trim().length >= MIN_SEARCH_LENGTH &&
              !isSearchingAPI && (
                <div className="mt-1 text-xs text-green-600">
                  Press Enter or click Search button to find results
                </div>
              )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg group"
            aria-label={showFilters ? 'Hide filters' : 'Show filters'}
          >
            <FaFilter className="text-sm group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <SearchResultInfo info={searchResultInfo} />
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="border-t border-gray-200 bg-gray-50/50 animate-fadeIn">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FilterSelect
                label="Category"
                icon={FaTag}
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
              />

              <FilterSelect
                label="Sort By"
                icon={FaSortAmountDown}
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleClearAllFilters}
                  className="group flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-red-600 transition-all duration-200 rounded-lg hover:bg-red-50"
                  aria-label="Clear all filters"
                >
                  <FaTimes className="text-sm group-hover:rotate-90 transition-transform duration-200" />
                  <span className="font-medium">Clear All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Styles =====
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-slideDown { animation: slideDown 0.3s ease-out; }
  .animate-spin { animation: spin 1s linear infinite; }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('item-filter-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'item-filter-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ItemFilter;
