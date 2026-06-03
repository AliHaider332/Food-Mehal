import { z } from 'zod';

// Main shop schema matching backend
const shopSchema = z.object({
  name: z
    .string()
    .min(2, 'Shop name must be at least 2 characters')
    .max(50, 'Shop name too long'),

  description: z
    .string()
    .min(10, 'Please provide a description')
    .max(500, 'Description too long'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number too long')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),

  picture: z.string().url().optional().nullable(),

  location: z.object({
    type: z.literal('Point'), // GeoJSON type
    coordinates: z
      .array(z.number())
      .length(2, 'Coordinates must be [longitude, latitude]'),
    address: z.string(),
  }),

  cuisines: z.array(z.string()).min(1).optional(),

  deliveryTime: z
    .object({
      min: z.coerce.number().min(10),
      max: z.coerce.number().max(120),
    })
    .optional(),

  minOrderAmount: z.coerce
    .number()
    .min(5, 'Minimum order amount must be at least $5')
    .default(10),

  deliveryFee: z.coerce
    .number()
    .min(0, 'Delivery fee cannot be negative')
    .default(2.99),

  isOpen: z.coerce.boolean().default(true),

  isActive: z.coerce.boolean().default(true),
  address: z.string().optional(),
});

const itemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),

  price: z.number().positive('Price must be greater than 0'),

  description: z.string().max(500, 'Description is too long').optional(),
  discount: z.number().min(0, 'Discount should greater then 0'),
  category: z.enum([
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
  ]),

  isAvailable: z.enum(['true', 'false']).optional(),
});
export const shopDataValidation = async (req, res, next) => {
  try {
    

    if (req.body.location && typeof req.body.location === 'string') {
      req.body.location = JSON.parse(req.body.location);
    }

    if (req.body.cuisines && typeof req.body.cuisines === 'string') {
      req.body.cuisines = JSON.parse(req.body.cuisines);
    }

    if (req.body.deliveryTime && typeof req.body.deliveryTime === 'string') {
      req.body.deliveryTime = JSON.parse(req.body.deliveryTime);
    }

    if (req.body.isOpen && typeof req.body.isOpen === 'string') {
      if (req.body.isOpen === 'false') {
        req.body.isOpen = false;
      } else {
        req.body.isOpen = true;
      }
    }

    const validatedData = shopSchema.parse(req.body);

    req.data = validatedData;

    next();
  } catch (error) {
    next(error);
  }
};
export const itemDataValidation = async (req, res, next) => {
  try {
    if (req.body.price) {
      req.body.price = Number(req.body.price);
    }
    if (req.body.discount) {
      req.body.discount = Number(req.body.discount);
    }
    const validatedData = itemSchema.parse(req.body);
    req.data = validatedData;
    next();
  } catch (error) {
    next(error);
  }
};
