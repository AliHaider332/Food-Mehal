import { shop } from '../Models/shop.model.js';
import { item } from '../Models/item.model.js';
import { asyncHandler } from '../Services/asyncHandler.js';
import { order } from '../Models/order.model.js';
import CustomError from '../Services/CustomError.js';
import { getSocketId, io } from '../Config/socket.js';

export const getUserData = asyncHandler(async (req, res) => {
  const user = req.user;
  const { favorite, cart, clicked } = req.body;

  const [lng, lat] = user.location.coordinates;

  // 🔹 Nearby shops
  const requiredShops = await shop
    .find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 30 * 1000,
        },
      },
    })
    .populate('reviews');

  const shopIds = requiredShops.map((s) => s._id);

  // 🔥 Smart filtering logic
  const items = await item
    .find({
      shop: { $in: shopIds },
      // _id: { $nin: [...clicked] }, // ❌ avoid already clicked
    })
    .populate({
      path: 'shop',
      populate: { path: 'reviews' },
    })
    .limit(3);

  res.status(200).json({
    success: true,
    shops: requiredShops,
    items,
  });
});

export const getMoreItems = asyncHandler(async (req, res) => {
  const user = req.user;
  const { favorite, cart, clicked } = req.body;

  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;

  const [lng, lat] = user.location.coordinates;

  const requiredShops = await shop.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: 30 * 1000,
      },
    },
  });

  const shopIds = requiredShops.map((s) => s._id);

  const query = {
    shop: { $in: shopIds },
    // _id: { $nin: [...clicked] }, // optional filter
  };

  // 🔢 total count
  const totalItems = await item.countDocuments(query);

  // 📦 paginated data
  const items = await item
    .find(query)
    .populate({
      path: 'shop',
      populate: { path: 'reviews' },
    })
    .skip(skip)
    .limit(limit);

  // ➕ remaining items
  const remaining = Math.max(totalItems - (skip + items.length), 0);

  res.status(200).json({
    success: true,
    totalItems,
    remaining,
    items,
  });
});

export const getUserDataByID = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({
      success: false,
      message: 'Favorites must be an array of item IDs',
    });
  }

  // 🔍 FIND ALL FAVORITE ITEMS
  const Items = await item
    .find({
      _id: { $in: ids },
    })
    .populate({
      path: 'shop',
      populate: {
        path: 'reviews',
      },
    });

  res.status(200).json({
    success: true,
    message: 'Favorite items fetched successfully',
    items: Items,
  });
});
export const getSingleItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Validate ID
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Item ID is required',
    });
  }

  // Find item
  const data = await item.findById(id).populate({
    path: 'shop',
    populate: {
      path: 'reviews',
      populate: {
        path: 'user',
      },
    },
  });
  const recommended = await item
    .find()
    .populate({
      path: 'shop',
      populate: {
        path: 'reviews',
      },
    })
    .limit(10);
  // Check if item exists
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }

  // Success response
  res.status(200).json({
    success: true,
    message: 'Item fetched successfully',
    item: data,
    recommended,
  });
});

export const getAllItem = asyncHandler(async (req, res) => {
  // Find item
  const data = await item.find().populate({
    path: 'shop',
    populate: {
      path: 'reviews',
    },
  });

  // Success response
  res.status(200).json({
    success: true,
    message: 'Item fetched successfully',
    items: data,
  });
});

export const getSingleShop = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Item ID is required',
    });
  }

  // Find item
  const data = await shop.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'user',
    },
  });

  // Check if item exists
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }

  const items = await item.find({ shop: id }).populate({
    path: 'shop',
    populate: {
      path: 'reviews',
    },
  });
  // Success response
  res.status(200).json({
    success: true,
    message: 'Item fetched successfully',
    shop: data,
    items,
  });
});

export const orderItems = asyncHandler(async (req, res) => {
  const {
    shop: shopId,
    items,
    status,
    deliveryLocation,
    totalSavings,
    totalAmount,
  } = req.body;

  if (
    !shopId ||
    !items?.length ||
    !status ||
    !deliveryLocation ||
    totalSavings == null ||
    totalAmount == null
  ) {
    throw new CustomError(400, 'Data is missing');
  }

  const user = req.user;

  const shopData = await shop.findById(shopId);
  if (!shopData) {
    throw new CustomError(404, 'Shop not found');
  }

  // Create order
  const newOrder = await order.create({
    user: user._id,
    shop: shopId,
    items,
    status,
    deliveryLocation,
    totalSavings,
    totalAmount,
  });

  // Proper populate
  const myOrder = await order
    .findById(newOrder._id)
    .populate('deliveryBoy')
    .populate('reviews')
    .populate('shop');

  // Send real-time notification
  const socketId = getSocketId(myOrder.shop.owner);

  if (socketId) {
    console.log(socketId);

    io.to(socketId).emit('new-order', {
      message: 'You received a new order',
      order: myOrder,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Order placed successfully',
    order: myOrder,
  });
});
export const myOrders = asyncHandler(async (req, res) => {
  const user = req.user;

  const myOrder = await order
    .find({ user: user._id })
    .populate('shop')
    .populate('deliveryBoy')
    .populate('reviews');

  res.status(200).json({
    success: true,
    message: 'Orders fetched successfully',
    order: myOrder,
  });
});
