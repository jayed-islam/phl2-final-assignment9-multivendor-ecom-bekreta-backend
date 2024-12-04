import { z } from 'zod';

// Zod schema for category creation
const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Category name is required' })
      .max(100, { message: 'Category name must be less than 100 characters' }),
    slug: z.string({ required_error: 'Slug is required' }).nonempty(),
  }),
});

// Zod schema for category update
const updateCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Category name is required' })
      .max(100, { message: 'Category name must be less than 100 characters' })
      .optional(),
  }),
});

// usage of Zod schemas for creating and updating categories
export const CategoryValidations = {
  createCategorySchema,
  updateCategorySchema,
};
