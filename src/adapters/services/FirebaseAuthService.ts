import axios from 'axios';
import { auth } from '../../config/firebase'; // Admin SDK já inicializado
import { IAuthService } from '../../core/ports/services/IAuthService';

export class FirebaseAuthService implements IAuthService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://identitytoolkit.googleapis.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Método para login com email e senha usando a REST API do Firebase.
   * Retorna o idToken, refreshToken e dados do usuário.
   */
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
      // Extrai a mensagem de erro do Firebase
      const errorMessage = error.response?.data?.error?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  }

  /**
   * Método para verificar um token ID usando o Firebase Admin SDK.
   * Retorna os dados decodificados do usuário.
   */
  async verifyToken(token: string): Promise<{ uid: string; email?: string; name?: string; role?: string }> {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        role: decodedToken.role || 'user', // Pega custom claims se existirem
      };
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      throw new Error('Token inválido ou expirado');
    }
  }
}