import { Types } from 'mongoose';

export interface IVendor extends Document {
  _id: string;
  user: Types.ObjectId;
  email: string;
  shopName: string;
  logo?: string;
  contactPhone: string;
  description?: string;
  products: Types.ObjectId[];
  followers: Types.ObjectId[];
  address: string;
  isBlacklisted: boolean;
  isVerified: boolean;
  rating?: number;
  totalSales?: number;
}
