import { UserRole } from '../../models/User';

export interface AuthPayload {
  id: number;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};