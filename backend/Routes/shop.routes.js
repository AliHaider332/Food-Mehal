import express from 'express';
import {
  itemDataValidation,
  shopDataValidation,
} from '../Middlewares/seller.validation.js';
import { checkUserAuthorization } from '../Middlewares/auth.validation.middleware.js';
import {
  createItem,
  createUpdateShop,
  deleteItem,
  getAnalytics,
  getItems,
  getShop,
  getShopCancelledOrders,
  getShopDeliveredOrders,
  getShopLiveOrders,
  updateItem,
  updateOrder,
} from '../Controllers/seller.controller.js';
import { upload } from '../Config/Cloudinary.js';
const router = express.Router();

router.get('/get-shop', checkUserAuthorization('seller'), getShop);
router.get(
  '/get-live-shop-order',
  checkUserAuthorization('seller'),
  getShopLiveOrders
);
router.get(
  '/get-delivered-shop-order',
  checkUserAuthorization('seller'),
  getShopDeliveredOrders
);
router.get(
  '/get-cancelled-shop-order',
  checkUserAuthorization('seller'),
  getShopCancelledOrders
);
router.post(
  '/create-update-shop',
  upload.single('picture'),
  checkUserAuthorization('seller'),
  shopDataValidation,
  createUpdateShop
);
router.get('/get-items', checkUserAuthorization('seller'), getItems);
router.post(
  '/create-item',
  upload.single('picture'),
  checkUserAuthorization('seller'),
  itemDataValidation,
  createItem
);
router.put(
  '/update-item/:id',
  upload.single('picture'),
  checkUserAuthorization('seller'),
  itemDataValidation,
  updateItem
);
router.delete('/delete-item/:id', checkUserAuthorization('seller'), deleteItem);
router.put('/order/:id/status', checkUserAuthorization('seller'), updateOrder);

router.get(
  '/get-shop-analytics',
  checkUserAuthorization('seller'),
  getAnalytics
);
export default router;
