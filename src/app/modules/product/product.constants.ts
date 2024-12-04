export const ProductStatus = ['IN_STOCK', 'OUT_OF_STOCK'] as const;

export const ProductType = [
  'DEFAULT',
  'DISCOUNTED',
  'FEATURED',
  'OFFERED',
] as const;

export type ProductType = (typeof ProductType)[number];
