// components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../Config/axios';
import {
  FaUtensilSpoon,
  FaShoppingBag,
  FaStore,
  FaUtensils,
  FaShoppingCart,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
  FaChartLine,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaUser,
  FaHistory,
  FaHeart,
  FaTicketAlt,
  FaBars,
  FaTimes,
  FaPlusCircle,
} from 'react-icons/fa';
import { MdRestaurantMenu, MdDeliveryDining, MdReviews } from 'react-icons/md';
import { GiTakeMyMoney } from 'react-icons/gi';
import { resetUser } from '../Store/auth/auth.slice';
import { useGetShopQuery } from '../services/shop.api';
const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState(null);
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const shouldFetchShop = user?.role === 'seller';

  const { data } = useGetShopQuery(undefined, {
    skip: !shouldFetchShop,
  });
  useEffect(() => {
    if (data?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShopInfo(data?.shop);
    }
  }, [data]);

  const userMenuRef = useRef(null);
  const mobileNavRef = useRef(null);

  // Get cart items from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('foodCart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const count = Object.values(cart).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartItemCount(count);
      }
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle responsive detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileNav(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        showMobileNav
      ) {
        setShowMobileNav(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileNav]);

  // Close mobile nav on escape key and close menus on route change
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowMobileNav(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close menus when route changes

  const onLogout = async () => {
    try {
      await axiosInstance.get('/auth/logout');
      toast.success('Logged out successfully!');
      dispatch(resetUser());
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out. Please try again.');
    }
    setShowUserMenu(false);
    setShowMobileNav(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'seller':
        return <FaStore className="mr-1 text-xs" />;
      case 'admin':
        return <FaUsers className="mr-1 text-xs" />;
      case 'delivery':
        return <MdDeliveryDining className="mr-1 text-xs" />;
      default:
        return <FaUser className="mr-1 text-xs" />;
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'seller':
        return 'Restaurant Owner';
      case 'admin':
        return 'Administrator';
      case 'delivery':
        return 'Delivery Partner';
      default:
        return 'Customer';
    }
  };

  // Define navigation links based on user role and shopInfo existence
  const getNavigationLinks = () => {
    switch (user?.role) {
      case 'seller':
        if (!shopInfo) {
          return [
            {
              id: 'shop',
              label: 'Setup Restaurant',
              icon: FaPlusCircle,
              isAction: true,
              path: '/seller',
              exact: true,
            },
            {
              id: 'profile',
              label: 'Profile',
              icon: FaUserCircle,
              path: '/seller/profile',
              exact: false,
            },
          ];
        }
        return [
          {
            id: 'shop',
            label: 'Restaurant Info',
            icon: FaStore,
            path: '/seller',
            exact: true,
          },
          {
            id: 'items',
            label: 'Menu Items',
            icon: FaUtensils,
            path: '/seller/menu',
            exact: false,
          },
          {
            id: 'orders',
            label: 'Orders',
            icon: FaShoppingCart,
            path: '/seller/order',
            exact: false,
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: FaChartLine,
            path: '/seller/analytics',
            exact: false,
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: FaUserCircle,
            path: '/seller/profile',
            exact: false,
          },
        ];

      case 'admin':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FaTachometerAlt,
            path: '/admin',
            exact: true,
          },
          {
            id: 'users',
            label: 'Users',
            icon: FaUsers,
            path: '/admin/users',
            exact: false,
          },
          {
            id: 'restaurants',
            label: 'Restaurants',
            icon: FaStore,
            path: '/admin/restaurants',
            exact: false,
          },
          {
            id: 'orders',
            label: 'All Orders',
            icon: FaShoppingCart,
            path: '/admin/order',
            exact: false,
          },
          {
            id: 'payments',
            label: 'Payments',
            icon: GiTakeMyMoney,
            path: '/admin/payments',
            exact: false,
          },
          {
            id: 'disputes',
            label: 'Disputes',
            icon: FaTicketAlt,
            path: '/admin/disputes',
            exact: false,
          },
          {
            id: 'reports',
            label: 'Reports',
            icon: FaClipboardList,
            path: '/admin/reports',
            exact: false,
          },
        ];

      case 'delivery-boy':
        return [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FaTachometerAlt,
            path: '/delivery-boy',
            exact: true,
          },
          {
            id: 'order-history',
            label: 'Order History',
            icon: FaHistory,
            path: '/delivery-boy/order-history',
            exact: false,
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: FaUserCircle,
            path: '/delivery-boy/profile',
            exact: false,
          },
        ];

      default:
        return [
          {
            id: 'home',
            label: 'Home',
            icon: FaUtensilSpoon,
            path: '/customer',
            exact: true,
          },
          {
            id: 'cart',
            label: 'Cart',
            icon: FaShoppingCart,
            path: '/customer/cart',
            exact: false,
            badge: cartItemCount,
          },
          {
            id: 'favorites',
            label: 'Favorites',
            icon: FaHeart,
            path: '/customer/favorite',
            exact: false,
          },
          {
            id: 'orders',
            label: 'My Orders',
            icon: FaShoppingBag,
            path: '/customer/order',
            exact: false,
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: FaUserCircle,
            path: '/customer/profile',
            exact: false,
          },
        ];
    }
  };

  const navigationLinks = getNavigationLinks();

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'seller':
        if (!shopInfo) {
          return 'Welcome! Setup Your Restaurant';
        }
        return shopInfo?.name
          ? `${shopInfo.name} Dashboard`
          : 'Restaurant Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      case 'delivery':
        return 'Delivery Dashboard';
      default:
        return 'Customer Dashboard';
    }
  };

  // Render desktop navigation link
  const renderNavLink = (link) => {
    const Icon = link.icon;

    return (
      <NavLink
        key={link.id}
        to={link.path}
        end={link.exact}
        onClick={() => setShowMobileNav(false)}
        className={({ isActive }) => `
          group relative px-4 py-2.5 font-medium text-sm transition-all duration-300 rounded-xl
          flex items-center space-x-2 whitespace-nowrap overflow-hidden
          ${
            isActive
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
          }
          ${
            link.isAction
              ? 'animate-pulse bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
              : ''
          }
        `}
      >
        {({ isActive }) => (
          <>
            {/* Animated underline for inactive links */}
            {!isActive && !link.isAction && (
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            )}

            <Icon
              className={`text-sm transition-transform duration-200 ${
                isActive || link.isAction
                  ? 'text-white'
                  : 'text-orange-500 group-hover:scale-110'
              }`}
            />
            <span>{link.label}</span>
          </>
        )}
      </NavLink>
    );
  };

  // Render mobile navigation item
  const renderMobileNavItem = (link) => {
    const Icon = link.icon;
    const badgeCount = link.badge || 0;

    return (
      <NavLink
        key={link.id}
        to={link.path}
        end={link.exact}
        onClick={() => setShowMobileNav(false)}
        className={({ isActive }) => `
          w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
          ${
            isActive
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md transform scale-105'
              : 'text-gray-700 hover:bg-orange-50 hover:translate-x-1'
          }
          ${
            link.isAction
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
              : ''
          }
        `}
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`text-lg transition-transform duration-200 ${
                isActive || link.isAction ? 'text-white' : 'text-orange-500'
              }`}
            />
            <span className="font-medium flex-1 text-left">{link.label}</span>
            {badgeCount > 0 && (
              <span
                className={`
                px-2 py-0.5 text-xs rounded-full font-bold
                ${
                  isActive || link.isAction
                    ? 'bg-white/20 text-white'
                    : 'bg-orange-100 text-orange-600'
                }
              `}
              >
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  // Don't render header if not logged in
  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full ">
      <div
        className={`
        bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50
        border-b border-orange-100
        transition-all duration-300
        ${scrolled ? 'shadow-xl backdrop-blur-sm bg-opacity-95' : 'shadow-md'}
      `}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto" style={{ maxWidth: '1600px' }}>
            {/* Top Bar: Logo + User Menu + Mobile Menu Button */}
            <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
              {/* Logo Section */}
              <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                <Link
                  to={'/'}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowMobileNav(false);
                  }}
                >
                  <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300 p-1">
                    <img
                      src="logo.png"
                      alt="Food Mehal Logo"
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 object-contain"
                    />
                  </div>
                </Link>
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Food Mehal
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {getDashboardTitle()}
                  </p>
                </div>
              </div>
              {/* Right Side: User Menu + Mobile Nav Toggle */}
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                {isLoggedIn && (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(!showUserMenu);
                      }}
                      className="flex items-center space-x-2 sm:space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 shadow-md border border-orange-100 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500 flex items-center justify-end">
                          Welcome back!
                        </p>
                        <p className="font-semibold text-gray-800 text-sm group-hover:text-orange-600 transition-colors max-w-[150px] truncate">
                          {user.name}
                        </p>
                      </div>

                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xs sm:text-sm font-bold">
                            {getInitials(user.name)}
                          </span>
                        )}
                      </div>

                      {
                        <FaChevronDown
                          className={`text-xs text-gray-400 group-hover:text-orange-500 transition-all duration-200 hidden md:block ${
                            showUserMenu ? 'rotate-180' : ''
                          }`}
                        />
                      }
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {showUserMenu && !isMobile && (
                      <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-slideDown">
                        <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                              {user.picture ? (
                                <img
                                  src={user.picture}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white text-lg font-bold">
                                  {getInitials(user.name)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                {user.email}
                              </p>
                              <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                {getRoleIcon()}
                                {getRoleLabel()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="py-2 max-h-96 overflow-y-auto">
                          {user?.role === 'seller' && shopInfo && (
                            <>
                              <div className="px-4 py-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  Quick Actions
                                </p>
                              </div>
                              <Link
                                to="/seller"
                                onClick={() => setShowUserMenu(false)}
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center group"
                              >
                                <FaTachometerAlt className="w-5 mr-3 text-gray-400 group-hover:text-orange-500" />
                                <span>Dashboard Overview</span>
                              </Link>
                              <Link
                                to="/seller/menu"
                                onClick={() => setShowUserMenu(false)}
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center group"
                              >
                                <MdRestaurantMenu className="w-5 mr-3 text-gray-400 group-hover:text-orange-500" />
                                <span>Menu Management</span>
                              </Link>
                              <Link
                                to="/seller/order"
                                onClick={() => setShowUserMenu(false)}
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center group"
                              >
                                <FaShoppingCart className="w-5 mr-3 text-gray-400 group-hover:text-orange-500" />
                                <span>Order Management</span>
                              </Link>
                              <div className="border-t border-gray-100 my-2"></div>
                            </>
                          )}

                          <Link
                            to={
                              user?.role === 'seller'
                                ? '/seller/profile'
                                : user?.role === 'delivery'
                                ? '/delivery-boy/profile'
                                : '/customer/profile'
                            }
                            onClick={() => setShowUserMenu(false)}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center group"
                          >
                            <FaUserCircle className="w-5 mr-3 text-gray-400 group-hover:text-orange-500" />
                            <span>Profile Settings</span>
                          </Link>

                          <div className="border-t border-gray-100 my-2"></div>

                          <button
                            onClick={onLogout}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center group"
                          >
                            <FaSignOutAlt className="w-5 mr-3 text-red-500 group-hover:text-red-600" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Menu Toggle Button */}
                {user && isMobile && (
                  <button
                    onClick={() => setShowMobileNav(!showMobileNav)}
                    className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                    aria-label="Toggle menu"
                  >
                    {showMobileNav ? (
                      <FaTimes size={20} />
                    ) : (
                      <FaBars size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            {isLoggedIn && navigationLinks.length > 0 && !isMobile && (
              <div className="flex flex-wrap items-center gap-2 pl-1 mt-4 pb-1 overflow-x-auto scrollbar-hide">
                {navigationLinks.map((link) => renderNavLink(link))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isLoggedIn && isMobile && showMobileNav && (
          <>
            {/* Backdrop - covers entire viewport including scrolled content */}
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
              onClick={() => setShowMobileNav(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Drawer - fixed to viewport with proper height management */}
            <div
              ref={mobileNavRef}
              className="fixed left-0 right-0 bg-white z-40 shadow-2xl animate-slideUp overflow-y-auto"
              style={{
                position: 'fixed',
                top: '65px',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: 'calc(100vh - 65px)',
                minHeight: 'calc(100vh - 65px)', // Ensure minimum height
                height: 'auto', // Allow auto height but constrained by max/min
                overflowY: 'auto', // Ensure scrolling within drawer
                WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
              }}
            >
              <div className="px-4 py-4 pb-8 min-h-full">
                {/* Close button */}
                <div className="flex justify-end mb-2 sticky top-0 bg-white pt-1 z-10">
                  <button
                    onClick={() => setShowMobileNav(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* User Profile Section - sticky on scroll */}
                <div className="sticky top-12 bg-white z-10 pb-2">
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-lg font-bold">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {getRoleIcon()}
                        {getRoleLabel()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                    Navigation
                  </p>
                  {navigationLinks.map((link) => renderMobileNavItem(link))}
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                  <button
                    onClick={() => {
                      setShowMobileNav(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <FaSignOutAlt className="text-lg text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
