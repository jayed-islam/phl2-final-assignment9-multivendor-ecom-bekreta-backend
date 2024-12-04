import { Types } from 'mongoose';

export interface ICoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableProducts?: Types.ObjectId[];
  applicableCategories?: Types.ObjectId[];
}
