import { z } from 'zod';

const productSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(5, { message: 'Name is required' })
      .trim(),
    slug: z
      .string({ required_error: 'Slug is required' })
      .min(5, { message: 'Slug at least 5 long' })
      .trim(),
    about: z
      .string({ required_error: 'About is required' })
      .min(5, { message: 'About is required' })
      .trim(),
    descriptions: z
      .array(z.string({ required_error: 'Description is required' }))
      .nonempty({ message: 'Descriptions are required' }),
    price: z
      .number({ required_error: 'Price is required' })
      .min(0, { message: 'Price is required' }),
    category: z
      .string({ required_error: 'Category is required' })
      .min(1, { message: 'Category is required' })
      .trim(),
    stock: z
      .number({ required_error: 'Stock is required' })
      .min(0, { message: 'Stock is required' }),
    // images: z.array(z.string()).nonempty({ message: 'Images are required' }),
    specifications: z.array(z.string()),
    // qualities: z.array(z.string()),
    keywords: z.array(z.string()),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name must be minimum 5 char. required' })
      .optional(),
    about: z.string().min(5, { message: 'About is required' }).optional(),
    descriptions: z.array(z.string()).optional(),
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
    status: z
      .array(z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'DISCOUNTED', 'FEATURED']))
      .optional(),
  }),
});

export const ProductValidation = {
  productSchema,
  updateProductValidationSchema,
  getProductListValidation,
};
