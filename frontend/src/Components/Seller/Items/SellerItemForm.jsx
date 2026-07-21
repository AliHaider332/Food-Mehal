import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  FaTag,
  FaPercent,
  FaRupeeSign,
  FaCloudUploadAlt,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaSearch,
} from 'react-icons/fa';
import { MdFastfood, MdCategory } from 'react-icons/md';
import { formatPrice } from '../../../utils/formatPrice';
import {
  useCreateItemMutation,
  useUpdateItemMutation,
} from '../../../services/shop.api';

const itemSchema = z.object({
  name: z
    .string()
    .min(2, 'Item name must be at least 2 characters')
    .max(50, 'Item name too long'),
  price: z.number().min(0, 'Price must be 0 or more'),
  discount: z
    .number()
    .min(0, 'Discount must be 0 or more')
    .max(100, 'Discount cannot exceed 100%'),
  category: z.string().min(1, 'Please select a category'),
  description: z
    .string()
    .min(5, 'Please provide a description')
    .max(500, 'Description too long'),
  picture: z.any().optional(),
  isAvailable: z.boolean().default(true),
});

// All categories as a flat array (no groups)
const categories = [
  // Pakistani
  'Biryani & Pulao',
  'Karahi & Handi',
  'Nihari & Paya',

  // BBQ
  'BBQ & Grill',
  'Tikka & Kebabs',

  // Fast Food
  'Burgers',
  'Pizza',
  'Shawarma',
  'Broast & Fried Chicken',
  'Rolls & Wraps',

  // Breakfast
  'Paratha & Breakfast',

  // Street Food
  'Street Food',
  'Chaat & Snacks',

  // International
  'Chinese',
  'Indian',
  'Asian',
  'Arabian',

  // Desserts
  'Desserts & Sweets',
  'Ice Cream',
  'Bakery',

  // Beverages
  'Tea & Coffee',
  'Beverages',
  'Juices & Shakes',
  'Drink',

  // Health
  'Healthy Food',

  // Homemade
  'Home Made Food',
];

