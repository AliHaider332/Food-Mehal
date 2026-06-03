import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import GoogleAuth from '../Components/GoogleAuth';
import { toast } from 'react-toastify';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../Config/axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/auth/auth.slice';

// Validation Schema
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name is too long'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'seller', 'delivery-boy']),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const roleConfig = {
  customer: {
    icon: HiOutlineUserGroup,
    title: 'Customer',
  },
  seller: {
    icon: HiOutlineBriefcase,
    title: 'Restaurant Owner',
  },
  'delivery-boy': {
    icon: HiOutlineTruck,
    title: 'Delivery Partner',
  },
};

// Get address from coordinates
const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`,
      { headers: { 'User-Agent': 'FoodDeliveryApp/1.0' } }
    );
    const data = await response.json();
    return data.display_name || `${latitude}, ${longitude}`;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};

const SignupPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [address, setAddress] = useState('');
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
      termsAccepted: false,
    },
  });

  // Watch all form values for real-time validation
  const watchedValues = watch();
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');
  const watchedTerms = watch('termsAccepted');
  const watchedRole = watch('role');

  const isFieldValid = (fieldName) => {
    return (
      touchedFields[fieldName] && !errors[fieldName] && watchedValues[fieldName]
    );
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    trigger(fieldName);
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      toast.error('Geolocation is not supported');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const geoLocation = {
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude],
        };
        setLocation(geoLocation);
        const fetchedAddress = await getAddressFromCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );

        if (fetchedAddress) {
          setAddress(fetchedAddress);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location access denied';
        }
        setLocationError(errorMessage);
        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    if (!location) {
      toast.error('Location access required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        location: location,
        address: address,
      };
      const res = await axiosInstance.post('/auth/signup', payload);
      toast.success(res.data.message || 'Account created successfully!');
      dispatch(setUser(res.data?.data));
      navigate('/', { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role) => {
    setValue('role', role, { shouldValidate: true });
    setTouchedFields((prev) => ({ ...prev, role: true }));
    trigger('role');
  };

  const isFormReady =
    isValid && location && watchedTerms && !isSubmitting && !isGettingLocation;

  // Helper to render field status icon
  const renderFieldStatus = (fieldName) => {
    if (!touchedFields[fieldName] && !watchedValues[fieldName]) return null;
    if (errors[fieldName]) {
      return (
        <HiOutlineExclamationCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
      );
    }
    if (watchedValues[fieldName]) {
      return (
        <HiOutlineCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome to Food Mehal
          </h2>
          <p className="mt-2 text-sm text-gray-600">Create your account</p>
        </div>

        {/* Location Status */}
        <div
          className={`bg-gray-50 p-3 rounded-md transition-all duration-200 ${
            !location && !isGettingLocation
              ? 'border border-red-200 bg-red-50'
              : ''
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <HiOutlineLocationMarker
                className={location ? 'text-gray-500' : 'text-red-500'}
              />
              <span className="text-sm font-medium text-gray-700">
                Location{' '}
                {!location && !isGettingLocation && (
                  <span className="text-red-500">*</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                location
                  ? 'bg-green-500'
                  : isGettingLocation
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600">
              {isGettingLocation
                ? 'Getting location...'
                : location
                ? 'Current Location'
                : locationError || 'Location required for service'}
            </span>
          </div>
          {address && (
            <p className="text-sm text-gray-500 mt-2 ">{address}</p>
          )}
          {!location && !isGettingLocation && (
            <button
              type="button"
              onClick={getCurrentLocation}
              className="mt-2 text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              Retry location access
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                {...register('fullName')}
                onBlur={() => handleFieldBlur('fullName')}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.fullName && touchedFields.fullName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : isFieldValid('fullName')
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="Ali Haider"
              />
              {renderFieldStatus('fullName')}
            </div>
            {errors.fullName && touchedFields.fullName && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <HiOutlineExclamationCircle /> {errors.fullName.message}
              </p>
            )}
            {isFieldValid('fullName') && (
              <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                <HiOutlineCheckCircle /> Looks good!
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register('email')}
                onBlur={() => handleFieldBlur('email')}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email && touchedFields.email
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : isFieldValid('email')
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="alihaider@gmail.com"
              />
              {renderFieldStatus('email')}
            </div>
            {errors.email && touchedFields.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <HiOutlineExclamationCircle /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                {...register('phone')}
                onBlur={() => handleFieldBlur('phone')}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.phone && touchedFields.phone
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : isFieldValid('phone')
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="+1 234 567 8900"
              />
              {renderFieldStatus('phone')}
            </div>
            {errors.phone && touchedFields.phone && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <HiOutlineExclamationCircle /> {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                onBlur={() => handleFieldBlur('password')}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password && touchedFields.password
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : isFieldValid('password')
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            {errors.password && touchedFields.password && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <HiOutlineExclamationCircle /> {errors.password.message}
              </p>
            )}
            {watchedPassword && !errors.password && (
              <div className="mt-1">
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <HiOutlineCheckCircle /> Password strength:
                  {watchedPassword.length >= 8 ? ' Good' : ' Too short'}
                </p>
                <div className="mt-1 flex gap-1">
                  {['length', 'valid'].map((criteria, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full ${
                        (criteria === 'length' &&
                          watchedPassword.length >= 8) ||
                        (criteria === 'valid' && watchedPassword.length > 0)
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                onBlur={() => handleFieldBlur('confirmPassword')}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.confirmPassword && touchedFields.confirmPassword
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : isFieldValid('confirmPassword')
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            {errors.confirmPassword && touchedFields.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <HiOutlineExclamationCircle /> {errors.confirmPassword.message}
              </p>
            )}
            {watchedConfirmPassword &&
              watchedPassword === watchedConfirmPassword &&
              !errors.confirmPassword && (
                <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                  <HiOutlineCheckCircle /> Passwords match
                </p>
              )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to join as * <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(roleConfig).map(([role, config]) => {
                const Icon = config.icon;
                const isSelected = watchedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`p-3 rounded-md border text-center transition-all duration-200 group ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <Icon
                      className={`mx-auto text-xl mb-1 transition-colors duration-200 ${
                        isSelected
                          ? 'text-orange-500'
                          : 'text-gray-500 group-hover:text-orange-400'
                      }`}
                    />
                    <div className="text-xs font-medium">{config.title}</div>
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register('role')} />
            {errors.role && touchedFields.role && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <HiOutlineExclamationCircle /> {errors.role.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              {...register('termsAccepted')}
              onBlur={() => handleFieldBlur('termsAccepted')}
              className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-orange-500 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-orange-500 hover:underline">
                Privacy Policy
              </Link>
              <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.termsAccepted && touchedFields.termsAccepted && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <HiOutlineExclamationCircle /> {errors.termsAccepted.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormReady}
            className={`w-full py-2.5 rounded-md font-semibold transition-all duration-200 ${
              isFormReady
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg transform hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Google Auth */}
          {location && (
            <GoogleAuth
              phone={getValues('phone') || ''}
              role={getValues('role') || 'customer'}
              location={location}
            />
          )}

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-orange-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
