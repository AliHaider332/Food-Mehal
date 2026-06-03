import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    comment: {
      type: String, // optional custom message
    },
  },
  { timestamps: true }
);

export const review = mongoose.model('review', reviewSchema);
