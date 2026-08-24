import { Request, Response, NextFunction } from 'express';
import { auth } from '../../../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    role?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token de autenticação não fornecido' });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    const decodedToken = await auth.verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      role: decodedToken.role || 'user',
    };
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};