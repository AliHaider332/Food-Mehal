import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import '../App.css';
import GoogleAuth from '../Components/GoogleAuth';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../Config/axios';
import { setForgotPasswordPage, setUser } from '../Store/auth/auth.slice';
import axios from 'axios';
import { useDispatch } from 'react-redux';

// Define the validation schema using Zod
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });
      toast.success(res.data.message || 'Welcome back! 🎉');
      dispatch(setUser(res.data?.data));
      navigate('/');
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Signin failed';
        toast.error(message);
      } else if (error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, color: 'bg-gray-200', text: '' };
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return { level: 100, color: 'bg-orange-500', text: 'Strong' };
    }
    if (password.length >= 8) {
      return { level: 66, color: 'bg-orange-400', text: 'Medium' };
    }
    return { level: 33, color: 'bg-orange-300', text: 'Weak' };
  };

  const handleForgotPassword = () => {
    dispatch(setForgotPasswordPage(true));
  };
  const isFormReady = isValid;
  const passwordStrength = getPasswordStrength(watch('password'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your account
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="alihaider@gmail.com"
                    aria-label="Email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your password"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full p-0.5"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff size={18} />
                    ) : (
                      <HiOutlineEye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password.message}
                  </p>
                )}
                {watch('password') && !errors.password && (
                  <div className="mt-3 space-y-1.5 animate-fadeIn">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.level}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Password strength:{' '}
                      <span
                        className={`font-semibold ${passwordStrength.textColor}`}
                      >
                        {passwordStrength.text}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  onClick={handleForgotPassword}
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors hover:underline  px-2 py-1"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormReady || isSubmitting}
                className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 transform ${
                  isFormReady && !isSubmitting
                    ? 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-orange-500/25'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-xs text-gray-400 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Auth */}
              <div className="w-full">
                <GoogleAuth />
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors hover:underline focus:outline-none   px-2 py-1 inline-block"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 pt-4">
                <HiOutlineShieldCheck className="text-green-500 text-sm" />
                <p className="text-xs text-gray-400">
                  🔒 Secure login with 256-bit encryption
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Global Animations */}
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
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
    
    .animate-slideDown {
      animation: slideDown 0.3s ease-out;
    }
    
    .animate-blob {
      animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    
    /* Prevent zoom on iOS for form inputs */
    @media (max-width: 640px) {
      input, 
      button,
      select,
      textarea {
        font-size: 16px !important;
      }
    }
    
    /* Smooth focus ring */
    *:focus {
      outline: none;
    }
    
    /* Custom scrollbar (optional) */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `}</style>
    </div>
  );
};

export default SignInPage;
