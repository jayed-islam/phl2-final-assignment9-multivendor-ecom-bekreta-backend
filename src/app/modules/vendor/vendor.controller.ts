/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { VendorServices } from './vendor.service';

const createVendor = catchAsync(async (req: Request, res: Response) => {
  const vendorData = req.body;

  const newVendor = await VendorServices.createVendor(vendorData, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Vendor created successfully!',
    data: newVendor,
  });
});

const getAllVendors = catchAsync(async (req: Request, res: Response) => {
  const vendors = await VendorServices.getAllVendors();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendors retrieved successfully!',
    data: vendors,
  });
});

const getVendorById = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.params.id;

  const vendor = await VendorServices.getVendorById(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor retrieved successfully!',
    data: vendor,
  });
});

const updateVendor = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.params.id;
  const updateData = req.body;

  const updatedVendor = await VendorServices.updateVendor(
    vendorId,
    updateData,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor updated successfully!',
    data: updatedVendor,
  });
});

const toggleBlockVendor = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.params.id;

  const updatedVendor = await VendorServices.toggleBlockVendor(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor updated successfully!',
    data: updatedVendor,
  });
});

const deleteVendor = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.params.id;

  const result = await VendorServices.deleteVendor(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor deleted successfully!',
    data: null,
  });
});

const updateVendorLogo = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.params.id;
  const file = req.file;

  const updatedVendor = await VendorServices.updateVendorLogo(file, vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor logo updated successfully!',
    data: updatedVendor,
  });
});

export const VendorControllers = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  toggleBlockVendor,
  updateVendorLogo,
};
