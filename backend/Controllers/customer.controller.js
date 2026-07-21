import { shop } from '../Models/shop.model.js';
import { item } from '../Models/item.model.js';
import { asyncHandler } from '../Services/asyncHandler.js';
import { order } from '../Models/order.model.js';
import CustomError from '../Services/CustomError.js';
import { getSocketId, io } from '../Config/socket.js';
import { user } from '../Models/user.model.js';
import { createOrderRelations, getRecommendedItems } from '../Services/Neo4jNodeCreation.js';

export const getCustomerFrontShop = asyncHandler(async (req, res) => {
  const user = req.user;

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

  res.status(200).json({
    success: true,
    shops: requiredShops,
  });
});

export const getCustomerFrontItems = asyncHandler(async (req, res) => {
  const user = req.user;

  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 3;

  const [lng, lat] = user.location.coordinates;

  // Cart item ids
  const cartItems = user.cart.map((item) => item.item.toString());

  // Favorites + Cart
  const metaItemData = [...user.favorite.map((id) => id.toString()), ...cartItems];

  // Remove duplicates
  const uniqueMetaItemData = [...new Set(metaItemData)];

  // Get recommendations
  const recommendedItemsId = await getRecommendedItems(uniqueMetaItemData);

  // Nearby shops
  const requiredShops = await shop
    .find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: 30 * 1000,
        },
      },
    })
    .populate('reviews');

  const shopIds = requiredShops.map((s) => s._id);

  // Recommended items first
  const recommendedItems = await item
    .find({
      _id: { $in: recommendedItemsId },
      shop: { $in: shopIds },
    })
    .populate({
      path: 'shop',
      populate: { path: 'reviews' },
    });

  // Exclude recommended ids from normal items
  const recommendedSet = new Set(recommendedItems.map((i) => i._id.toString()));

  const normalItems = await item
    .find({
      shop: { $in: shopIds },
      _id: {
        $nin: [...recommendedSet],
      },
    })
    .populate({
      path: 'shop',
      populate: { path: 'reviews' },
    });

  // Merge with recommendations first
  const mergedItems = [...recommendedItems, ...normalItems];

  const totalItems = mergedItems.length;

  // Apply pagination after merge
  const paginatedItems = mergedItems.slice(offset, offset + limit);

  const nextOffset = offset + limit;
  const hasMore = nextOffset < totalItems && nextOffset < 9;

  res.status(200).json({
    success: true,
    items: paginatedItems,
    total: totalItems,
    hasMore,
    nextOffset,
  });
});

export const getSearchItems = asyncHandler(async (req, res) => {
  const { queryText } = req.body;

  const items = await item
    .find({
      $text: { $search: queryText },
      isAvailable: true,
    })
    .sort({
      score: { $meta: 'textScore' },
    })
    .select({ score: { $meta: 'textScore' } });

  res.status(200).json({
    success: true,
    count: items.length,
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

// Get single item (keep this simple)
export const getSingleItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Item ID is required',
    });
  }

  const data = await item.findById(id).populate({
    path: 'shop',
    populate: {
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name email avatar',
      },
    },
  });

  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Item fetched successfully',
    data: data,
  });
});

