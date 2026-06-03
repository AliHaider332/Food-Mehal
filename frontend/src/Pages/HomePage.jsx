import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../Components/Header';
import useEstablishSocketConnection from '../hooks/useEstablishSocketConnection.jsx';
import useSocketOperations from '../hooks/useSocketOperations.jsx';
import ComponentLoading from '../Components/ComponentLoading.jsx';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
const HomePage = () => {
  const { loading, isLoggedIn } = useSelector((state) => state.auth);
  const socket = useEstablishSocketConnection();
  useSocketOperations(socket);
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  if (!isLoggedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="min-h-screen min-w-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      <main className="min-h-screen min-w-full flex justify-center items-center">
        <div className="min-h-screen min-w-full">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{
              top: '70px',
              zIndex: 9999,
            }}
            toastStyle={{
              borderRadius: '12px',
              fontFamily: 'inherit',
            }}
            limit={5}
          />
          <Header />
          {loading ? <ComponentLoading /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
