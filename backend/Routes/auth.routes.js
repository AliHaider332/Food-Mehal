import express from 'express';
import {
  checkUserAuthorization,
  signupValidation,
  updateProfileValidation,
} from '../Middlewares/auth.validation.middleware.js';
import {
  forgotPassword,
  getUser,
  googleAuth,
  logoutUser,
  resetPassword,
  setLocation,
  signinController,
  signupController,
  updateProfile,
  verifyOTP,
} from '../Controllers/auth.controller.js';
import { upload } from '../Config/Cloudinary.js';
const router = express.Router();

router.post('/signup', signupValidation, signupController);
router.post('/signin', signinController);
router.post('/google-auth', googleAuth);
router.get('/get-user/:lng/:lat', getUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.put(
  '/update-profile',
  upload.single('picture'),
  checkUserAuthorization('general'),
  updateProfileValidation,
  updateProfile
);
router.get('/logout', logoutUser);
router.post('/set-location', checkUserAuthorization('general'), setLocation);
export default router;
