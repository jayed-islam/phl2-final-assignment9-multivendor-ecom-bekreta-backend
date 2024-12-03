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
      required: true,
    },
    address: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  },
);

export const Vendor = model<IVendor>('Vendor', vendorSchema);
