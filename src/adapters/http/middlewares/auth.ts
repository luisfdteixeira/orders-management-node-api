import { Request, Response, NextFunction } from 'express';
import { auth } from '../../../config/firebase';

// Extensão do tipo Request para incluir o usuário
export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    role?: string;
  };
}

// Middleware de autenticação
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
    
    // Verifica o token com o Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Anexa o usuário à requisição
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