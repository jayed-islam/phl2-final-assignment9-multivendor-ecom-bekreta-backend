/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';

const updateUserDataIntoDB = async (
  userId: string,
  userData: Partial<IUser>,
  user: any,
) => {
  if (userId !== user._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Only allow updating selected field
  const allowedUpdates = ['phone', 'name', 'bio', 'address'];
  const updates = Object.keys(userData);

  for (const update of updates) {
    if (!allowedUpdates.includes(update)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid field');
    }
  }

  const userUpdatedData = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  return userUpdatedData;
};

const updateUserByAdmin = async (userId: string, userData: Partial<IUser>) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const userUpdatedData = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  return userUpdatedData;
};

const updateUserProfilePicture = async (
  userId: string,
  file: any,
  user: any,
) => {
  if (userId !== user._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Check if the file is provided
  if (file) {
    const profilePicturePath = file.path;

    // Check if the file path exists
    if (!profilePicturePath) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Profile picture cannot update',
      );
    }

    // Update the user's profile picture in the database
    const userUpdatedData = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicturePath },
      { new: true },
    );

    return userUpdatedData;
  }

  throw new AppError(httpStatus.BAD_REQUEST, 'No file provided');
};

const getAllUsers = async () => {
  return User.find().select('-password');
};

const getUserProfile = async (userId: string): Promise<any> => {
  const user = await User.findById(userId)
    .populate({
      path: 'followedVendors',
      select: 'shopName address',
    })
    .populate({
      path: 'vendor',
    })
    .sort({ createdAt: -1 })
    .exec();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  return user;
};

export const UserService = {
  getUserProfile,
  getAllUsers,
  updateUserDataIntoDB,
  updateUserProfilePicture,
  updateUserByAdmin,
};
