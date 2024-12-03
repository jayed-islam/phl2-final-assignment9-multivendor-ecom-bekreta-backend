export type TAuthUser = {
  email: string;
  password: string;
};

export type TAuthAdmin = {
  email: string;
  password: string;
  key: string;
};

export const USER_ROLE = {
  customer: 'customer',
  admin: 'admin',
  seller: 'seller',
} as const;
