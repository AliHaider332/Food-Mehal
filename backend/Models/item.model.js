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
      ],
    },
    embedding: {
      type: [Number],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
itemSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
});
export const item = mongoose.model('Item', itemSchema);
