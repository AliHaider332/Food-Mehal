// models/Shop.js
import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    phone: {
      type: String,
      required: true,

      trim: true,
    },

    description: {
      type: String,
    },

    picture: {
      type: String,
      default: null,
    },

  

    location: {
      type: {
        type: String,
        enum: ['Point'], // 'Point' for single coordinates
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      address: {
        type: String,
        default: '',
      },
    },

    // New fields from your form
    cuisines: {
      type: [String],
      default: [],
      required: true,
    },

    deliveryTime: {
      min: {
        type: Number,
        default: 25,
      },
      max: {
        type: Number,
        default: 45,
      },
    },

    minOrderAmount: {
      type: Number,
      default: 100,
    },

    deliveryFee: {
      type: Number,
      default: 200,
      min: 0,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for location-based queries
shopSchema.index({ location: '2dsphere' });

// Create index for owner queries
shopSchema.index({ owner: 1 });

// Create index for name search
shopSchema.index({ name: 'text' });

export const shop = mongoose.model('Shop', shopSchema);
