import React from 'react';
import {
  FaSave,
  FaArrowRight,
  FaTimes,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaExclamationCircle,
  FaFlagCheckered,
  FaInfoCircle,
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import ProfileLocationSection from './ProfileLocationSection';

const ProfileEditMode = ({
  register,
  errors,
  focusedField,
  setFocusedField,
  nameValue,
  addressValue,
  location,
  userData,
  isGettingLocation,
  locationError,
  onGetLocation,
  isSubmitting,
  onSubmit,
  handleCancel,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative transition-all duration-200 ${
              focusedField === 'name' ? 'transform scale-[1.02]' : ''
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              {...register('name')}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <FaExclamationCircle className="mr-1 text-xs" />
              {errors.name.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {nameValue?.length || 0}/50 characters
          </p>
        </div>

        {/* Email Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative transition-all duration-200 ${
              focusedField === 'email' ? 'transform scale-[1.02]' : ''
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <FaExclamationCircle className="mr-1 text-xs" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div
            className={`relative transition-all duration-200 ${
              focusedField === 'phone' ? 'transform scale-[1.02]' : ''
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="text-gray-400" />
            </div>
            <input
              {...register('phone')}
              type="tel"
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <FaExclamationCircle className="mr-1 text-xs" />
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Location Section */}
        <div className="md:col-span-2">
          <div className="border-t border-gray-200 my-2"></div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MdLocationOn className="text-orange-500 mr-2 text-xl" />
              Location Information
            </h3>
          </div>

          <ProfileLocationSection
            location={location}
            userLocation={userData?.location}
            onGetLocation={onGetLocation}
            isGettingLocation={isGettingLocation}
            locationError={locationError}
          />
        </div>

        {/* Street Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street Address
          </label>
          <div
            className={`relative transition-all duration-200 ${
              focusedField === 'address' ? 'transform scale-[1.02]' : ''
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdLocationOn className="text-gray-400" />
            </div>
            <input
              {...register('address')}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="House No, Street, Area"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {addressValue?.length || 0}/100 characters
          </p>
        </div>

        {/* Country */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country
            </label>
            <div className="flex items-center space-x-2">
              <FaFlagCheckered className="text-green-500 text-xl" />
              <span className="text-gray-800 font-medium">Pakistan</span>
              <span className="text-xs text-gray-500 ml-2">(Fixed)</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <FaInfoCircle className="inline mr-1" />
              Country is set to Pakistan and cannot be changed
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2 w-full sm:w-auto justify-center group"
        >
          <FaTimes className="group-hover:rotate-90 transition-transform duration-200" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center group"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <FaSave className="group-hover:scale-110 transition-transform" />
              <span>Save Changes</span>
              <FaArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditMode;
