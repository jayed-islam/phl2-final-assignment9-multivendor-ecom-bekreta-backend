/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import mongoose from 'mongoose';
import { Vendor } from '../vendor/vendor.model';

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

const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId)
    .populate({
      path: 'followedVendors',
      select: 'shopName address',
    })
    .populate('vendor')
    .sort({ createdAt: -1 })
    .exec();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  return user;
};
const getUsersForAdmin = async (
  filters: { role?: string; search?: string },
  limit = 10,
  page = 1,
) => {
  const query: any = {};

  if (filters.role) {
    query.role = filters.role;
  }
  if (filters.search) {
    // Check if the search value is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(filters.search)) {
      // If it's a valid ObjectId, query by _id
      query.$or = [{ _id: filters.search }];
    } else {
      // Otherwise, search by name
      query.$or = [{ name: { $regex: filters.search, $options: 'i' } }];
    }
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .populate({
      path: 'vendor',
      match: filters.role === 'vendor' ? {} : null,
    })
    .skip(skip)
    .limit(limit)
    .select('-password')
    .exec();

  const totalItems = await User.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);
  const pagination = {
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage: limit,
  };

  return { users, pagination };
};

// const updateUserStatus = async (
//   userId: string,
//   status: string,
//   isBlacklisted: boolean,
// ) => {
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     user.status = status;
//     if (user.role === 'vendor') {
//       user.isBlocklisted = isBlocklisted;
//     }

//     await user.save();

//     return res
//       .status(200)
//       .json({ success: true, message: 'User status updated successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

const updateUserStatus = async (
  userId: string,
  status: string,
  isBlacklisted: boolean,
) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  if (existingUser.role === 'customer') {
    // If the role is 'customer', update the status directly
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true },
    );
    return updatedUser;
  } else if (existingUser.role === 'vendor') {
    const vendor = await Vendor.findById(existingUser.vendor);

    if (!vendor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Vendor Not Found');
    }

    vendor.isBlacklisted = isBlacklisted;
    await vendor.save();

    return vendor;
  } else {
    return null;
  }
};

export const UserService = {
  getUserProfile,
  getAllUsers,
  updateUserDataIntoDB,
  updateUserProfilePicture,
  updateUserByAdmin,
  getUsersForAdmin,
  updateUserStatus,
};
