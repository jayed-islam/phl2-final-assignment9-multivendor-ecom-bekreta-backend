import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponService } from './coupon.service';
import httpStatus from 'http-status';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await CouponService.createCoupon(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: coupon,
  });
});

const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, totalAmount } = req.body;
  const result = await CouponService.applyCoupon(code, totalAmount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon applied successfully',
    data: result,
  });
});

const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.body;
  const coupon = await CouponService.validateCoupon(code);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon is valid',
    data: coupon,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await CouponService.updateCoupon(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: coupon,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CouponService.deleteCoupon(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: null,
  });
});

export const CouponController = {
  createCoupon,
  applyCoupon,
  validateCoupon,
  deleteCoupon,
  updateCoupon,
};
