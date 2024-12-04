import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import { PaymentController } from './payment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

router.post('/success', PaymentController.ConfirmPayment);

router.post('/fail', PaymentController.FailPayment);

router.post(
  '/make-payment',
  auth(USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(PaymentValidation.paymentValidation),
  PaymentController.MakePayemnt,
);

router.get(
  '/get-list',
  auth(USER_ROLE.admin),
  PaymentController.getPaymentList,
);

export const PaymentRoutes = router;
