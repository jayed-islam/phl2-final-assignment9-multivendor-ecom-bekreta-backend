import { Document, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  vendor: Types.ObjectId;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
  items: IOrderItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentStatus: 'paid' | 'unpaid';
}
