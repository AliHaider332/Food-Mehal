import React from 'react';
import { FaEdit, FaArrowRight } from 'react-icons/fa';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileLocationSection from './ProfileLocationSection';
import { MdPerson, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import {
  FaCalendarAlt,
  FaRegClock,
  FaShieldAlt,
  FaHome,
  FaFlagCheckered,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const ProfileViewMode = ({ userData, location, formatDate, onEdit }) => {
  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <ProfileInfoCard
            icon={MdPerson}
            label="Full Name"
            value={userData?.name || 'Not provided'}
            color="#f97316"
            gradientFrom="from-gray-50"
            gradientTo="to-gray-100"
          />
        </div>

        {/* Email */}
        <ProfileInfoCard
          icon={MdEmail}
          label="Email Address"
          value={
            <span className="break-all flex items-center">
              <FaEnvelope className="text-blue-400 mr-2 text-sm" />
              {userData?.email || 'Not provided'}
            </span>
          }
          color="#3b82f6"
          gradientFrom="from-blue-50"
          gradientTo="to-indigo-50"
        />

        {/* Phone */}
        <ProfileInfoCard
          icon={MdPhone}
          label="Phone Number"
          value={
            <span className="flex items-center">
              <FaPhone className="text-green-400 mr-2 text-sm" />
              {userData?.phone || 'Not provided'}
            </span>
          }
          color="#10b981"
          gradientFrom="from-green-50"
          gradientTo="to-emerald-50"
        />

        {/* Member Since */}
        <ProfileInfoCard
          icon={FaCalendarAlt}
          label="Member Since"
          value={
            <span className="flex items-center">
              <FaRegClock className="text-yellow-400 mr-2 text-sm" />
              {formatDate(userData?.createdAt)}
            </span>
          }
          color="#eab308"
          gradientFrom="from-yellow-50"
          gradientTo="to-amber-50"
        />

        {/* Account Status */}
        <ProfileInfoCard
          icon={FaShieldAlt}
          label="Account Status"
          value={
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-gray-800 font-medium">Active</p>
              <span className="text-xs text-green-600 ml-2">✓ Verified</span>
            </div>
          }
          color="#8b5cf6"
          gradientFrom="from-purple-50"
          gradientTo="to-pink-50"
        />

        {/* Location */}
        {userData?.location && (
          <div className="md:col-span-2">
            <ProfileLocationSection
              location={location}
              userLocation={userData?.location}
              onGetLocation={() => {}}
              isGettingLocation={false}
              locationError={null}
            />
          </div>
        )}

        {/* Address Section */}

        <div className="md:col-span-2">
          <ProfileInfoCard
            icon={FaHome}
            label="Address Information"
            value={
              <div className="space-y-2 w-full">
                <p className="text-gray-800 flex items-start">
                  <MdLocationOn className="text-indigo-500 mr-2 mt-1 text-lg flex-shrink-0" />
                  <span>{userData.location.address}</span>
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <FaFlagCheckered className="text-indigo-500 mr-2" />
                  <span>Pakistan</span>
                </p>
              </div>
            }
            color="#6366f1"
            gradientFrom="from-indigo-50"
            gradientTo="to-purple-50"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onEdit}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
        >
          <FaEdit className="text-lg" />
          <span>Edit Profile</span>
          <FaArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
        </button>
      </div>
    </div>
  );
};

export default ProfileViewMode;
