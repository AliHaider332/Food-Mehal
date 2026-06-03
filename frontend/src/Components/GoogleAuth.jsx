import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { axiosInstance } from '../Config/axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/auth/auth.slice';

const GoogleAuth = ({ phone, role, location }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleGoogleAccount = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      setLoading(true);
      try {
        const res = await axiosInstance.post(
          `/auth/google-auth?code=${encodeURIComponent(response.code)}`,
          {
            phone,
            location,
            role,
          }
        );

        if (res.data.success) {
          toast.success('Successfully signed in with Google!');
          dispatch(setUser(res.data?.data));
          navigate('/');
        } else {
          toast.error(res.data.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Google auth error:', error);
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message || 'Authentication failed';
          toast.error(message);
        } else {
          toast.error('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    },

    onError: (error) => {
      setLoading(false);
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    },
  });

  return (
    <button
      type="button"
      onClick={handleGoogleAccount}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-200 group ${
        loading
          ? 'opacity-70 cursor-not-allowed'
          : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
          <span>Sign up with Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleAuth;
