import { Request, Response } from 'express';
import { AuthUseCases } from '../../../core/use-cases/AuthUseCases';

export class AuthController {
  constructor(private authUseCases: AuthUseCases) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
        return;
      }

      const result = await this.authUseCases.login(email, password);

      res.status(200).json({
        message: 'Login realizado com sucesso',
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
        'EMAIL_NOT_FOUND': 'Usuário não encontrado',
        'INVALID_PASSWORD': 'Senha incorreta',
        'USER_DISABLED': 'Usuário desativado',
        'TOO_MANY_ATTEMPTS_TRY_LATER': 'Muitas tentativas. Tente novamente mais tarde',
      };

      const message = errorMap[error.message] || error.message || 'Erro interno no servidor';
      res.status(401).json({ error: message });
    }
  }
}