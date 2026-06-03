// components/ShopRegistrationForm.jsx (Simplified Version)
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  FaStore,
  FaPlus,
  FaTrash,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaSpinner,
  FaRedoAlt,
  FaUtensils,
  FaTimes,
  FaClock,
  FaTruck,
  FaDollarSign,
  FaPhone,
  FaArrowRight,
  FaImage,
  FaArrowLeft,
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import SellerHeroPage from './SellerHeroPage';
import { useSetShopMutation } from '../../../services/shop.api';

// Validation schema with PKR currency
const shopSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Shop name must be at least 2 characters')
      .max(50, 'Name too long'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(1500, 'Description too long'),
    address: z.string().min(5, 'Please enter full address'),
    phone: z.string().min(10, 'Please enter valid phone number'),
    cuisines: z.array(z.string()).min(1, 'Add at least one cuisine'),
    deliveryTime: z.object({
      min: z
        .number()
        .min(10, 'Minimum delivery time must be at least 10 minutes')
        .max(120, 'Maximum delivery time cannot exceed 120 minutes'),
      max: z
        .number()
        .min(10, 'Minimum delivery time must be at least 10 minutes')
        .max(120, 'Maximum delivery time cannot exceed 120 minutes'),
    }),
    minOrderAmount: z
      .number()
      .min(200, 'Minimum order amount must be at least ₨200'),
    deliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
    isOpen: z.boolean(),
    picture: z.any().optional(),
  })
  .refine((data) => data.deliveryTime.min <= data.deliveryTime.max, {
    message: 'Minimum time cannot be greater than maximum',
  });

