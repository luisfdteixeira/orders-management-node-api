export interface IAuthService {
  signInWithEmailAndPassword(email: string, password: string): Promise<{
    idToken: string;
    refreshToken: string;
    email: string;
    localId: string;
  }>;
  createUser(email: string, password: string, name?: string, phone?: string): Promise<{
    uid: string;
    localId: string;
    email: string;
    name?: string;
    phone?: string;
    idToken: string;
    refreshToken: string;
  }>;
  verifyToken(token: string): Promise<{ uid: string; email?: string; name?: string; role?: string }>;
}