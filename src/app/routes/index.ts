import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { VendorRoutes } from '../modules/vendor/vendor.routes';
import { ReviewRoutes } from '../modules/reviews/review.routes';
import { ProductRoutes } from '../modules/product/product.routes';

const router = Router();

const modulesRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/vendor',
    route: VendorRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
