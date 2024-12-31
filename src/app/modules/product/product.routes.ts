import { NextFunction, Request, Response, Router } from 'express';
import { ProductController } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import { USER_ROLE } from '../user/user.constants';
import { multerUpload } from '../../config/multer.config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  multerUpload.array('files'),
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
  validateRequest(ProductValidation.productSchema),
  ProductController.createProduct,
);

router.post(
  '/get-list',
  validateRequest(ProductValidation.getProductListValidation),
  ProductController.getProductList,
);

router.get('/get-single/:productId', ProductController.getSingleProductByID);

router.get('/flash-sale', ProductController.getFlashSaleProducts);

router.get(
  '/get-by-category/:categoryId',
  ProductController.getProductByCategory,
);

router.post(
  '/get-product-list',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(ProductValidation.getProductListValidation),
  ProductController.getProductListForAdmin,
);

router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductController.updateSingleProduct,
);

router.put(
  '/delete/:id',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  ProductController.softDeleteProduct,
);

router.put(
  '/duplicate/:id',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  ProductController.makeDuplicate,
);

router.get('/all-products', ProductController.getAllProducts);
router.get('/get-home-data', ProductController.getHomeData);

export const ProductRoutes = router;
