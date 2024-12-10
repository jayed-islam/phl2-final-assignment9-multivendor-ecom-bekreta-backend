// src/review/review.routes.ts
import { NextFunction, Request, Response, Router } from 'express';
import { ReviewControllers } from './review.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { multerUpload } from '../../config/multer.config';
import { ReviewValidations } from './review.validation';
import { USER_ROLE } from '../user/user.constants';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.customer),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body && req.body.data) {
      req.body = JSON.parse(req.body.data);
    } else {
      throw new AppError(
        httpStatus.CONFLICT,
        'Request body data is undefined or invalid JSON',
      );
    }

    next();
  },
  validateRequest(ReviewValidations.createReviewSchema),
  ReviewControllers.createReview,
);

router.get('/', ReviewControllers.getAllReviewsByProductId);

router.delete('/:id', auth(), ReviewControllers.deleteReview);

router.get(
  '/vendor-reviews/:id',
  auth(USER_ROLE.vendor),
  ReviewControllers.getVendorReviews,
);

export const ReviewRoutes = router;
