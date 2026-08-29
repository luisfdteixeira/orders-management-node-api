export interface UserRecord {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role?: string | null;
}

export interface IUserRepository {
  create(data: UserRecord): Promise<UserRecord>;
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
}
