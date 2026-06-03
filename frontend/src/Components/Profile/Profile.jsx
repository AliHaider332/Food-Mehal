/* eslint-disable react-hooks/rules-of-hooks */
// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { toast } from 'react-toastify';
import { setUser } from '../../Store/auth/auth.slice';
import ProfileHeader from './ProfileHeader';
import ProfileViewMode from './ProfileViewMode';
import ProfileEditMode from './ProfileEditMode';
import ProfileLoadingSpinner from './ProfileLoadingSpinner';
import { axiosInstance } from '../../Config/axios';

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter valid phone number'),
  address: z.string().optional(),
});

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [userData, setUserData] = useState(null);
  const [avatarColor, setAvatarColor] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const nameValue = watch('name', '');
  const addressValue = watch('address', '');

  // Generate random avatar color based on user name
  useEffect(() => {
    if (user?.name) {
      const colors = [
        'from-red-500 to-red-600',
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-yellow-500 to-yellow-600',
        'from-orange-500 to-orange-600',
        'from-teal-500 to-teal-600',
        'from-cyan-500 to-cyan-600',
      ];
      const index = user.name.length % colors.length;
      setAvatarColor(colors[index]);
    }
  }, [user?.name]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Load user data
  useEffect(() => {
    if (user) {
      setUserData(user);
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('address', user.location.address || '');

      if (user.picture) {
        setImagePreview(user.picture);
      } else {
        setImagePreview(null);
      }

      if (user.location) {
        setLocation(user.location);
      }
    }
  }, [user, setValue]);

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Reverse geocoding (lat/lng → address)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const data = await res.json();

        const address = data.display_name;

        const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
          address, // ✅ full address
        };
        setLocation(location);
        toast.success('Location captured successfully!');
      } catch (err) {
        console.error(err);
        setLocationError('Failed to fetch address');
      }
      setIsGettingLocation(false);
    });
  };
  const onImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG, GIF, or WEBP)');
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name.trim());
      formData.append('email', data.email.trim());
      formData.append('phone', data.phone.trim());
      formData.append('address', data.address?.trim() || '');
      if (location) {
        formData.append('location', JSON.stringify(location));
      }
      if (profileImage) {
        formData.append('picture', profileImage);
      } else if (
        profileImage === null &&
        imagePreview === null &&
        userData?.picture
      ) {
        formData.append('removePicture', 'true');
      }

      const response = await axiosInstance.put(
        '/auth/update-profile',
        formData
      );
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        toast.success('Profile updated successfully! 🎉');
        setIsEditing(false);
        setProfileImage(null);
        if (response.data.data) {
          setUserData(response.data.data);
          if (response.data.data.picture) {
            setImagePreview(response.data.data.picture);
          }
        }
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        error.response?.data?.message ||
          'Error updating profile. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setValue('name', userData?.name || '');
    setValue('email', userData?.email || '');
    setValue('phone', userData?.phone || '');
    setValue('address', userData?.location.address || '');
    setProfileImage(null);
    setImagePreview(userData?.picture || null);
    setLocation(userData?.location || null);
    setLocationError(null);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAccountAge = (createdAt) => {
    if (!createdAt) return null;
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  if (!userData) {
    return <ProfileLoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <ProfileHeader
          user={userData}
          isEditing={isEditing}
          imagePreview={imagePreview}
          avatarColor={avatarColor}
          onImageSelect={onImageSelect}
          onRemoveImage={removeImage}
          getInitials={getInitials}
          getAccountAge={getAccountAge}
        />

        {!isEditing ? (
          <ProfileViewMode
            userData={userData}
            location={location}
            formatDate={formatDate}
            onEdit={() => setIsEditing(true)}
          />
        ) : (
          <ProfileEditMode
            register={register}
            errors={errors}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            nameValue={nameValue}
            addressValue={addressValue}
            location={location}
            userData={userData}
            isGettingLocation={isGettingLocation}
            locationError={locationError}
            onGetLocation={getCurrentLocation}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
