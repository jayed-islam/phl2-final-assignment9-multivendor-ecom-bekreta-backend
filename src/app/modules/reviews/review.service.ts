/* eslint-disable @typescript-eslint/no-explicit-any */
// src/review/review.service.ts
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { Product } from '../product/product.model';

import mongoose from 'mongoose';

const createReview = async (
  reviewData: IReview,
  file?: any,
): Promise<IReview> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (file) {
      reviewData.image = file.path;
    }

    const review = await Review.create([reviewData], { session });

    const product = reviewData.product;

    const result = await Product.findByIdAndUpdate(
      product,
      { $push: { reviews: review[0]._id } },
      { session },
    );

    console.log('res', reviewData, result);

    await session.commitTransaction();
    session.endSession();

    return review[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllReviewsByProductId = async (
  productId: string,
): Promise<IReview[]> => {
  const query = productId ? { product: productId } : {};
  const reviews = await Review.find(query).populate('customer', 'name email');
  return reviews;
};

const getAllVendorReviews = async (vendorId: string): Promise<IReview[]> => {
  const reviews = await Review.find({ vendor: vendorId })
    .populate({
      path: 'customer',
      select: 'name email',
    })
    .populate({
      path: 'product',
      select: 'name price',
    })
    .populate({
      path: 'vendor',
      select: 'shopName logo',
    });

  return reviews;
};

const deleteReview = async (reviewId: string): Promise<void> => {
  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
};

export const ReviewServices = {
  createReview,
  getAllReviewsByProductId,
  deleteReview,
  getAllVendorReviews,
};
