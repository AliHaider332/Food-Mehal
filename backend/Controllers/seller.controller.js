import { asyncHandler } from '../Services/asyncHandler.js';
import CustomError from '../Services/CustomError.js';
import { shop } from '../Models/shop.model.js';
import { item } from '../Models/item.model.js';
import { order } from '../Models/order.model.js';
import { getArraySocketId, getSocketId, io } from '../Config/socket.js';
import { user } from '../Models/user.model.js';
import { embedding } from '../Services/vectorEmbedder.js';
//Shop creation and update
export const createUpdateShop = asyncHandler(async (req, res) => {
  const { _id: ownerId } = req.user;
  const data = req.data;
  const picture = req.file?.path || data.picture;
  const existingShop = await shop.findOne({ owner: ownerId });

  let shopData = {
    ...data,
    owner: ownerId,
  };

  if (picture) {
    shopData.picture = picture;
  }
  // Handle nested merge
  if (existingShop && data.deliveryTime) {
    shopData.deliveryTime = {
      ...existingShop.deliveryTime.toObject(),
      ...data.deliveryTime,
    };
  }
  if (data.address) {
    shopData.location.address = data.address;
  }

  if (existingShop) {
    await shop.findOneAndUpdate({ owner: ownerId }, shopData, {
      new: true,
      runValidators: true,
    });
  } else {
    shopData = await shop.create(shopData);
  }

  res.status(existingShop ? 200 : 201).json({
    success: true,
  });
});

//get shop info
export const getShop = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const requiredShop = await shop.findOne({ owner: _id }).populate({
    path: 'reviews',
    populate: {
      path: 'user',
    },
  });
  if (!requiredShop) {
    res.status(203).json({
      success: false,
      message: 'Register your shop',
    });
  }
  const shopId = requiredShop._id;
  const totalOrders = await order.countDocuments({ shop: shopId });
  const totalItems = await item.countDocuments({ shop: shopId });
  const myOrder = await order
    .find({ shop: shopId })
    .populate('deliveryBoy')
    .populate('reviews')
    .limit(10);
  const shopResponse = {
    ...requiredShop.toObject(),
    totalOrders,
    totalItems,
  };

  res.status(200).json({
    success: true,
    message: 'Shop Successfully Updated',
    shop: shopResponse,
    order: myOrder,
  });
});

// Adding item on shop
export const createItem = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { name, price, description, category, isAvailable, discount } =
    req.data;

  const picture = req.file?.path;

  const requiredShop = await shop.findOne({ owner: _id });

  if (!requiredShop) {
    throw new CustomError('No shop registered', 404);
  }
  const textForEmbedding = `
  Name: ${name}
  Category: ${category}
  Description: ${description}
  `;
  const vector = await embedding(textForEmbedding);

  const newItem = await item.create({
    shop: requiredShop._id,
    name,
    price,
    description,
    category,
    picture,
    embedding: vector,
    isAvailable,
    discount,
  });


  res.status(201).json({
    success: true,
    message: 'Item successfully added',
  });
});
// Updating item
export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, isAvailable, discount } =
    req.data;
  const picture = req.file?.path;
  const requiredItem = await item.findOne({ _id: id });

  if (!requiredItem) {
    throw new CustomError('No related item is registered', 404);
  }
  requiredItem.name = name;
  requiredItem.price;
  requiredItem.description = description;
  requiredItem.category = category;
  requiredItem.isAvailable = isAvailable;
  requiredItem.price = price;

  requiredItem.discount = discount;

  if (picture) {
    requiredItem.picture = picture;
  }
  await requiredItem.save();

  res.status(201).json({
    success: true,
    message: 'Item successfully added',
  });
});

//Geting items
export const getItems = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const requiredShop = await shop.findOne({ owner: _id });

  if (!requiredShop) {
    throw new CustomError('No shop registered', 404);
  }

  const items = await item.find({ shop: requiredShop._id });

  res.status(200).json({
    success: true,
    items: items,
  });
});

// deleting items
export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError(400, 'Data missing');
  }
  const requiredItem = await item.findByIdAndDelete(id);

  if (!requiredItem) {
    throw new CustomError('No related item is registered', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Item successfully deleted',
  });
});

