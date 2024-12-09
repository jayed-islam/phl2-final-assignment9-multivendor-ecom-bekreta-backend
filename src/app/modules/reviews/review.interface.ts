import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  product: Types.ObjectId;
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  rating: number;
  comment: string;
  image: string;
}
