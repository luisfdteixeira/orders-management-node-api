import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { AuthUseCases } from '../../core/use-cases/AuthUseCases';
import { FirebaseAuthService } from '../services/FirebaseAuthService';
import { authenticate } from './middlewares/auth';
import { authorize } from './middlewares/authorize';
import { ProductController } from './controllers/ProductController';
import { ProductUseCases } from '../../core/use-cases/ProductUseCases';
import { ImgBBImageUploadService } from '../services/ImgBBImageUploadService';
import { supabaseClient } from '../db/supabase-client';
import { SupabaseProductRepository } from '../repositories/SupabaseProductRepository';
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';

const router = Router();

const productRepository = new SupabaseProductRepository(supabaseClient);
const userRepository = new SupabaseUserRepository(supabaseClient);

const imageUploadService = new ImgBBImageUploadService();

const productUseCases = new ProductUseCases(productRepository, imageUploadService);

const productController = new ProductController(productUseCases);

const apiKey = process.env.FIREBASE_API_KEY;
if (!apiKey) {
  throw new Error('FIREBASE_API_KEY not defined in the .env file');
}
const authService = new FirebaseAuthService(apiKey);
const authUseCases = new AuthUseCases(authService, userRepository);
const authController = new AuthController(authUseCases);

router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));

router.get('/auth/profile', authenticate, (req, res) => {
  res.json({ user: (req as any).user });
});

router.post(
  '/products',
  authenticate,
  authorize(['admin']),
  (req, res) => productController.createProduct(req, res)
);

router.get(
  '/products',
  authenticate,
  (req, res) => productController.listProducts(req, res)
);

router.get(
  '/products/:id',
  authenticate,
  (req, res) => productController.getProductById(req, res)
);

router.put(
  '/products/:id',
  authenticate,
  authorize(['admin']),
  (req, res) => productController.updateProduct(req, res)
);

router.delete(
  '/products/:id',
  authenticate,
  authorize(['admin']),
  (req, res) => productController.deleteProduct(req, res)
);

export { router };