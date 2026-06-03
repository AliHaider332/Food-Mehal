import { asyncHandler } from '../Services/asyncHandler.js';
import { user } from '../Models/user.model.js';
import CustomError from '../Services/CustomError.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../Services/JWT.js';
import { oauth2Client } from '../Config/GoogleAuth.js';
import { ENV } from '../Services/env.js';
import { sendOTP } from '../Config/NodeMailer.js';
import axios from 'axios';

import { getAddressFromCoords } from '../utils/reverseGeocode.js';
import { sendAuthResponse } from '../Services/authResponse.js';

export const signupController = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, location } = req.body;

  const userExist = await user.findOne({ email });

  if (userExist) {
    throw new CustomError(400, 'Email already registered');
  }

  const phoneExist = await user.findOne({ phone });

  if (phoneExist) {
    throw new CustomError(400, 'Phone number already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let address = '';

  const [lng, lat] = location.coordinates;

  if (lng && lat) {
    address = await getAddressFromCoords(lng, lat);
  }

  const newUser = await user.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
    location: {
      type: 'Point',
      coordinates: [lng, lat],
      address,
    },
  });

  return sendAuthResponse(res, newUser, 'Signup successful', 201);
});

export const signinController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError(400, 'All fields are required');
  }

  const registeredUser = await user.findOne({ email });

  if (!registeredUser) {
    throw new CustomError(400, 'User is not registered');
  }

  const checkPassword = await bcrypt.compare(password, registeredUser.password);

  if (!checkPassword) {
    throw new CustomError(400, 'Password does not match');
  }

  return sendAuthResponse(res, registeredUser, 'Login successfully');
});
export const googleAuth = asyncHandler(async (req, res) => {
  const code = req.query.code;
  const { phone, role, location } = req.body;

  if (!code) {
    throw new CustomError(400, 'Authorization code is required');
  }

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
  );

  const { name, email, id } = data;

  // LOGIN CASE
  let existingUser = await user.findOne({ email });

  if (existingUser) {
    return sendAuthResponse(res, existingUser, 'Login successful');
  }

  if (!role || !phone) {
    throw new CustomError(
      400,
      'Register user with phone number and role first'
    );
  }

  if (!location) {
    throw new CustomError(400, 'Location is required');
  }

  const [lng, lat] = location.coordinates;

  let address = '';

  if (lng && lat) {
    address = await getAddressFromCoords(lng, lat);
  }

  const finalLocation = {
    type: 'Point',
    coordinates: [lng, lat],
    address,
  };

  // SIGNUP CASE
  const newUser = await user.create({
    name,
    email,
    googleId: id,
    isVerified: true,
    phone,
    role,
    location: finalLocation,
  });

  return sendAuthResponse(res, newUser, 'Signup successful', 201);
});

export const getUser = asyncHandler(async (req, res) => {
  const { uid } = req.cookies;
  const { lat, lng } = req.params;
  if (!lat || !lng) {
    throw new CustomError(400, 'Location is necessary');
  }
  if (!uid) {
    throw new CustomError(401, 'LogIn yourself again');
  }
  const decoded = verifyToken(uid);

  if (!decoded?.id) {
    throw new CustomError(401, 'LogIn yourself again');
  }

  const requireUser = await user.findById(decoded.id).select('-password');

  if (!requireUser) {
    res.status(404).json({
      success: false,
      message: 'User not registered',
    });
  }
  let finalLocation = requireUser.location;
  let address = await getAddressFromCoords(lng, lat);
  finalLocation = {
    type: 'Point',
    coordinates: [lng, lat],
    address,
  };
  if (requireUser.userSetAddress) {
    requireUser.location.coordinates = finalLocation.coordinates;
  } else {
    requireUser.location = finalLocation;
  }

  await requireUser.save();
  return sendAuthResponse(res, requireUser, 'Successfully user fetched', 201);
});
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError(400, 'All fields are require');
  }

  const requireUser = await user.findOne({ email });
  if (!requireUser) {
    throw new CustomError(400, 'User is not register');
  }
  // 🔹 Generate raw token
  const OTP = Math.floor(100000 + Math.random() * 900000);

  requireUser.otp = OTP;
  requireUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await requireUser.save();
  await sendOTP(requireUser.name.split(' ')[0], email, OTP);
  res.status(200).json({
    success: true,
    message: 'Reset OTP sent to email',
  });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new CustomError(400, 'All fields are require');
  }
  const requireUser = await user.findOne({ email });
  if (!requireUser) {
    throw new CustomError(400, 'User is not register');
  }
  if (!requireUser.otp) {
    return res.status(400).json({
      success: false,
      message: 'Generate an OTP',
    });
  }
  if (!requireUser.otpExpiry || requireUser.otpExpiry < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'OTP has expired',
    });
  }

  if (!requireUser.otp || requireUser.otp.toString() != otp.toString()) {
    return res.status(400).json({
      success: false,
      message: 'OTP not match',
    });
  }
  requireUser.otp = null;
  requireUser.otpExpiry = null;
  await requireUser.save();
  res.status(200).json({
    success: true,
    message: 'Ready to update Password',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const requireUser = await user.findOne({ email });
  if (!requireUser) {
    return res.status(400).json({
      success: false,
      message: 'Email is invalid',
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  requireUser.password = hashedPassword;
  await requireUser.save();

  return sendAuthResponse(res, requireUser, 'Password Reset successfully', 201);
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('uid', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const picture = req.file?.path;
  const { name, email, phone, address, location } = req.data;
  const id = req.user._id;
  if (address) {
    location.address = address;
  }
  const updateData = {
    name,
    email,
    phone,
    location,
    userSetAddress: true,
  };

  // if picture uploaded add it
  if (picture) {
    updateData.picture = picture;
  }

  const updatedUser = await user.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  const userResponse = {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    picture: updatedUser.picture,
    location: updatedUser.location,
    address: updatedUser.address,
    createdAt: updatedUser.createdAt,
  };
  res.status(200).json({
    success: true,
    message: 'Update Profile successfully',
    data: userResponse,
  });
});

export const setLocation = asyncHandler(async (req, res) => {
  const User = req.user;
  const { location } = req.body;
  if (!location) {
    throw new CustomError(400, 'Location is necessary');
  }
  const registeredUser = await user.findById(User._id);
  if (!registeredUser) {
    throw new CustomError(400, 'User is not registered');
  }
  let finalLocation = registeredUser.location;
  if (location?.coordinates?.length === 2) {
    const [lng, lat] = location.coordinates;
    let address = await getAddressFromCoords(lng, lat);
    finalLocation = {
      type: 'Point',
      coordinates: [lng, lat],
      address,
    };

    if (registeredUser.userSetAddress) {
      registeredUser.location.coordinates = finalLocation.coordinates;
    } else {
      registeredUser.location = finalLocation;
    }

    await registeredUser.save();
  }
  console.log('Hi I am called');
  const userResponse = {
    _id: registeredUser._id,
    name: registeredUser.name,
    email: registeredUser.email,
    phone: registeredUser.phone,
    role: registeredUser.role,
    picture: registeredUser.picture,
    location: registeredUser.location,
    address: registeredUser.address,
    createdAt: registeredUser.createdAt,
  };

  res.status(200).json({
    success: true,
    message: 'User Location updated successfully',
    data: userResponse,
  });
});
