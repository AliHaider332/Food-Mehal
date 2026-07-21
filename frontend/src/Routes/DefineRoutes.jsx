import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SignInPage from '../Pages/SignInPage';
import SignupPage from '../Pages/SignUpPage';
import ForgotPasswordPage from '../Pages/ForgotPasswordPage';
import NotFoundPage from '../Pages/NotFoundPage';

import UserFrontPage from '../Pages/UserFrontPage';
import SellerFrontPage from '../Pages/SellerFrontPage';
import DeliveryBoyFrontPage from '../Pages/DeliveryBoyFrontPage';
import HomePage from '../Pages/HomePage';

import Profile from '../Components/Profile/Profile';
import SellerOrder from '../Components/Seller/Order/SellerOrder';
import SellerFront from '../Components/Seller/SellerHeroPages/SellerFront';
import SellerMenuItems from '../Components/Seller/Items/SellerMenuItems';
import SellerAnalytics from '../Components/Seller/SellerAnalytics';

import CustomerHome from '../Components/Customer/Home/CustomerHome';
import CustomerOrder from '../Components/Customer/Order/CustomerOrder';
import CustomerFavorite from '../Components/Customer/Favorite/CustomerFavorite';
import CustomerCart from '../Components/Customer/Cart/CustomerCart';

import CustomerViewAllItems from '../Components/Customer/ViewAllItems/CustomerViewAllItems';
import CustomerSingleShop from '../Components/Customer/CustomerSingleShop';
import DeliveryMain from '../Components/Delivery/DeliveryMain';
import CustomerSingleItem from '../Components/Customer/SingleItem/CustomerSingleItem';
import OrderHistory from '../Components/Delivery/OrdersHistory/OrderHistory';
import { useGetShopQuery } from '../services/shop.api';

// 🔒 Auth Protection
const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

// 🎯 Role Protection
const RoleRoute = ({ children, user, role }) => {
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

const ShopProtectedRoute = () => {
  const { data } = useGetShopQuery();
  if (!data?.success) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const DefineRoutes = () => {
  const { isLoggedIn, user, allowForgotPassword } = useSelector(
    (state) => state.auth
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      {/* ================= PUBLIC ROUTES ================= */}
      <Route
        path="/signin"
        element={
          isLoggedIn ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <SignInPage />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isLoggedIn ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <SignupPage />
          )
        }
      />

      {allowForgotPassword && (
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      )}

      {/* ================= MAIN LAYOUT ================= */}
      <Route path="/" element={<HomePage />}>
        {/* ================= CUSTOMER ================= */}
        <Route
          path="customer"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <RoleRoute user={user} role="customer">
                <UserFrontPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="order" element={<CustomerOrder />} />
          <Route path="cart" element={<CustomerCart />} />
          <Route path="favorite" element={<CustomerFavorite />} />
          <Route path="item/:id" element={<CustomerSingleItem />} />
          <Route path="shop/:id" element={<CustomerSingleShop />} />
          <Route path="menu" element={<CustomerViewAllItems />} />
        </Route>

        {/* ================= SELLER ================= */}
        <Route
          path="seller"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <RoleRoute user={user} role="seller">
                <SellerFrontPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerFront />} />
          <Route element={<ShopProtectedRoute />}>
            <Route path="order" element={<SellerOrder />} />
            <Route path="menu" element={<SellerMenuItems />} />
            <Route path="analytics" element={<SellerAnalytics />} />
          </Route>

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ================= DELIVERY ================= */}
        <Route
          path="delivery-boy"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <RoleRoute user={user} role="delivery-boy">
                <DeliveryBoyFrontPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<DeliveryMain />} />
          <Route path="profile" element={<Profile />} />
          <Route path="order-history" element={<OrderHistory />} />
        </Route>
      </Route>

      {/* ================= PROTECTED PROFILE ================= */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ================= NOT FOUND ================= */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default DefineRoutes;
