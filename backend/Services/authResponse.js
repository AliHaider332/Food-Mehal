import { ENV } from "./env.js";
import { generateToken } from "./JWT.js";

export const sendAuthResponse = async (res, authUser, message, statusCode = 200) => {
  const token = generateToken(authUser._id.toString());

  res.cookie('uid', token, {
    httpOnly: true,
    secure: ENV.NODE_MODE === 'PRODUCTION',
    sameSite: 'strict',
    maxAge: Number(ENV.COOKIE_EXPIRE_IN),
  });

  const userResponse = {
    _id: authUser._id,
    name: authUser.name,
    email: authUser.email,
    phone: authUser.phone,
    role: authUser.role,
    picture: authUser.picture,
    location: authUser.location,
    address: authUser.address,
    createdAt: authUser.createdAt,
  };
  if (authUser.role === 'customer') {
    userResponse.cart = authUser.cart || [];
    userResponse.favorite = authUser.favorite || [];
  }

  return res.status(statusCode).json({
    success: true,
    message,
    data: userResponse,
  });
};