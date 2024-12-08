import { z } from 'zod';

const orderCreateValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User is required' }),
    vendor: z.string({ required_error: 'Vendor is required' }),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .min(11, { message: 'Phone min char is 11' }),
    name: z.string({ required_error: 'User name is required' }),
    items: z.array(
      z.object({
        product: z.string({ required_error: 'Product ID is required' }),
        quantity: z
          .number({ required_error: 'Quantity is required' })
          .min(1, { message: 'Quantity must be greater than 0' }),
        price: z
          .number({ required_error: 'Price is required' })
          .min(1, { message: 'Price must be greater than 0' }),
      }),
    ),
    paymentMethod: z.string({ required_error: 'Payment method is required' }),
    paymentStatus: z.string().optional(),
    address: z.string({ required_error: 'Address is required' }),
    coupon: z.string({ required_error: 'Coupon is required' }),
    discount: z.number({ required_error: 'Discount is required' }),
    isCouponApplied: z.boolean({
      required_error: 'IsCouponApplied is required',
    }),
    totalPrice: z
      .number({
        required_error: 'Total price is required',
      })
      .min(1, { message: 'Total price must be greater than 0' }),
    deliveryCharge: z
      .number({
        required_error: 'Delivery charege is required',
      })
      .min(1, { message: 'Delivery charege must be greater than 0' }),
  }),
});

const orderCancelValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User id is required' }),
    orderId: z.string({ required_error: 'Order id is required' }),
  }),
});

export const OrderValidation = {
  orderCreateValidationSchema,
  orderCancelValidationSchema,
};
