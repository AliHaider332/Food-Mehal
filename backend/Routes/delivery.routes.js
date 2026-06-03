import express from 'express';
import { checkUserAuthorization } from '../Middlewares/auth.validation.middleware.js';
import {
  acceptOrder,
  cancelOrder,
  getDeliveredOrder,
  getOrder,
  updateStatus,
} from '../Controllers/delivery.controller.js';
const router = express.Router();

router.get('/get-order', checkUserAuthorization('delivery-boy'), getOrder);
router.get(
  '/accept-order/:id',
  checkUserAuthorization('delivery-boy'),
  acceptOrder
);
router.get(
  '/order-status/:id/:status',
  checkUserAuthorization('delivery-boy'),
  updateStatus
);
router.post('/cancel-order/:id', cancelOrder);
router.get(
  '/delivery-history',
  checkUserAuthorization('delivery-boy'),
  getDeliveredOrder
);
export default router;
