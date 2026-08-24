import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }
    const userRole = req.user.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Permissão negada' });
      return;
    }
    next();
  };
};