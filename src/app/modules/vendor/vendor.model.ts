import { model, Schema } from 'mongoose';
import { IVendor } from './vendor.interface';

const vendorSchema = new Schema<IVendor>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shopName: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    isBlacklisted: {
      type: Boolean,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    totalSales: {
      type: Number,
    },
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

export const Vendor = model<IVendor>('Vendor', vendorSchema);
