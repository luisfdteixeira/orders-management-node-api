import { IAuthService } from '../ports/services/IAuthService';

export class AuthUseCases {
  constructor(private authService: IAuthService) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    return await this.authService.signInWithEmailAndPassword(email, password);
  }
}