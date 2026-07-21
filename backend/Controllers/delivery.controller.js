import { getSocketId, io } from '../Config/socket.js';
import { order } from '../Models/order.model.js';
import { review } from '../Models/review.model.js';
import { shop } from '../Models/shop.model.js';
import { user } from '../Models/user.model.js';
import { asyncHandler } from '../Services/asyncHandler.js';
import CustomError from '../Services/CustomError.js';
import { getAddressFromCoords } from '../utils/reverseGeocode.js';
export const getOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const orderStatus = ['delivery-accepted', 'picked'];
  const liveOrder = await order
    .findOne({
      deliveryBoy: user._id,
      status: { $in: orderStatus },
    })
    .populate('shop');
  if (liveOrder) {
    return res.status(200).json({
      success: true,
      message: 'Data fetch successfully',
      order: liveOrder,
      live: true,
    });
  }
  const [lng, lat] = user.location.coordinates;
  const nearShops = await shop.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: 30 * 1000,
      },
    },
  });
  const ids = nearShops.map((s) => s._id);

  const myOrders = await order
    .find({ shop: { $in: ids }, status: 'packed' })
    .populate('shop');
  res.status(200).json({
    success: true,
    message: 'Data fetch successfully',
    order: myOrders,
    live: false,
  });
});
export const acceptOrder = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  const { id } = req.params;
  if (!id) {
    throw new CustomError(400, 'Data is missing');
  }
  const Order = await order
    .findById(id)
    .populate('shop')
    .populate('deliveryBoy');
  if (!Order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  Order.status = 'delivery-accepted';
  Order.deliveryBoy = loggedInUser._id;
  await Order.save();
  const User = await user.findByIdAndUpdate(
    loggedInUser._id,
    { $set: { orderCarried: true } },
    { new: true }
  );
  if (!User) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  const customerSocketId = getSocketId(Order.user.toString());
  const sellerSocketId = getSocketId(Order.shop.owner.toString());
  if (customerSocketId) {
    io.to(customerSocketId).emit('update-customer-order', {
      order: Order,
    });
  }
  if (sellerSocketId) {
    io.to(sellerSocketId).emit('update-seller-order', {
      status:"accept",
      order: Order,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Order successfully accepted',
    order: Order,
  });
});
export const updateStatus = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  const { id, status } = req.params;
  if (!id || !status) {
    throw new CustomError(400, 'Data is missing');
  }
  const Order = await order
    .findByIdAndUpdate(
      id,
      {
        $set: {
          status: status,
          deliveryBoy: loggedInUser._id,
        },
      },
      { new: true }
    )
    .populate('shop')
    .populate('deliveryBoy');

  if (!Order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }
  if (status === 'delivered') {
    const User = await user.findByIdAndUpdate(
      loggedInUser._id,
      {
        $set: {
          orderCarried: false,
        },
      },
      { new: true }
    );
    if (!User) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  }
  const customerSocketId = getSocketId(Order.user.toString());
  const sellerSocketId = getSocketId(Order.shop.owner.toString());
  if (customerSocketId) {
    io.to(customerSocketId).emit('update-customer-order', {
      order: Order,
    });
  }
  if (sellerSocketId) {
    io.to(sellerSocketId).emit('update-seller-order', {
      status,
      order: Order,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Order successfully accepted',
    order: Order,
  });
});
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, reason } = req.body;
  if (!role || !reason) {
    throw new CustomError(400, 'Data is missing');
  } // IMPORTANT: Add { new: true } to return the updated document
  const updatedOrder = await order
    .findByIdAndUpdate(
      id,
      {
        status: 'cancelled',
        cancelOrder: {
          role: role,
          note: reason,
          cancelledAt: new Date(),
        },
      },
      { new: true } // This returns the updated order instead of the old one
    )
    .populate('deliveryBoy')
    .populate('reviews')
    .populate('shop');

  // Check if order exists
  if (!updatedOrder) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }
  let socketId;
  if (role === 'seller') {
    socketId = getSocketId(updatedOrder.user.toString());
  } else if (role === 'customer') {
    socketId = getSocketId(updatedOrder.shop.owner.toString());
  }
  if (socketId && role === 'seller') {
    io.to(socketId).emit('update-customer-order', {
      order: updatedOrder,
    });
  } else if (socketId && role === 'customer') {
    io.to(socketId).emit('update-seller-order', {
      status: 'cancel',
      order: updatedOrder,
    });
  }
  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully', // Fixed message text
    order: updatedOrder,
  });
});
export const reviewOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { orderId } = req.params;
  const { rating, comment, shopId } = req.body;
  if (!orderId || !rating || !comment || !shopId) {
    throw new CustomError(400, 'Data is missing');
  }
  const userReview = await review.create({
    user: user._id,
    shop: shopId,
    order: orderId,
    rating: Number(rating),
    comment,
  });
  await shop.findByIdAndUpdate(
    shopId,
    {
      $push: {
        reviews: userReview._id,
      },
    },
    { new: true }
  );
  const updatedOrder = await order
    .findByIdAndUpdate(
      orderId,
      {
        $push: {
          reviews: userReview._id,
        },
      },
      { new: true }
    )
    .populate('shop')
    .populate('deliveryBoy')
    .populate('reviews');
  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully', // Fixed message text
  });
});
export const getDeliveredOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const orderHistory = await order
    .find({
      deliveryBoy: user._id,
      status: 'delivered',
    })
    .populate('shop');
  res.status(200).json({
    success: true,
    message: 'Data fetch successfully',
    order: orderHistory,
  });
});
