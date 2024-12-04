import { Router } from 'express';
import { VendorControllers } from './vendor.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VendorValidations } from './vendor.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(VendorValidations.createVendorSchema),
  VendorControllers.createVendor,
);

router.get('/', VendorControllers.getAllVendors);

router.get('/:id', auth(USER_ROLE.admin), VendorControllers.getVendorById);

router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  validateRequest(VendorValidations.updateVendorSchema),
  VendorControllers.updateVendor,
);

router.put(
  '/make-block/:id',
  auth(USER_ROLE.admin),
  VendorControllers.toggleBlockVendor,
);

router.delete('/:id', auth(USER_ROLE.admin), VendorControllers.deleteVendor);

export const VendorRoutes = router;
