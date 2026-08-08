export interface IAuthService {
  signInWithEmailAndPassword(email: string, password: string): Promise<{
    idToken: string;
    refreshToken: string;
    email: string;
    localId: string;
  }>;
  verifyToken(token: string): Promise<{ uid: string; email?: string; name?: string; role?: string }>;
}