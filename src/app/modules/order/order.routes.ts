import express from 'express';
import { OrderController } from './order.controller';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.orderCreateValidationSchema),
  OrderController.createOrder,
);

router.post(
  '/get-order-summary',
  auth(USER_ROLE.admin),
  OrderController.orderSummary,
);

router.post(
  '/get-summary',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  OrderController.geSummary,
);

router.post(
  '/get-order-list',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  OrderController.getAllOrdersForAdmin,
);
router.post(
  '/user/:userId',
  auth(USER_ROLE.customer),
  OrderController.getOrdersForUser,
);
router.get('/:orderId', OrderController.getOrderById);

router.put('/:orderId', auth(USER_ROLE.admin), OrderController.updateOrder);

router.patch(
  '/update-status',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  OrderController.updateOrderStatus,
);
router.delete('/:orderId', auth(USER_ROLE.admin), OrderController.deleteOrder);
// // New endpoint for order summary

export const OrderRoutes = router;
