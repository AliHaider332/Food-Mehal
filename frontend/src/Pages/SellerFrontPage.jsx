// OwnerFrontPage.jsx
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';

const SellerFrontPage = () => {
  return (
    <>
      <Outlet />
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SellerFrontPage;
