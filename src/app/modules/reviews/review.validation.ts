import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product ID is required' }).nonempty(),
    customer: z
      .string({ required_error: 'Customer ID is required' })
      .nonempty(),
    vendor: z.string({ required_error: 'Vendor ID is required' }).nonempty(),
    rating: z
      .number()
      .min(1, { message: 'Rating must be at least 1' })
      .max(5, { message: 'Rating must be at most 5' })
      .optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidations = {
  createReviewSchema,
};
