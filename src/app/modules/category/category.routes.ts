// src/category/category.routes.ts
import { NextFunction, Request, Response, Router } from 'express';
import { CategoryControllers } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import { multerUpload } from '../../config/multer.config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
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
  validateRequest(CategoryValidations.createCategorySchema),
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCategories);

router.get('/:id', auth(USER_ROLE.admin), CategoryControllers.getCategoryById);
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidations.updateCategorySchema),
  CategoryControllers.updateCategory,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
