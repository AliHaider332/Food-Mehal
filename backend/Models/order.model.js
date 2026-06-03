import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
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

    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
        },
        name: String,
        price: Number,
        quantity: Number,
        total: Number,
        picture: String,
      },
    ],

    totalAmount: Number,
    totalSavings: Number,

    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'preparing',
        'packed',
        'delivery-accepted',
        'picked',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },

    cancelOrder: {
      type: {
        note: {
          type: String,
        },
        role: {
          type: String,
          enum: ['customer', 'seller', 'delivery-boy'],
        },
        cancelledAt: {
          type: Date,
        },
      },
      default: null,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review',
        required: true,
      },
    ],

    deliveryLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
    },
  },
  { timestamps: true }
);

export const order = mongoose.model('order', orderSchema);
