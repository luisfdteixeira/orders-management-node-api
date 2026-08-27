import { SupabaseClient } from '@supabase/supabase-js';
import { IProductRepository } from '../../core/ports/repositories/IProductRepository';
import { Product, CreateProductInput, UpdateProductInput } from '../../core/entities/Product';
import { Database } from '../db/database.types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export class SupabaseProductRepository implements IProductRepository {
  constructor(private supabaseClient: SupabaseClient<Database>) {}

  private mapToDomain(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      price: Number(row.price),
      stock: row.stock,
      image_url: row.image_url || undefined,
      is_active: row.is_active || false,
      created_at: new Date(row.created_at || new Date()),
      updated_at: new Date(row.updated_at || new Date())
    };
  }

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabaseClient
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Error listing products: ${error.message}`);
    return (data || []).map(this.mapToDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error finding product: ${error.message}`);
    }
    return data ? this.mapToDomain(data) : null;
  }

  async create(data: CreateProductInput): Promise<Product> {
    const insertData: ProductInsert = {
      name: data.name,
      description: data.description || null,
      price: data.price,
      stock: data.stock,
      image_url: data.image_url || null,
      is_active: data.is_active ?? true,
    };


    console.log('Inserting product into the database')
    const { data: created, error } = await this.supabaseClient
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.log('Error inserting product into the database');
      throw new Error(`Error creating product: ${error.message}`);
    }
    return this.mapToDomain(created);
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    const updateData: ProductUpdate = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.image_url !== undefined) updateData.image_url = data.image_url || null;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    const { data: updated, error } = await this.supabaseClient
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error updating product: ${error.message}`);
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Error deleting product: ${error.message}`);
  }
}