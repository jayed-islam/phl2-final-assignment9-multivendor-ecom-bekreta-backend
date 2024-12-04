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
  discount?: number;
  rating: number;
  vendor: Types.ObjectId;
  isOnSale: boolean;
  isPublished: boolean;
}
