// src/hooks/useGetUser.js

import { useEffect, useState } from 'react';
import { axiosInstance } from '../Config/axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/auth/auth.slice';

const useGetUser = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  /*
    status:
    - 'success'
    - 'unauthorized'
    - 'denied'
  */

  const [status, setStatus] = useState('denied');

  useEffect(() => {
    const getUser = async (lng, lat) => {
      try {
        const res = await axiosInstance.get(`/auth/get-user/${lng}/${lat}`);

        dispatch(setUser(res.data?.data));

        setStatus('success');
      } catch (error) {
        console.log(error.response?.data?.message || 'Signin failed');

        setStatus('unauthorized');
      } finally {
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (!navigator.geolocation) {
        setStatus('denied');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          getUser(lng, lat);
        },

        (error) => {
          console.log(error);

          setStatus('denied');
          setLoading(false);
        }
      );
    };

    getLocation();
  }, [dispatch]);

  return {
    loading,
    status,
  };
};

export default useGetUser;
