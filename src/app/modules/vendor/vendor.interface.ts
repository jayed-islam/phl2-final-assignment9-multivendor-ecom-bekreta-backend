import { Types } from 'mongoose';

export interface IVendor extends Document {
  user: Types.ObjectId;
  shopName: string;
  logo?: string;
  description?: string;
  products: Types.ObjectId[];
  followers: Types.ObjectId[];
  address: string;
  isBlacklisted: boolean;
}
