import React from 'react';
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaTag,
  FaSortAmountDown,
  FaSortAmountUp,
} from 'react-icons/fa';

const ItemFilter = ({
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  clearFilters,
}) => {
  // Get active filters count
  const activeFiltersCount = [
    selectedCategory !== 'all',
    searchTerm !== '',
    sortBy !== 'popular',
  ].filter(Boolean).length;

  // Sort options with icons
  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: FaArrowUp },
    { value: 'price-low', label: 'Price: Low to High', icon: FaSortAmountDown },
    { value: 'price-high', label: 'Price: High to Low', icon: FaSortAmountUp },
    { value: 'discount', label: 'Biggest Discount', icon: FaTag },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
      {/* Main Search Bar */}
      <div className="p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search for your favorite dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            <FaFilter className="text-sm group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </span>
            {activeFiltersCount > 0 && !showFilters && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 bg-gray-50/50 animate-fadeIn">
          <div className="p-5">
            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaTag className="text-orange-500 text-xs" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 cursor-pointer hover:border-orange-300"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FaSortAmountDown className="text-orange-500 text-xs" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 cursor-pointer hover:border-orange-300"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaFilter className="text-orange-500 text-xs" />
                    Active Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm">
                        {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="hover:text-orange-900 ml-1"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        Search: {searchTerm}
                        <button
                          onClick={() => setSearchTerm('')}
                          className="hover:text-blue-900 ml-1"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    )}
                    {sortBy !== 'popular' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm">
                        {sortOptions.find((opt) => opt.value === sortBy)?.label}
                        <button
                          onClick={() => setSortBy('popular')}
                          className="hover:text-green-900 ml-1"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="group flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-red-600 transition-all duration-200 rounded-lg hover:bg-red-50"
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

// Add this to your global CSS or component styles
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Optional: Add styles to document if not using CSS modules
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ItemFilter;
