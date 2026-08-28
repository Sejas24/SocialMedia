import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyJwtToken = (token: string): AuthPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};