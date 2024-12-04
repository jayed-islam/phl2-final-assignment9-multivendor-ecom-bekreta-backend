import { Schema, model } from 'mongoose';
import { ICoupon } from './coupon.interface';

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    discountValue: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true },
);

export const Coupon = model<ICoupon>('Coupon', couponSchema);