const ShopRegistrationForm = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const imageInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cuisineInput, setCuisineInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [setShop] = useSetShopMutation();

  // Extract address and location from user object
  const userAddress = user?.location?.address || '';
  const userLocation = user?.location;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      cuisines: [],
      deliveryTime: { min: 25, max: 45 },
      minOrderAmount: 200,
      deliveryFee: 150,
      isOpen: true,
      picture: null,
    },
  });

  const cuisines = watch('cuisines');
  const isOpen = watch('isOpen');
  const nameValue = watch('name', '');
  const descriptionValue = watch('description', '');
  const deliveryMin = watch('deliveryTime.min', 25);
  const deliveryMax = watch('deliveryTime.max', 45);

  // Set address from user.location.address
  useEffect(() => {
    if (userAddress) {
      setValue('address', userAddress);
    }
  }, [userAddress, setValue]);

  // Cleanup function for image preview
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const addCuisine = () => {
    const value = cuisineInput.trim();
    if (!value) return;

    if (cuisines.includes(value)) {
      toast.warning('Cuisine already added');
      return;
    }

    setValue('cuisines', [...cuisines, value]);
    setCuisineInput('');
  };

  const handleCuisineKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCuisine();
    }
  };

  const removeCuisine = (index) => {
    const updated = cuisines.filter((_, i) => i !== index);
    setValue('cuisines', updated);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Max image size is 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Clean up old preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setValue('picture', file);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setValue('picture', null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const onSubmit = async (data) => {
    // Validation checks
    if (!data.name || !data.description || !data.address || !data.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    if (data.cuisines.length === 0) {
      toast.error('Please add at least one cuisine');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', data.name.trim());
      formData.append('description', data.description.trim());
      formData.append('address', data.address.trim());
      formData.append('phone', data.phone.trim());
      formData.append('cuisines', JSON.stringify(data.cuisines));
      formData.append('deliveryTime', JSON.stringify(data.deliveryTime));
      formData.append('minOrderAmount', data.minOrderAmount);
      formData.append('deliveryFee', data.deliveryFee);
      formData.append('isOpen', data.isOpen);

      if (userLocation) {
        formData.append('location', JSON.stringify(userLocation));
      }

      if (data.picture && data.picture instanceof File) {
        formData.append('picture', data.picture);
      }

      const result = await setShop(formData).unwrap();

      if (result.success) {
        toast.success('Shop Registered successfully');
        reset();
        setImagePreview(null);
        setCuisineInput('');
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
        setCurrentStep(1);
        setShowForm(false);
      } else {
        toast.error('Registration failed');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
      console.error('Registration failed ', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset the form? All data will be lost.'
      )
    ) {
      reset();
      removeImage();
      setCuisineInput('');
      setCurrentStep(1);
      toast.info('Form reset');
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger([
        'name',
        'description',
        'address',
        'phone',
      ]);
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 2) {
      const isValid = await trigger([
        'cuisines',
        'deliveryTime.min',
        'deliveryTime.max',
        'minOrderAmount',
        'deliveryFee',
      ]);
      if (isValid && cuisines.length > 0) {
        setCurrentStep(currentStep + 1);
      } else if (cuisines.length === 0) {
        toast.error('Please add at least one cuisine');
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    if (currentStep > 1 || Object.keys(watch()).some((key) => watch(key))) {
      if (
        window.confirm(
          'Are you sure you want to cancel? All progress will be lost.'
        )
      ) {
        reset();
        removeImage();
        setCuisineInput('');
        setCurrentStep(1);
        setShowForm(false);
      }
    } else {
      setShowForm(false);
      setCurrentStep(1);
    }
  };

  // Format currency for PKR
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₨0';
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // If form is not shown, show the registration prompt/button
  if (!showForm) {
    return <SellerHeroPage setShowForm={setShowForm} />;
  }

  // Show registration form
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-md overflow-hidden">

        {/* Header */}
        <div className="relative px-6 py-6 md:px-8 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="relative z-10 flex justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FaStore className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Restaurant Dashboard
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                Manage your restaurant profile and track performance
              </p>
            </div>
            
          </div>
          <button
              onClick={handleCancel}
              className="text-white shadow-md shadow-white hover:bg-white/20 px-3 h-10 rounded transition-colors duration-200 text-sm "
            >
              Cancel
            </button>
        </div>
      </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaStore className="inline mr-1 text-orange-500" /> Shop Name{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Tasty Bites Restaurant"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {nameValue.length}/50 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaInfoCircle className="inline mr-1 text-orange-500" />{' '}
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your restaurant's cuisine, atmosphere, and specialties..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {descriptionValue.length}/1500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline mr-1 text-orange-500" />{' '}
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('address')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Full street address"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
                {userAddress && !errors.address && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <FaCheckCircle /> Address auto-filled from your profile
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="inline mr-1 text-orange-500" /> Phone
                  Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+92 XXX XXXXXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUtensils className="inline mr-1 text-orange-500" />{' '}
                  Cuisines <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={cuisineInput}
                    onChange={(e) => setCuisineInput(e.target.value)}
                    onKeyPress={handleCuisineKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Italian, Chinese, Fast Food"
                  />
                  <button
                    type="button"
                    onClick={addCuisine}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1 text-sm"
                  >
                    <FaPlus className="text-xs" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cuisines.map((cuisine, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      {cuisine}
                      <FaTimes
                        className="cursor-pointer hover:text-red-500 text-xs"
                        onClick={() => removeCuisine(index)}
                      />
                    </span>
                  ))}
                </div>
                {errors.cuisines && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cuisines.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MdDeliveryDining className="inline mr-1 text-orange-500" />{' '}
                  Delivery Time (minutes)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      {...register('deliveryTime.min', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Min"
                    />
                    {errors.deliveryTime?.min && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.deliveryTime.min.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      {...register('deliveryTime.max', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Max"
                    />
                    {errors.deliveryTime?.max && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.deliveryTime.max.message}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Estimated delivery: {deliveryMin}-{deliveryMax} minutes
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaDollarSign className="inline mr-1 text-orange-500" />{' '}
                  Minimum Order Amount (PKR){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="1"
                  {...register('minOrderAmount', { valueAsNumber: true })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.minOrderAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="100"
                />
                {errors.minOrderAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.minOrderAmount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaTruck className="inline mr-1 text-orange-500" /> Delivery
                  Fee (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="1"
                  {...register('deliveryFee', { valueAsNumber: true })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.deliveryFee ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50"
                />
                {errors.deliveryFee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.deliveryFee.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaClock className="inline mr-1 text-orange-500" /> Shop
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isOpen === true}
                      onChange={() => setValue('isOpen', true)}
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-sm text-green-600">Open</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isOpen === false}
                      onChange={() => setValue('isOpen', false)}
                      className="w-4 h-4 text-red-500"
                    />
                    <span className="text-sm text-red-600">Closed</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaImage className="inline mr-1 text-orange-500" /> Shop Image
                </label>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaStore className="text-3xl text-gray-400" />
                      )}
                    </div>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImage}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      id="shop-image-upload"
                    />
                    <label
                      htmlFor="shop-image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      <FaCloudUploadAlt /> Choose Image
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      Max size: 5MB | JPEG, PNG, GIF, WEBP
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-4 space-y-2">
                <h3 className="font-medium text-gray-900 mb-2">
                  Review Your Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-gray-600">
                      Shop Name:
                    </span>{' '}
                    {watch('name') || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Address:</span>{' '}
                    {watch('address') || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Phone:</span>{' '}
                    {watch('phone') || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Cuisines:</span>{' '}
                    {cuisines.join(', ') || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Delivery:</span>{' '}
                    {deliveryMin}-{deliveryMax} min
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Min Order:
                    </span>{' '}
                    {formatCurrency(watch('minOrderAmount'))}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Delivery Fee:
                    </span>{' '}
                    {formatCurrency(watch('deliveryFee'))}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Status:</span>{' '}
                    {watch('isOpen') ? 'Open' : 'Closed'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1 text-sm"
                >
                  <FaArrowLeft className="text-xs" /> Back
                </button>
              )}
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1 text-sm"
                >
                  <FaRedoAlt className="text-xs" /> Reset
                </button>
              )}
            </div>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1 text-sm"
              >
                Continue <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />{' '}
                    Registering...
                  </>
                ) : (
                  <>
                    Register Shop <FaCheckCircle />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopRegistrationForm;