// Live Orders
export const getShopLiveOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const requiredShop = await shop.findOne({ owner: _id });
  if (!requiredShop) {
    return res.status(203).json({
      success: false,
      message: 'Register your shop',
    });
  }

  const shopId = requiredShop._id;
  const myOrder = await order
    .find({
      shop: shopId,
      status: { $nin: ['cancelled', 'delivered'] },
    })
    .populate('deliveryBoy')
    .populate('reviews')
    .sort({ createdAt: -1 }); // Sort by newest first

  res.status(200).json({
    success: true,
    message: 'Live orders fetched successfully',
    order: myOrder,
  });
});

// Cancelled Orders
export const getShopCancelledOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const requiredShop = await shop.findOne({ owner: _id });
  if (!requiredShop) {
    res.status(203).json({
      success: false,
      message: 'Register your shop',
    });
  }
  const shopId = requiredShop._id;
  const myOrder = await order
    .find({ shop: shopId, status: 'cancelled' })
    .populate('deliveryBoy')
    .populate('reviews')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Shop Successfully Updated',
    order: myOrder,
  });
});

// Successfully Delivered orders
export const getShopDeliveredOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const requiredShop = await shop.findOne({ owner: _id });
  if (!requiredShop) {
    res.status(203).json({
      success: false,
      message: 'Register your shop',
    });
  }
  const shopId = requiredShop._id;
  const myOrder = await order
    .find({ shop: shopId, status: 'delivered' })
    .populate('deliveryBoy')
    .populate('reviews')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Shop Successfully Updated',
    order: myOrder,
  });
});

// Updating Orders
export const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  if (!id || !status) {
    throw new CustomError(400, 'Data is missing');
  }

  const orderDoc = await order.findById(id).populate('shop');

  if (!orderDoc) {
    throw new CustomError(404, 'Order not found');
  }

  orderDoc.status = status;
  const updatedOrder = await orderDoc.save();
  // Notify customer
  const socketId = getSocketId(updatedOrder.user.toString());
  if (socketId) {
    io.to(socketId).emit('update-customer-order', {
      order: updatedOrder,
    });
  }

  if (updatedOrder.status === 'packed') {
    const [lng, lat] = updatedOrder?.shop.location.coordinates;

    const orderStatus = ['delivery-accepted', 'picked'];
    const nearShops = await user.find({
      status: { $nin: orderStatus },
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
    const socketIds = getArraySocketId(ids);
    if (socketIds) {
      io.to(socketIds).emit('new-order-to-deliver', {
        order: updatedOrder,
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    order: updatedOrder,
  });
});

// Shop analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const requiredShop = await shop.findOne({ owner: _id });
  if (!requiredShop) {
    res.status(203).json({
      success: false,
      message: 'Register your shop',
    });
  }
  const shopId = requiredShop._id;

  // 1. Total Items
  const totalItems = await item.countDocuments({ shop: shopId });

  // 2. Total Orders
  const totalOrders = await order.countDocuments({ shop: shopId });

  // 3. Total Revenue
  const revenueData = await order.aggregate([
    { $match: { shop: shopId, status: 'delivered' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // 4. Orders by Status
  const ordersByStatus = await order.aggregate([
    { $match: { shop: shopId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // 5. Top Selling Items
  const topItems = await order.aggregate([
    { $match: { shop: shopId, status: 'delivered' } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.item',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  // 6. Last 7 Days Sales
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);

  const rawLast7DaysSales = await order.aggregate([
    {
      $match: {
        shop: shopId,
        status: 'delivered',
        createdAt: { $gte: last7Days },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
      },
    },
  ]);

  // Format + Fill Missing Days
  const map = new Map();

  rawLast7DaysSales.forEach((d) => {
    const date = `${d._id.year}-${String(d._id.month).padStart(
      2,
      '0'
    )}-${String(d._id.day).padStart(2, '0')}`;
    map.set(date, {
      date,
      totalSales: d.totalSales,
      orders: d.orders,
    });
  });

  const last7DaysSales = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const dateStr = d.toISOString().split('T')[0];

    last7DaysSales.push(
      map.get(dateStr) || {
        date: dateStr,
        totalSales: 0,
        orders: 0,
      }
    );
  }

  // FINAL RESPONSE
  res.status(200).json({
    success: true,
    message: 'Analytics fetched successfully',
    data: {
      totalItems,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topItems,
      last7DaysSales,
    },
  });
});
