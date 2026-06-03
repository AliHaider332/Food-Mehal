import React from 'react';
import useGetUser from './hooks/useGetUser';
import { BrowserRouter } from 'react-router-dom';
import DefineRoutes from './Routes/DefineRoutes.jsx';
import { ToastContainer } from 'react-toastify';
import CustomLoading from './Components/CustomLoading.jsx';
import LocationError from './Components/LocationError.jsx';
const App = () => {
  const { status, loading } = useGetUser();

  if (loading) {
    return <CustomLoading />;
  }
  if (status === 'denied') {
    return <LocationError />;
  }
  return (
    <BrowserRouter>
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

      <DefineRoutes />
    </BrowserRouter>
  );
};

export default App;
