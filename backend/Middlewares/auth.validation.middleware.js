// schemas/userSchema.js
import { z, ZodError } from 'zod';
import CustomError from '../Services/CustomError.js';
import { verifyToken } from '../Services/JWT.js';
import { user } from '../Models/user.model.js';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'seller', 'delivery-boy']).optional(),
  location: z.object({
    type: z.literal('Point'), // GeoJSON type
    coordinates: z
      .array(z.number())
      .length(2, 'Coordinates must be [longitude, latitude]'),
  }),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  address: z.string().min(3).optional(),
  location: z.object({
    type: z.literal('Point'), // GeoJSON type
    coordinates: z
      .array(z.number())
      .length(2, 'Coordinates must be [longitude, latitude]'),
  }),
});
// controllers/userController.js

export const signupValidation = (req, res, next) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return next(
      new CustomError(400, result.error.issues[0].message, result.error.issues)
    );
  }
  req.user = result.data; // ✅ correct
  next();
};

export const checkUserAuthorization = (role) => {
  return async (req, res, next) => {
    try {
      const { uid } = req.cookies;
      if (!uid) {
        throw new CustomError(401, 'Token not found');
      }

      // Verify token
      const decoded = verifyToken(uid);

      if (!decoded?.id) {
        throw new CustomError(401, 'Invalid token');
      }

      // Fetch user from DB
      const requireUser = await user.findById(decoded.id); // Exclude password
      if (!requireUser) {
        throw new CustomError(404, 'User not found');
      }
      if (role != 'general' && requireUser.role != role) {
        throw new CustomError(404, 'Unauthorized user');
      }
      req.user = requireUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const updateProfileValidation = (req, res, next) => {
  if (req.body.location) {
    req.body.location = JSON.parse(req.body.location);
  }

  const result = updateProfileSchema.safeParse(req.body);
  if (!result.success) {
    return next(
      new CustomError(400, result.error.issues[0].message, result.error.issues)
    );
  }
  req.data = result.data; // ✅ correct
  next();
};
