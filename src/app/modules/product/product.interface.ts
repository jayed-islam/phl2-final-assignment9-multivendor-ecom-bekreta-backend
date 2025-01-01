import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  inventoryCount: number;
  category: Types.ObjectId;
  reviews: Types.ObjectId[];
  qualities: string[];
  images: string[];
  isFeatured: boolean;
  isDeleted: boolean;
  discount?: number;
  rating: number;
  salesCount: number;
  vendor: Types.ObjectId;
  isOnSale: boolean;
  isPublished: boolean;
  status: ProductStatus;
}

export type ProductStatus =
  | 'OFFERED'
  | 'NEW_ARRIVAL'
  | 'BEST_SELLER'
  | 'NORMAL'
  | 'IN_STOCK'
  | 'OUT_OF_STOCK';
