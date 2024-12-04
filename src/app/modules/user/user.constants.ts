export type TAuthUser = {
  email: string;
  password: string;
  role: 'customer' | 'vendor';
};

export type TAuthAdmin = {
  email: string;
  password: string;
  key: string;
};

export const USER_ROLE = {
  customer: 'customer',
  admin: 'admin',
  vendor: 'vendor',
} as const;
