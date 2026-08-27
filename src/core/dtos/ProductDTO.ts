export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_base64?: string;
  is_active?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image_base64?: string;
  is_active?: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}