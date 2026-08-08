import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { AuthUseCases } from '../../core/use-cases/AuthUseCases';
import { FirebaseAuthService } from '../services/FirebaseAuthService';
import { authenticate } from './middlewares/auth';

const router = Router();

// Configurar dependências
const apiKey = process.env.FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error('FIREBASE_API_KEY não definida no .env');
}
const authService = new FirebaseAuthService(apiKey);
const authUseCases = new AuthUseCases(authService);
const authController = new AuthController(authUseCases);

// Rota pública de login
router.post('/auth/login', (req, res) => authController.login(req, res));

// Rota para obter perfil (protegida - exemplo)
router.get('/auth/profile', authenticate, (req, res) => {
  res.json({ user: (req as any).user });
});

export { router };