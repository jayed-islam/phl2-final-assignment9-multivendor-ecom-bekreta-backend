import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    email: string;
    role: 'admin' | 'customer' | 'seller';
    _id?: string;
  },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};
