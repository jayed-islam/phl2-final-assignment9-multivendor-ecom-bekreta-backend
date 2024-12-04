/* eslint-disable @typescript-eslint/no-explicit-any */
import { IVendor } from './vendor.interface';
import { Vendor } from './vendor.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createVendor = async (
  vendorData: IVendor,
  user: any,
): Promise<IVendor> => {
  const vendor = await Vendor.create({
    ...vendorData,
    user: user._id,
  });
  return vendor;
};

const getAllVendors = async (): Promise<IVendor[]> => {
  return Vendor.find();
};

const getVendorById = async (vendorId: string): Promise<IVendor | null> => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  return vendor;
};

const updateVendor = async (
  vendorId: string,
  updateData: Partial<IVendor>,
  user: any,
): Promise<IVendor | null> => {
  if (user.role !== 'admin' && user._id.toString() !== vendorId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this vendor',
    );
  }
  const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedVendor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  return updatedVendor;
};

const deleteVendor = async (vendorId: string): Promise<IVendor | null> => {
  const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
  if (!deletedVendor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  return deletedVendor;
};

const toggleBlockVendor = async (vendorId: string): Promise<IVendor | null> => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  vendor.isBlacklisted = !vendor.isBlacklisted;

  await vendor.save();

  return vendor;
};

export const VendorServices = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  toggleBlockVendor,
};
