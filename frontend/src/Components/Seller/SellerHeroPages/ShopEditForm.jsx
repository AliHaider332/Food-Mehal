import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  FaStore,
  FaClock,
  FaPlus,
  FaTrash,
  FaSpinner,
  FaSave,
  FaTimes,
  FaDollarSign,
  FaTruck,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaArrowRight,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaUtensils,
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { useSetShopMutation } from '../../../services/shop.api';

const shopSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Shop name must be at least 2 characters')
      .max(50, 'Shop name too long'),
    description: z
      .string()
      .min(10, 'Please provide a description')
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
      .min(200, 'Minimum order amount must be at least 200 PKR'),
    deliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
    isOpen: z.boolean().default(true),
    picture: z.any().optional(),
  })
  .refine((data) => data.deliveryTime.min <= data.deliveryTime.max, {
    message: 'Minimum delivery time cannot be greater than maximum',
    path: ['deliveryTime.min'],
  });

const ShopEditForm = ({ shopData, onCancel }) => {
  const imageInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [cuisineInput, setCuisineInput] = useState('');

  // Move hook to component level (not inside onSubmit)
  const [setShop] = useSetShopMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      cuisines: [],
      deliveryTime: { min: 25, max: 45 },
      minOrderAmount: 10,
      deliveryFee: 50,
      isOpen: true,
      picture: null,
    },
  });

  const watchIsOpen = watch('isOpen', true);
  const descriptionValue = watch('description', '');
  const nameValue = watch('name', '');
  const deliveryMin = watch('deliveryTime.min', 25);
  const deliveryMax = watch('deliveryTime.max', 45);
  const cuisines = watch('cuisines') || [];
  const currentValues = watch();

  // Check for changes
  useEffect(() => {
    if (shopData && currentValues.name) {
      const hasAnyChanges =
        currentValues.name !== (shopData.name || '') ||
        currentValues.description !== (shopData.description || '') ||
        currentValues.address !== (shopData.location?.address || '') ||
        currentValues.phone !== (shopData.phone || '') ||
        JSON.stringify(currentValues.cuisines) !==
          JSON.stringify(shopData.cuisines || []) ||
        currentValues.deliveryTime?.min !==
          (shopData.deliveryTime?.min || 25) ||
        currentValues.deliveryTime?.max !==
          (shopData.deliveryTime?.max || 45) ||
        currentValues.minOrderAmount !== (shopData.minOrderAmount || 200) ||
        currentValues.deliveryFee !== (shopData.deliveryFee || 150) ||
        currentValues.isOpen !== (shopData.isOpen ?? true);

      // Check image change
      const hasImageChange = imagePreview && imagePreview !== shopData?.picture;

      setHasChanges(hasAnyChanges || hasImageChange);
    }
  }, [currentValues, shopData, imagePreview]);

  // Load shop data
  useEffect(() => {
    if (shopData) {
      reset({
        name: shopData.name || '',
        description: shopData.description || '',
        address: shopData.location?.address || '',
        phone: shopData.phone || '',
        cuisines: shopData.cuisines || [],
        deliveryTime: shopData.deliveryTime || { min: 25, max: 45 },
        minOrderAmount: shopData.minOrderAmount || 100,
        deliveryFee: shopData.deliveryFee || 150,
        isOpen: shopData.isOpen,
        picture: null,
      });
      if (shopData.picture) {
        setImagePreview(shopData.picture);
      }
    }
  }, [shopData, reset]);

  // Cuisine management functions
  const addCuisine = () => {
    const trimmedCuisine = cuisineInput.trim();
    if (trimmedCuisine) {
      if (cuisines.includes(trimmedCuisine)) {
        toast.warning('Cuisine already added');
        return;
      }
      setValue('cuisines', [...cuisines, trimmedCuisine]);
      setCuisineInput('');
    }
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

      // Revoke old preview URL to avoid memory leaks
      if (imagePreview && imagePreview !== shopData?.picture) {
        URL.revokeObjectURL(imagePreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setValue('picture', file);
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview !== shopData?.picture) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setValue('picture', null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
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

      // Only include location if shopData exists
      if (shopData?.location) {
        formData.append('location', JSON.stringify(shopData.location));
      }

      // Handle image
      if (data.picture && data.picture instanceof File) {
        formData.append('picture', data.picture);
      } else if (!data.picture && shopData?.picture) {
        formData.append('removePicture', 'true');
      }

      // Call the mutation
      const result = await setShop(formData).unwrap();
  
      
      if (result.success) {
        toast.success('Shop profile updated successfully');
        // Reset form with new data
        reset();
        setImagePreview(result.data?.picture || null);
        setHasChanges(false);
        onCancel(false);
      } else {
        toast.error('Failed to update shop');
      }
    } catch (error) {
      console.error('Error updating shop:', error);
      toast.error(
        error?.data?.message || 'An error occurred while updating the shop'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm(
          'You have unsaved changes. Are you sure you want to cancel?'
        )
      ) {
        // Clean up preview URL
        if (imagePreview && imagePreview !== shopData?.picture) {
          URL.revokeObjectURL(imagePreview);
        }
        onCancel(false);
      }
    } else {
      if (imagePreview && imagePreview !== shopData?.picture) {
        URL.revokeObjectURL(imagePreview);
      }
      onCancel(false);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== shopData?.picture) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, shopData]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="relative px-6 py-6 md:px-8 md:py-7 bg-gradient-to-r from-orange-500 to-amber-500 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FaEdit className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Edit Shop Details
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                Update your restaurant information
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shop Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaStore className="inline mr-2 text-orange-500" /> Shop Name{' '}
              <span className="text-red-500">*</span>
            </label>
            <div
              className={`transition-all duration-200 ${
                focusedField === 'name' ? 'transform scale-[1.02]' : ''
              }`}
            >
              <input
                {...register('name')}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="Enter shop name"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {nameValue.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaInfoCircle className="inline mr-2 text-orange-500" />{' '}
              Description <span className="text-red-500">*</span>
            </label>
            <div
              className={`transition-all duration-200 ${
                focusedField === 'description' ? 'transform scale-[1.02]' : ''
              }`}
            >
              <textarea
                {...register('description')}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                rows="4"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="Describe your restaurant..."
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {descriptionValue.length}/1500 characters
            </p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaMapMarkerAlt className="inline mr-2 text-orange-500" /> Address{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              {...register('address')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                errors.address
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="Full street address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-orange-500" /> Phone Number{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Cuisines */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaUtensils className="inline mr-2 text-orange-500" /> Cuisines{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={cuisineInput}
                onChange={(e) => setCuisineInput(e.target.value)}
                onKeyPress={handleCuisineKeyPress}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Italian, Chinese, Fast Food"
              />
              <button
                type="button"
                onClick={addCuisine}
                className="px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 flex items-center gap-2"
              >
                <FaPlus /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {cuisines.map((cuisine, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {cuisine}
                  <button
                    type="button"
                    onClick={() => removeCuisine(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            {errors.cuisines && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cuisines.message}
              </p>
            )}
          </div>

          {/* Delivery Time */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MdDeliveryDining className="inline mr-2 text-orange-500" />{' '}
              Delivery Time (minutes)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  {...register('deliveryTime.min', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Min time"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Max time"
                />
                {errors.deliveryTime?.max && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.deliveryTime.max.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Estimated delivery: {deliveryMin}-{deliveryMax} minutes
            </p>
          </div>

          {/* Minimum Order Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaDollarSign className="inline mr-2 text-orange-500" /> Minimum
              Order Amount
            </label>
            <input
              type="number"
              step="0.01"
              {...register('minOrderAmount', { valueAsNumber: true })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                errors.minOrderAmount
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="10.00"
            />
            {errors.minOrderAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minOrderAmount.message}
              </p>
            )}
          </div>

          {/* Delivery Fee */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaTruck className="inline mr-2 text-orange-500" /> Delivery Fee
            </label>
            <input
              type="number"
              step="0.01"
              {...register('deliveryFee', { valueAsNumber: true })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                errors.deliveryFee
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-orange-500'
              }`}
              placeholder="2.99"
            />
            {errors.deliveryFee && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryFee.message}
              </p>
            )}
          </div>

          {/* Shop Status */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaClock className="inline mr-2 text-orange-500" /> Shop Status
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={watchIsOpen === true}
                  onChange={() => setValue('isOpen', true)}
                  className="w-4 h-4 text-green-500 focus:ring-green-500"
                />
                <span className="text-green-600 font-medium">Open</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={watchIsOpen === false}
                  onChange={() => setValue('isOpen', false)}
                  className="w-4 h-4 text-red-500 focus:ring-red-500"
                />
                <span className="text-red-600 font-medium">Closed</span>
              </label>
            </div>
            {watchIsOpen === false && (
              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <FaInfoCircle /> When closed, customers won't be able to place
                orders
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shop Image
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Shop preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <FaStore className="text-4xl text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                )}
              </div>

              <div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={onImageSelect}
                  className="hidden"
                  id="shop-image-edit"
                />
                <label
                  htmlFor="shop-image-edit"
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  <FaCloudUploadAlt /> Change Image
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max size: 5MB | Square image recommended
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: JPEG, PNG, GIF, WEBP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {isSubmitting && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Updating shop...</span>
            </div>
          </div>
        )}

        {/* Unsaved Changes Indicator */}
        {hasChanges && !isSubmitting && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200 animate-pulse">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <FaInfoCircle /> You have unsaved changes. Don't forget to save!
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 group"
          >
            <FaTimes className="group-hover:rotate-90 transition-transform duration-200" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <FaSave className="group-hover:scale-110 transition-transform" />
                Save Changes
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Tips Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium">
                Tips for best results
              </p>
              <ul className="text-xs text-blue-600 mt-1 space-y-1">
                <li>
                  • Use high-quality images for better customer engagement
                </li>
                <li>• Keep your description concise but informative</li>
                <li>• Make sure your address is accurate for delivery</li>
                <li>• Update your phone number to avoid missed calls</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShopEditForm;
