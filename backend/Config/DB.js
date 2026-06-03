import mongoose from 'mongoose';
import CustomError from '../Services/CustomError.js';
import { ENV } from '../Services/env.js';
export const setupDB = async () => {
  try {
    await mongoose.connect(ENV.MONGODB);
    console.log('Successfully DB connected');
  } catch (error) {
    console.log(error);

    throw new CustomError(500, 'Internal Server Error');
  }
};
