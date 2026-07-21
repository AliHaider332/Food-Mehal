import express from 'express';
import { checkUserAuthorization } from '../Middlewares/auth.validation.middleware.js';
import {
  getUserDataByID,
  getSingleItem,
  getSingleShop,
  orderItems,
  myOrders,
  getSearchItems,
  getCustomerFrontShop,
  getCustomerFrontItems,
  addToFavorite,
  getFavorite,
  getCartItems,
  operateCart,
  getRecommendations,
} from '../Controllers/customer.controller.js';
import { reviewOrder } from '../Controllers/delivery.controller.js';
const router = express.Router();

router.get('/customer-frontpage-shop', checkUserAuthorization('customer'), getCustomerFrontShop);
router.get('/customer-frontpage-item', checkUserAuthorization('customer'), getCustomerFrontItems);
router.post('/search-item', checkUserAuthorization('customer'), getSearchItems);

router.post('/add-to-cart', checkUserAuthorization('customer'), operateCart);
router.get('/get-cart-post', checkUserAuthorization('customer'), getCartItems);

router.post('/add-to-favorite', checkUserAuthorization('customer'), addToFavorite);
router.get('/get-favorite-post', checkUserAuthorization('customer'), getFavorite);

router.get('/customer-order', checkUserAuthorization('customer'), myOrders);
router.post('/place-order', checkUserAuthorization('customer'), orderItems);
router.post('/:orderId/review', checkUserAuthorization('customer'), reviewOrder);


router.get('/item/:id', checkUserAuthorization('customer'), getSingleItem);
router.get('/recommendations/:id', checkUserAuthorization('customer'), getRecommendations);
router.get('/shop/:id', checkUserAuthorization('customer'), getSingleShop);


router.post('/user-item-by-id', checkUserAuthorization('customer'), getUserDataByID);
export default router;
