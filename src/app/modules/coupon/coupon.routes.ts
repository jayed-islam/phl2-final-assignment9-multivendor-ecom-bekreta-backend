import { Router } from 'express';
import { CouponController } from './coupon.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middlewares/auth';

const router = Router();

// Admin routes
router.post('/', auth(USER_ROLE.admin), CouponController.createCoupon);

router.put('/:id', auth(USER_ROLE.admin), CouponController.updateCoupon);
router.delete('/:id', auth(USER_ROLE.admin), CouponController.deleteCoupon);

// Public routes
router.post('/validate', CouponController.validateCoupon);
router.post('/apply', CouponController.applyCoupon);

export const CouponRoutes = router;
