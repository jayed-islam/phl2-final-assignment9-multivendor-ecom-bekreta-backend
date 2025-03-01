import mongoose from 'mongoose';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { initiatePayment, verifyPayment } from './payment.utils';

import {
  htmlPaymentFailContent,
  htmlPaymentSuccessContent,
} from './payment.response';
import { Payment } from './payment.model';
import { PaymentInfo } from './payment.interface';
import { Order } from '../order/order.model';

// Payment confirmation function (after payment gateway verification)
const PaymentConfirmation = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);
  const session = await mongoose.startSession();

  if (verifyResponse.pay_status === 'Successful') {
    try {
      session.startTransaction();

      // Update the payment record (marking it as completed)
      const payment = await Payment.findOneAndUpdate(
        { transactionId },
        { paymentStatus: 'COMPLETED' },
        { new: true, session },
      );

      if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
      }

      const orderId = payment.order.toString();

      const orderUpdate = await Order.findByIdAndUpdate(
        orderId,
        { payment: payment._id, paymentStatus: 'paid' },
        { new: true, session },
      );

      if (!orderUpdate) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
      }

      await session.commitTransaction();
      await session.endSession();

      return htmlPaymentSuccessContent;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(
        httpStatus.CONFLICT,
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  } else {
    return PaymentFailure(transactionId);
  }
};

// Payment failure function
const PaymentFailure = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId); // Verify payment

  if (verifyResponse.pay_status !== 'Successful') {
    // Optionally, mark payment as failed
    await Payment.findOneAndUpdate(
      { transactionId },
      { paymentStatus: 'FAILED' },
    );
    return htmlPaymentFailContent;
  }
};

const makePayment = async (
  userId: string,
  vendor: string,
  order: string,
  amount: number,
  name?: string,
  address?: string,
  phone?: string,
) => {
  const session = await mongoose.startSession();

  const user = await User.findById(userId);

  try {
    session.startTransaction();

    const transactionId = `TXN-${Date.now()}`;

    const paymentInfo: PaymentInfo = {
      transactionId,
      amount: amount ?? 51,
      customerName: name ?? 'N/A',
      customerEmail: user?.email ?? 'N/A',
      customerAddress: address ?? 'address',
      customerPhone: phone ?? '01309090909',
    };

    // Initiate payment via the payment gateway
    const paymentSession = await initiatePayment(
      paymentInfo,
      user?._id as string,
    );

    // Create a payment record in the database
    await Payment.create(
      [
        {
          user: userId,
          vendor,
          order,
          amount,
          transactionId,
          paymentStatus: 'PENDING',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return paymentSession;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.CONFLICT,
      error instanceof Error ? error.message : 'Something went wrong',
    );
  }
};

const getAllPayments = async () => {
  try {
    const payments = await Payment.find()
      .populate('user', '-password')
      .populate('vendor', 'name')
      .populate('order');

    return payments;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching payments',
    );
  }
};

const updatePaymentStatus = async (
  transactionId: string,
  newStatus: 'PENDING' | 'COMPLETED' | 'FAILED',
) => {
  const validStatuses = ['PENDING', 'COMPLETED', 'FAILED'];

  if (!validStatuses.includes(newStatus)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payment status');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId },
      { paymentStatus: newStatus },
      { new: true, session },
    );

    if (!updatedPayment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
    }

    await session.commitTransaction();
    await session.endSession();

    return updatedPayment;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.CONFLICT,
      error instanceof Error
        ? error.message
        : 'Failed to update payment status',
    );
  }
};

// Exporting the payment service
export const PaymentService = {
  PaymentConfirmation,
  makePayment,
  PaymentFailure,
  getAllPayments,
  updatePaymentStatus,
};
