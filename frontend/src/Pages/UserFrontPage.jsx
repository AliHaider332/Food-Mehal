// UserFrontPage.jsx
import React from 'react';

import { Outlet } from 'react-router-dom';
const UserFrontPage = () => {
  return (
    <>
      <div className="animate-fade-in">
        <Outlet />
      </div>
    </>
  );
};

export default UserFrontPage;
