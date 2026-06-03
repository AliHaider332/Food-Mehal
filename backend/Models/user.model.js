import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'delivery-boy'],
      default: 'customer',
    },
    picture: {
      type: String,
      default: null,
    },

    // GeoJSON location
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
      // Optional: human-readable address
    },
    userSetAddress: {
      type: Boolean,
      default: false,
    },
    orderCarried: { type: Boolean, default: false },
    address: { type: String, default: null },
    googleId: { type: String },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    otp: { type: Number, default: null },
    otpExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
userSchema.index({ location: '2dsphere' });

export const user = mongoose.model('user', userSchema);
