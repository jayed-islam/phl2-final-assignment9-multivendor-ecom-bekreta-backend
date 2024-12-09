import { Document, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  vendor: Types.ObjectId;
  name: string;
  phone: string;
  deliveryCharge: number;
  address: string;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
  items: IOrderItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentStatus: 'paid' | 'unpaid';
  paymentMethod: 'cashOnDelivery' | 'aamarpay';
  discount: number;
  coupon: Types.ObjectId;
  isCouponApplied: boolean;
}
