import { Product, CreateProductInput, UpdateProductInput } from '../../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductInput): Promise<Product>;
  update(id: string, data: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}