// Get recommendations based on an item
export const getRecommendations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit) || 10;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Item ID is required',
    });
  }

  const currentItem = await item.findById(id);

  if (!currentItem) {
    return res.status(404).json({
      success: false,
      message: 'Item not found',
    });
  }

  const recommendations = [];
  const addedIds = new Set([id]);

  // 1. Same shop items
  const sameShopItems = await item
    .find({
      shop: currentItem.shop,
      isAvailable: true,
      _id: { $ne: id },
    })
    .populate({
      path: 'shop',
      populate: {
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
      },
    })
    .sort({ soldCount: -1 })
    .limit(limit);

  sameShopItems.forEach((i) => {
    recommendations.push(i);
    addedIds.add(i._id.toString());
  });

  // 2. Similar price range
  if (recommendations.length < limit) {
    const remaining = limit - recommendations.length;

    const minPrice = currentItem.price * 0.8;
    const maxPrice = currentItem.price * 1.2;

    const similarPriceItems = await item
      .find({
        isAvailable: true,
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
        _id: {
          $nin: [...addedIds],
        },
      })
      .populate({
        path: 'shop',
        populate: {
          path: 'reviews',
          populate: {
            path: 'user',
            select: 'name email avatar',
          },
        },
      })
      .sort({ soldCount: -1 })
      .limit(remaining);

    similarPriceItems.forEach((i) => {
      recommendations.push(i);
      addedIds.add(i._id.toString());
    });
  }

  // 3. Popular items fallback
  if (recommendations.length < limit) {
    const remaining = limit - recommendations.length;

    const popularItems = await item
      .find({
        isAvailable: true,
        _id: {
          $nin: [...addedIds],
        },
      })
      .populate({
        path: 'shop',
        populate: {
          path: 'reviews',
          populate: {
            path: 'user',
            select: 'name email avatar',
          },
        },
      })
      .sort({
        soldCount: -1,
        rating: -1,
      })
      .limit(remaining);

    recommendations.push(...popularItems);
  }

  res.status(200).json({
    success: true,
    message: 'Recommendations fetched successfully',
    data: recommendations,
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

export const operateCart = asyncHandler(async (req, res) => {
  const { item: itemId, operation = 'increment' } = req.body;

  if (!itemId && operation !== 'clear') {
    return res.status(400).json({
      success: false,
      message: 'itemId is required',
    });
  }

  const user = req.user;

  // Clear entire cart
  if (operation === 'clear') {
    user.cart = [];

    await user.save();

    return res.status(200).json({
      success: true,
      cart: user.cart,
    });
  }

  const index = user.cart.findIndex((cartItem) => cartItem.item.toString() === itemId);

  switch (operation) {
    case 'remove':
      if (index > -1) {
        user.cart.splice(index, 1);
      }
      break;

    case 'increment':
      if (index > -1) {
        user.cart[index].quantity += 1;
      } else {
        user.cart.push({
          item: itemId,
          quantity: 1,
        });
      }
      break;

    case 'decrement':
      if (index > -1) {
        if (user.cart[index].quantity > 1) {
          user.cart[index].quantity -= 1;
        } else {
          user.cart.splice(index, 1);
        }
      }
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid operation',
      });
  }

  await user.save();

  return res.status(200).json({
    success: true,
    cart: user.cart,
  });
});

export const getCartItems = asyncHandler(async (req, res) => {
  const userData = req.user;

  const currentUser = await user.findById(userData._id).populate({
    path: 'cart.item',
    populate: {
      path: 'shop',
      populate: {
        path: 'reviews',
      },
    },
  });

  res.status(200).json({
    success: true,
    data: currentUser.cart,
  });
});

export const addToFavorite = asyncHandler(async (req, res) => {
  const { item: itemId } = req.body;
  const user = req.user;

  const index = user.favorite.findIndex((id) => id.toString() === itemId);

  if (index > -1) {
    user.favorite.splice(index, 1);
  } else {
    user.favorite.push(itemId);
  }

  await user.save();

  res.status(200).json({
    success: true,
  });
});

export const getFavorite = asyncHandler(async (req, res) => {
  const userData = req.user;

  const currentUser = await user.findById(userData._id).populate({
    path: 'favorite',
    populate: {
      path: 'shop',
      populate: {
        path: 'reviews',
      },
    },
  });

  res.status(200).json({
    success: true,
    data: currentUser.favorite,
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

export const orderItems = asyncHandler(async (req, res) => {
  const { shop: shopId, items, status, deliveryLocation, totalSavings, totalAmount } = req.body;

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

  await createOrderRelations({
    userId: user._id.toString(),
    itemIds: items.map((item) => item.item.toString()), // adjust field name
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
