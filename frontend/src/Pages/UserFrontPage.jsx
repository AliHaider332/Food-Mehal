// UserFrontPage.jsx
import React from 'react';

import { Outlet } from 'react-router-dom';
import useFetchCustomerData from '../hooks/useFetchCustomerData';
const UserFrontPage = () => {
  useFetchCustomerData();
  return (
    <>
      <div className="animate-fade-in">
        <Outlet />
      </div>
    </>
  );
};

export default UserFrontPage;
