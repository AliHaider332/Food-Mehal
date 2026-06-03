import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaFilter,
  FaTimes,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
  FaUtensils,
} from 'react-icons/fa';
import ItemFilter from './ItemFilter';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../Config/axios';
import ComponentLoading from '../ComponentLoading';
import CustomerHomeItem from './Home/CustomerHomeItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMoreItem,
  setItems,
  setLoading,
  setHasMore,
  setSkip,
} from '../../Store/user/user.item.slice';

const CustomerViewAllItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lastItemRef = useRef(null);

  // Redux state
  const {
    items: reduxItems,
    // loading: reduxLoading,
    skip = 0,
    hasMore = true,
  } = useSelector((state) => state.userItems);

  const [localLoading, setLocalLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  // Memoize the discount calculation function
  const getDiscountedPrice = useCallback((price, discount) => {
    if (discount && discount > 0) {
      return price - (price * discount) / 100;
    }
    return price || 0;
  }, []);

  // Use useMemo to filter and sort items - moved BEFORE the useEffect that uses it
  const filteredItems = useMemo(() => {
    let result = [...reduxItems];
    console.log(result);

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort(
          (a, b) =>
            getDiscountedPrice(a.price, a.discount) -
            getDiscountedPrice(b.price, b.discount)
        );
        break;
      case 'price-high':
        result.sort(
          (a, b) =>
            getDiscountedPrice(b.price, b.discount) -
            getDiscountedPrice(a.price, a.discount)
        );
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return result;
  }, [reduxItems, searchTerm, selectedCategory, sortBy, getDiscountedPrice]);

  // Fetch initial items
  useEffect(() => {
    fetchInitialItems();
  }, []);

  const fetchInitialItems = async () => {
    setInitialLoading(true);
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(
        `/user/user-more-data?limit=5&skip=0`,
        {
          favorite: localStorage.getItem('foodFavorites'),
          cart: localStorage.getItem('foodCart'),
          clicked: localStorage.getItem('foodClicked'),
        }
      ); 
      const newItems = response.data?.items || [];
      const total = response.data?.totalItems || 0;

      if (newItems.length > 0) {
        dispatch(setItems(newItems));
        dispatch(setSkip(newItems.length));
        dispatch(setHasMore(newItems.length < total));
        setTotalItems(total);
      }

      // Extract unique categories from all items
      const uniqueCategories = [
        ...new Set(newItems.map((item) => item.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setInitialLoading(false);
      dispatch(setLoading(false));
    }
  };

  const fetchMoreItems = async () => {
    // Prevent multiple simultaneous calls
    if (localLoading || !hasMore || initialLoading) return;
    setLocalLoading(true);
    try {
      const response = await axiosInstance.post(
        `/user/user-more-data?limit=12&skip=${skip}`,
        {
          favorite: localStorage.getItem('foodFavorites'),
          cart: localStorage.getItem('foodCart'),
          clicked: localStorage.getItem('foodClicked'),
        }
      );
      const newItems = response.data?.items || [];
      const total = response.data?.totalItems || 0;

      if (newItems.length > 0) {
        dispatch(addMoreItem(newItems));
        dispatch(setSkip(skip + newItems.length));
        dispatch(setHasMore(skip + newItems.length < total));

        // Add new categories if any
        const existingCategories = new Set(categories);
        newItems.forEach((item) => {
          if (item.category && !existingCategories.has(item.category)) {
            existingCategories.add(item.category);
          }
        });
        setCategories([...existingCategories]);
      } else {
        dispatch(setHasMore(false));
      }
    } catch (error) {
      console.error('Error fetching more items:', error);
      toast.error('Failed to load more items');
    } finally {
      setLocalLoading(false);
    }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (initialLoading || filteredItems.length === 0) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMore &&
        !localLoading &&
        !initialLoading
      ) {
        fetchMoreItems();
      }
    }, options);

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current) {
        observer.unobserve(lastItemRef.current);
      }
    };
  }, [hasMore, localLoading, initialLoading, filteredItems.length]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('popular');
  }, []);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      // Optional: Reset scroll position when unmounting
      window.scrollTo(0, 0);
    };
  }, []);

  if (initialLoading) {
    return <ComponentLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Explore Our <span className="text-orange-500">Menu</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover delicious dishes crafted with love and the finest
              ingredients
            </p>
          </div>

          {/* Pass all filter props to ItemFilter */}
          <ItemFilter
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            clearFilters={clearFilters}
          />

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing{' '}
              <span className="font-semibold text-orange-500">
                {filteredItems.length}
              </span>{' '}
              of <span className="font-semibold">{totalItems}</span> items
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {sortBy === 'price-low' && <FaSortAmountUp />}
              {sortBy === 'price-high' && <FaSortAmountDown />}
              <span>
                Sorted by:{' '}
                {sortBy === 'popular'
                  ? 'Popularity'
                  : sortBy === 'price-low'
                  ? 'Price (Low to High)'
                  : sortBy === 'price-high'
                  ? 'Price (High to Low)'
                  : 'Discount'}
              </span>
            </div>
          </div>

          {/* Items Grid with Infinite Scroll */}
          <div>
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaUtensils className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <CustomerHomeItem filteredItems={filteredItems} />

                {/* Loading indicator for infinite scroll */}
                {localLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-gray-600">
                      Loading more items...
                    </span>
                  </div>
                )}

                {/* Sentinels for infinite scroll - only show if there are more items */}
                {!localLoading && hasMore && filteredItems.length > 0 && (
                  <div ref={lastItemRef} className="h-10" />
                )}

                {/* End message */}
                {!hasMore && filteredItems.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>🎉 You've reached the end! No more items to load.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerViewAllItems;
