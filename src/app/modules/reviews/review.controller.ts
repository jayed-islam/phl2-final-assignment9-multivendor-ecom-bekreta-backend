// src/review/review.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const reviewData = req.body;
  const file = req.file;

  const newReview = await ReviewServices.createReview(reviewData, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully!',
    data: newReview,
  });
});

const getAllReviewsByProductId = catchAsync(async (req, res) => {
  const productId = req.query.productId as string;

  const reviews = await ReviewServices.getAllReviewsByProductId(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully!',
    data: reviews,
  });
});

const getVendorReviews = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.params.id;

  const reviews = await ReviewServices.getAllVendorReviews(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor reviews retrieved successfully!',
    data: reviews,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.id;

  await ReviewServices.deleteReview(reviewId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully!',
    data: null,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviewsByProductId,
  deleteReview,
  getVendorReviews,
};
