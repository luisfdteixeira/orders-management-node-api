import { IUserRepository } from '../ports/repositories/IUserRepository';
import { IAuthService } from '../ports/services/IAuthService';

export class AuthUseCases {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    return await this.authService.signInWithEmailAndPassword(email, password);
  }

  async register(data: { email: string; password: string; name?: string; phone?: string }) {
    const { email, password, name, phone } = data;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const createdUser = await this.authService.createUser(email, password, name, phone);

    await this.userRepository.create({
      id: createdUser.uid,
      email: createdUser.email,
      name: createdUser.name || name || null,
      phone: createdUser.phone || phone || null,
      role: 'user',
    });

    return createdUser;
  }
}