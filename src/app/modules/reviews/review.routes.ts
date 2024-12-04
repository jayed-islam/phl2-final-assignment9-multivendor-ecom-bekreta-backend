// src/review/review.routes.ts
import { Router } from 'express';
import { ReviewControllers } from './review.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { multerUpload } from '../../config/multer.config';
import { ReviewValidations } from './review.validation';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(),
  auth(USER_ROLE.customer),
  multerUpload.single('file'),
  validateRequest(ReviewValidations.createReviewSchema),
  ReviewControllers.createReview,
);

router.get('/', ReviewControllers.getAllReviewsByProductId);

router.delete('/:id', auth(), ReviewControllers.deleteReview);

router.get(
  '/vendor-reviews',
  auth(USER_ROLE.vendor),
  ReviewControllers.getVendorReviews,
);

export const ReviewRoutes = router;
