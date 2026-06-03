import React, { useRef } from 'react';
import { FaCamera, FaUserCircle, FaRegClock } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi';

const ProfileHeader = ({
  user,
  isEditing,
  imagePreview,
  avatarColor,
  onImageSelect,
  onRemoveImage,
  getInitials,
  getAccountAge,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="relative px-6 py-6 md:px-8 md:py-7 bg-gradient-to-r from-orange-500 to-amber-500 overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-10"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full opacity-10 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-5">
          {/* Avatar with upload option */}
          <div className="relative group">
            <div
              className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-105 overflow-hidden`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>

            {/* Upload button - visible in edit mode */}
            {isEditing && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
                  title="Upload Profile Picture"
                >
                  <FaCamera className="text-sm text-orange-500" />
                </button>
                {imagePreview && (
                  <button
                    onClick={() => {
                      fileInputRef.current.value = '';
                      onRemoveImage();
                    }}
                    className="absolute -bottom-2 -left-2 bg-red-500 rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                    title="Remove Picture"
                  >
                    <HiOutlineTrash className="text-xs text-white" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={onImageSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {isEditing ? 'Edit Profile' : user?.name}
            </h2>
            <p className="text-orange-100 text-sm mt-1">
              {isEditing
                ? 'Update your personal information'
                : 'View and manage your account details'}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              {user?.role && (
                <span className="inline-flex items-center px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                  <FaUserCircle className="mr-1 text-xs" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              )}
              {user?.createdAt && (
                <span className="inline-flex items-center px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                  <FaRegClock className="mr-1 text-xs" />
                  Member for {getAccountAge(user.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