// Professional Custom Category Dropdown Component (Simplified)
const CustomCategorySelect = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter categories based on search
  const filteredCategories = searchTerm
    ? categories.filter((cat) =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  const handleSelect = (category) => {
    onChange(category);
    setIsOpen(false);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Custom Select Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border rounded-xl bg-white cursor-pointer transition-all duration-200 flex items-center justify-between ${
          error
            ? 'border-red-500'
            : isOpen
            ? 'border-orange-500 ring-2 ring-orange-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {value ? (
            <span className="text-gray-700">{value}</span>
          ) : (
            <span className="text-gray-400">Select a category...</span>
          )}
        </div>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No categories found
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => handleSelect(cat)}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-150 ${
                    value === cat
                      ? 'bg-orange-50 text-orange-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{cat}</span>
                  {value === cat && (
                    <FaCheckCircle className="text-orange-500 text-sm" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-400">
              {categories.length} categories available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const SellerItemForm = ({
  isEditing = false,
  editData = null,
  onCancel,
  onSuccess,
}) => {
  const imageInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      price: 0,
      discount: 0,
      category: categories[0],
      description: '',
      picture: '',
      isAvailable: true,
    },
  });

  const nameValue = watch('name', '');
  const descriptionValue = watch('description', '');
  const isAvailable = watch('isAvailable');
  const price = watch('price', 0);
  const discount = watch('discount', 0);
  const selectedCategory = watch('category');

  const discountedPrice = price - (price * discount) / 100;
  const hasDiscount = discount > 0;
  const savings = price - discountedPrice;

  // Load the editing data
  useEffect(() => {
    if (isEditing && editData) {
      reset({
        name: editData.name || '',
        price: editData.price || 0,
        discount: editData.discount || 0,
        category: editData.category || categories[0],
        description: editData.description || '',
        picture: editData.picture || '',
        isAvailable:
          editData.isAvailable !== undefined ? editData.isAvailable : true,
      });
      if (editData.picture) {
        setImagePreview(editData.picture);
      }
    }
  }, [isEditing, editData, reset]);

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
      setImagePreview(URL.createObjectURL(file));
      setValue('picture', file);
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview !== editData?.picture) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setValue('picture', '');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const toggleAvailability = () => {
    setValue('isAvailable', !isAvailable);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name.trim());
      formData.append('price', data.price);
      formData.append('discount', data.discount || 0);
      formData.append('category', data.category);
      formData.append('description', data.description.trim());
      formData.append('isAvailable', data.isAvailable);
      if (data.picture && data.picture instanceof File) {
        formData.append('picture', data.picture);
      }

      let response;
      if (isEditing) {
        response = await updateItem({ data: formData, id: editData?._id });

        if (response.data.success) {
          toast.success('Item updated successfully!');
        }
      } else {
        response = await createItem(formData);
        if (response.data.success) {
          toast.success('Item added successfully!');
        }
      }

      if (response.data.success) {
        reset();
        setImagePreview(null);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          if (onCancel) onCancel();
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(
        error.response?.data?.message || 'Error saving item. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (imagePreview && imagePreview !== editData?.picture) {
      URL.revokeObjectURL(imagePreview);
    }
    if (onCancel) onCancel();
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== editData?.picture) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, editData]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {isEditing ? <FaTag /> : <FaRupeeSign />}
          {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MdFastfood className="inline mr-2 text-orange-500" />
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.name
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="e.g., Chicken Karahi"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {nameValue.length}/50 characters
              </p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaRupeeSign className="inline mr-2 text-orange-500" />
                Price (PKR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₨</span>
                </div>
                <input
                  type="number"
                  step="1"
                  {...register('price', { valueAsNumber: true })}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 ${
                    errors.price
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-orange-500'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
              {price > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {formatPrice(price)} (excluding tax)
                </p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaPercent className="inline mr-2 text-orange-500" />
                Discount (%){' '}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                {...register('discount', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0"
              />
              {errors.discount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discount.message}
                </p>
              )}

              {hasDiscount && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    Price Breakdown:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="line-through text-gray-500">
                        {formatPrice(price)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">
                        Discount ({discount}%):
                      </span>
                      <span className="text-red-600">
                        - {formatPrice(price - discountedPrice)}
                      </span>
                    </p>
                    <p className="flex justify-between pt-2 border-t border-green-200">
                      <span className="font-semibold text-green-800">
                        Discounted Price:
                      </span>
                      <span className="font-bold text-green-800 text-lg">
                        {formatPrice(discountedPrice)}
                      </span>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Customer saves {formatPrice(savings)} ({discount}% off)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Category - Custom Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MdCategory className="inline mr-2 text-orange-500" />
                Category <span className="text-red-500">*</span>
              </label>

              {/* Hidden input for react-hook-form */}
              <input type="hidden" {...register('category')} />

              <CustomCategorySelect
                value={selectedCategory}
                onChange={(category) => setValue('category', category)}
                error={errors.category}
              />

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}

              {/* Selected category info */}
              {selectedCategory && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>✨</span>
                  Selected:{' '}
                  <span className="font-medium text-orange-600">
                    {selectedCategory}
                  </span>
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaInfoCircle className="inline mr-2 text-orange-500" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows="3"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 ${
                  errors.description
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                placeholder="Describe your dish, ingredients, and serving size..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {descriptionValue.length}/500 characters
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaCloudUploadAlt className="inline mr-2 text-orange-500" />
                Item Image
              </label>
              <div className="flex items-start gap-4">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                    {imagePreview || editData?.picture ? (
                      <img
                        src={imagePreview || editData?.picture}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <MdFastfood className="text-3xl text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  {(imagePreview || editData?.picture) && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
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
                    id="item-image-upload"
                  />
                  <label
                    htmlFor="item-image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    <FaCloudUploadAlt /> Choose Image
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Max size: 5MB | Square recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleAvailability}
                className="focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full"
              >
                <div
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                    isAvailable ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 top-1 ${
                      isAvailable ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </div>
              </button>
              <div>
                <span className="text-base font-semibold text-gray-800">
                  Item Availability
                </span>
                <p className="text-sm text-gray-500">
                  {isAvailable
                    ? 'Item is visible to customers'
                    : 'Item is hidden from customers'}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                isAvailable
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isAvailable ? (
                <FaCheckCircle className="inline mr-1" />
              ) : (
                <FaTimesCircle className="inline mr-1" />
              )}
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <input type="hidden" {...register('isAvailable')} />
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative px-8 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 font-medium shadow-md overflow-hidden min-w-[180px]"
          >
            {isSubmitting ? (
              <div className="relative z-10 flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <span className="relative z-10">
                {isEditing ? 'Update Item' : 'Add Item'}
              </span>
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700 flex items-center gap-2">
            <FaInfoCircle />
            <span>
              💡 Tip: Adding attractive images and competitive prices can
              increase sales by up to 40%
            </span>
          </p>
        </div>
      </form>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SellerItemForm;
