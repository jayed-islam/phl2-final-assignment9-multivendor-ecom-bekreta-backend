import { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  isDeleted: boolean;
  parentCategory?: Types.ObjectId;
  image: string;
}
