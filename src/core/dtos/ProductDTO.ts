export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: string;
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
  category_id: string;
  created_at: string;
  updated_at: string;
}