export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type CreateProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductInput = Partial<CreateProductInput>;