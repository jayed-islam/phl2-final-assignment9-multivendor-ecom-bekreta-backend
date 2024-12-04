import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    inventoryCount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    qualities: {
      type: [String],
      trim: true,
    },
    images: {
      type: [String],
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: 'Review',
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1, stock: 1 });

export const Product = model<IProduct>('Product', productSchema);
