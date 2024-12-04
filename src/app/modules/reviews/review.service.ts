/* eslint-disable @typescript-eslint/no-explicit-any */
// src/review/review.service.ts
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { Product } from '../product/product.model';

const createReview = async (
  reviewData: IReview,
  file?: any,
): Promise<IReview> => {
  if (file) {
    reviewData.image = file.path;
  }

  const review = await Review.create(reviewData);
  return review;
};

const getAllReviews = async (productId: string): Promise<IReview[]> => {
  const query = productId ? { product: productId } : {};
  const reviews = await Review.find(query).populate('customer', 'name email');
  return reviews;
};

const getAllVendorReviews = async (vendorId: string): Promise<IReview[]> => {
  const products = await Product.find({ vendorId }).populate({
    path: 'reviews',
    select: 'rating comment customer',
  });

  // Flatten the reviews from all products
  const reviews: any[] = products.flatMap((product) => product.reviews);

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
  getAllReviews,
  deleteReview,
  getAllVendorReviews,
};
