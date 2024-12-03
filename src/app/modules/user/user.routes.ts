import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.customer, USER_ROLE.seller),
  UserController.getCurrentUser,
);

router.get(
  '/single-user/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer, USER_ROLE.seller),
  UserController.getSingleUser,
);

router.put(
  '/me/update/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer, USER_ROLE.seller),
  UserController.updateUserData,
);

router.put(
  '/admin/update/:id',
  auth(USER_ROLE.admin),
  UserController.updateUserByAdmin,
);

router.put(
  '/me/update/profile-picture/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer, USER_ROLE.seller),
  multerUpload.single('file'),
  UserController.updateUserProfilePicture,
);

router.get('/get-list', auth(USER_ROLE.admin), UserController.getAllUsers);

export const UserRoutes = router;
