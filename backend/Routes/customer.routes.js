import express from 'express';
import { checkUserAuthorization } from '../Middlewares/auth.validation.middleware.js';
import {
  getUserData,
  getUserDataByID,
  getSingleItem,
  getAllItem,
  getSingleShop,
  orderItems,
  myOrders,
  getMoreItems,
} from '../Controllers/customer.controller.js';
import { reviewOrder } from '../Controllers/delivery.controller.js';
const router = express.Router();
router.post('/user-data', checkUserAuthorization('customer'), getUserData);
router.post(
  '/user-more-data',
  checkUserAuthorization('customer'),
  getMoreItems
);
router.post(
  '/user-item-by-id',
  checkUserAuthorization('customer'),
  getUserDataByID
);
router.get('/item/:id', checkUserAuthorization('customer'), getSingleItem);
router.get('/items/all', checkUserAuthorization('customer'), getAllItem);
router.get('/shop/:id', checkUserAuthorization('customer'), getSingleShop);
router.post('/order', checkUserAuthorization('customer'), orderItems);
router.get('/my-order', checkUserAuthorization('customer'), myOrders);
router.post(
  '/:orderId/review',
  checkUserAuthorization('customer'),
  reviewOrder
);
export default router;
