import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    name: { type: String, required: true },

    price: { type: Number, required: true },

    picture: { type: String },

    description: { type: String },
    discount: { type: Number, default: 0 },
    category: {
      type: String,
      enum: [
        'Pizza',
        'Burgers',
        'Sushi',
        'Pasta',
        'Salads',
        'Desserts',
        'Beverages',
        'Appetizers',
        'Main Course',
        'Street Food',
        'BBQ',
        'Seafood',
        'Breakfast',
        'Fast Food',
      ],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const item = mongoose.model('Item', itemSchema);
