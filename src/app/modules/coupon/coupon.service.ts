import { Coupon } from './coupon.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ICoupon } from './coupon.interface';

const createCoupon = async (couponData: Partial<ICoupon>) => {
  const newCoupon = await Coupon.create(couponData);
  return newCoupon;
};

const validateCoupon = async (code: string) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  if (coupon.expiryDate < new Date())
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon expired');
  if (coupon.usedCount >= coupon.usageLimit)
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached');
  return coupon;
};

const applyCoupon = async (code: string, totalAmount: number) => {
  const coupon = await validateCoupon(code);
  let discount = 0;

  if (coupon.discountType === 'percentage') {
    discount = (totalAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  const discountedPrice = totalAmount - discount;
  return { discount, discountedPrice };
};

const updateCoupon = async (couponId: string, couponData: Partial<ICoupon>) => {
  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    { $set: couponData },
    { new: true, runValidators: true },
  );
  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  return coupon;
};

const deleteCoupon = async (couponId: string) => {
  const coupon = await Coupon.findByIdAndDelete(couponId);
  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  return coupon;
};

const incrementUsage = async (code: string) => {
  const coupon = await Coupon.findOneAndUpdate(
    { code },
    { $inc: { usedCount: 1 } },
    { new: true },
  );
  if (!coupon) throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  return coupon;
};

export const CouponService = {
  createCoupon,
  validateCoupon,
  applyCoupon,
  incrementUsage,
  updateCoupon,
  deleteCoupon,
};
