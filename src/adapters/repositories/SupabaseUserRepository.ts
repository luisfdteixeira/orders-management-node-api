import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../db/database.types';
import { IUserRepository, UserRecord } from '../../core/ports/repositories/IUserRepository';

type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

export class SupabaseUserRepository implements IUserRepository {
  constructor(private supabaseClient: SupabaseClient<Database>) {}

  private mapToDomain(row: UserRow): UserRecord {
    return {
      id: row.id,
      email: row.email,
      name: row.name || null,
      phone: row.phone || null,
      role: row.role || 'user',
    };
  }

  async create(data: UserRecord): Promise<UserRecord> {
    if (!data.id) {
      console.log('Firebase UID is required to create a user');
      throw new Error('Firebase UID is required to create a user');
    }

    const insertData: UserInsert = {
      id: data.id,
      email: data.email,
      name: data.name || null,
      phone: data.phone || null,
      role: data.role || 'user',
    };

    const { data: created, error } = await this.supabaseClient
      .from('users')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<UserRecord | null> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error finding user: ${error.message}`);
    }

    return data ? this.mapToDomain(data) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }

    return data ? this.mapToDomain(data) : null;
  }
}
