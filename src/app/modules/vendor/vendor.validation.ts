// src/vendor/vendor.validation.ts
import { z } from 'zod';

const createVendorSchema = z.object({
  body: z.object({
    shopName: z
      .string({ required_error: 'Shop name is required' })
      .min(1, 'Shop name is required'),
    address: z
      .string({ required_error: 'Shop address is required' })
      .min(1, 'Address is required'),
    contactPhone: z.string({ required_error: 'Shop phone is required' }),
    description: z.string().optional(),
    products: z.array(z.string()).optional(),
    isBlacklisted: z.boolean().optional(),
    isVerified: z.boolean().default(true),
    rating: z.number().optional(),
    totalSales: z.number().optional(),
  }),
});

const updateVendorSchema = z.object({
  body: z.object({
    shopName: z.string().min(1, 'Shop name is required').optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    products: z.array(z.string()).optional(),
    isBlacklisted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    rating: z.number().optional(),
    totalSales: z.number().optional(),
  }),
});

export const VendorValidations = {
  createVendorSchema,
  updateVendorSchema,
};
