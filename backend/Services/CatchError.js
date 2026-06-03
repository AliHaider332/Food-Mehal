import { ZodError } from 'zod';
import CustomError from './CustomError.js';

export const CatchError = (err, req, res, next) => {
  const status = err.status || 500;
  console.log(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues[0].message,
      errors: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // ✅ Custom error
  if (err instanceof CustomError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
