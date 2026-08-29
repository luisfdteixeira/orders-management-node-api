import { Request, Response } from 'express';
import { AuthUseCases } from '../../../core/use-cases/AuthUseCases';

export class AuthController {
  constructor(private authUseCases: AuthUseCases) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.authUseCases.login(email, password);

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: result.localId,
          email: result.email,
        },
        tokens: {
          idToken: result.idToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error: any) {
      const errorMap: Record<string, string> = {
        'EMAIL_NOT_FOUND': 'User not found',
        'INVALID_PASSWORD': 'Incorrect password',
        'USER_DISABLED': 'User disabled',
        'TOO_MANY_ATTEMPTS_TRY_LATER': 'Too many attempts. Try again later',
      };

      const message = errorMap[error.message] || error.message || 'Internal server error';
      res.status(401).json({ error: message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, phone } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.authUseCases.register({ email, password, name, phone });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: result.uid,
          email: result.email,
          name: result.name || name,
          phone: result.phone || phone,
        },
        tokens: {
          idToken: result.idToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error: any) {
      const errorMap: Record<string, string> = {
        EMAIL_EXISTS: 'This email is already in use',
        WEAK_PASSWORD: 'The password must be at least 6 characters long',
      };

      const message = errorMap[error.message] || error.message || 'Internal server error';
      console.log('Error during registration:', error);
      res.status(400).json({ error: message });
    }
  }
}