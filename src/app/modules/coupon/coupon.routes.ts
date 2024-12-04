import { Router } from 'express';
import { CouponController } from './coupon.controller';
import authAdmin from '../../middlewares/adminAuth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

// Admin routes
router.post(
  '/',
  authAdmin(USER_ROLE.admin, USER_ROLE.superAdmin),
  CouponController.createCoupon,
);

router.put(
  '/:id',
  authAdmin(USER_ROLE.admin, USER_ROLE.superAdmin),
  CouponController.updateCoupon,
);
router.delete(
  '/:id',
  authAdmin(USER_ROLE.admin, USER_ROLE.superAdmin),
  CouponController.deleteCoupon,
);

// Public routes
router.post('/validate', CouponController.validateCoupon);
router.post('/apply', CouponController.applyCoupon);

export const CouponRoutes = router;
