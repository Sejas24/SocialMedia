import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export const checkRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
      return;
    }

    next();
  };
};