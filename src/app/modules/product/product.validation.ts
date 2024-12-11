import { z } from 'zod';

const productSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name must be at least 1 character long' })
      .trim(),
    description: z
      .string({ required_error: 'Description is required' })
      .min(1, { message: 'Description must be at least 1 character long' })
      .trim(),
    price: z
      .number({ required_error: 'Price is required' })
      .min(0, { message: 'Price must be 0 or greater' }),
    inventoryCount: z
      .number({ required_error: 'Inventory count is required' })
      .min(0, { message: 'Inventory count must be 0 or greater' }),
    category: z
      .string({ required_error: 'Category is required' })
      .min(1, { message: 'Category must not be empty' })
      .trim(),
    qualities: z.array(z.string().trim()).optional(),

    images: z.array(z.string().trim()).optional(),
    vendor: z
      .string({ required_error: 'Vendor is required' })
      .min(1, { message: 'Vendor must not be empty' })
      .trim(),
    isOnSale: z.boolean().optional(),
    isPublished: z.boolean().optional(),
  }),
});
const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name must be minimum 5 char. required' })
      .optional(),
    about: z.string().min(5, { message: 'About is required' }).optional(),
    description: z.string().optional(),
    price: z
      .number()
      .min(0, { message: 'Price is can not be minimum to 0' })
      .optional(),
    category: z
      .string()
      .min(1, { message: 'Category must be minimum 1 char is required' })
      .optional(),
    stock: z.number().min(0, { message: 'Stock is required' }).optional(),
    images: z.array(z.string()).optional(),
    specifications: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    isDeleted: z.boolean().optional(),
    status: z
      .enum(['IN_STOCK', 'OUT_OF_STOCK', 'DISCOUNTED', 'FEATURED'])
      .optional(),
  }),
});

const getProductListValidation = z.object({
  body: z.object({
    searchTerm: z.string().optional(),
    category: z.string().optional(),
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    minPrice: z.number().optional().default(0),
    maxPrice: z.number().optional().default(Number.MAX_SAFE_INTEGER),
    userId: z.string().optional(),
  }),
});

export const ProductValidation = {
  productSchema,
  updateProductValidationSchema,
  getProductListValidation,
};
