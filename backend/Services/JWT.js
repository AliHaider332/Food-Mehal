import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

const secret = ENV.JWT_SECRET;
const expiry_in = ENV.JWT_EXPIRE_IN;
export const generateToken = (id) => {
  return jwt.sign(
    { id }, // payload
    secret, // secret key
    { expiresIn: expiry_in } // options
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};
