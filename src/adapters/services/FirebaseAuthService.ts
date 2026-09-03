import axios from 'axios';
import { auth } from '../../config/firebase';
import { IAuthService } from '../../core/ports/services/IAuthService';

export class FirebaseAuthService implements IAuthService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://identitytoolkit.googleapis.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<{
    idToken: string;
    refreshToken: string;
    email: string;
    localId: string;
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      return {
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
        email: response.data.email,
        localId: response.data.localId,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  }

  async createUser(email: string, password: string, name?: string, phone?: string): Promise<{
    uid: string;
    localId: string;
    email: string;
    name?: string;
    phone?: string;
    idToken: string;
    refreshToken: string;
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/accounts:signUp?key=${this.apiKey}`,
        {
          email,
          password,
          displayName: name,
          phoneNumber: phone,
          returnSecureToken: true,
        }
      );

      const uid = response.data.localId;

      await auth.setCustomUserClaims(uid, { role: 'user' });

      //adicionar usuário ao banco de dados supabase

      return {
        uid,
        localId: uid,
        email: response.data.email,
        name: response.data.displayName || name,
        phone: phone || response.data.phoneNumber,
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Error while trying to create user';
      throw new Error(errorMessage);
    }
  }

  async verifyToken(token: string): Promise<{ uid: string; email?: string; name?: string; role?: string }> {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken.role || 'user',
      };
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      throw new Error('Token inválido ou expirado');
    }
  }
}