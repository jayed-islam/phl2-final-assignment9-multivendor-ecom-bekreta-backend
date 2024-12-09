import { Types } from 'mongoose';

export interface PaymentInfo {
  transactionId: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export interface IPayment {
  user: Types.ObjectId;
  vendor: Types.ObjectId;
  order: Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId: string;
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}
