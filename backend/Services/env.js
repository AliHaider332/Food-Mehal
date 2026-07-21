import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  MONGODB: process.env.MONGODB,
  CLIENT: process.env.CLIENT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_MODE: process.env.NODE_MODE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  COOKIE_EXPIRE_IN: process.env.COOKIE_EXPIRE_IN,
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
  NEO4J_URI: process.env.NEO4J_URI,
  NEO4J_USER: process.env.NEO4J_USER,
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
  
};
