import { IProductRepository } from '../ports/repositories/IProductRepository';
import { IImageUploadService } from '../ports/services/IImageUploadService';
import { Product, CreateProductInput, UpdateProductInput } from '../entities/Product';

export class ProductUseCases {
  constructor(
    private productRepository: IProductRepository,
    private imageUploadService: IImageUploadService
  ) {}

  async createProduct(
    productData: Omit<CreateProductInput, 'image_url'> & { imageBase64?: string }
  ): Promise<Product> {
    let imageUrl: string | undefined;

    if (productData.imageBase64) {
      try {
        const filename = `${productData.name.replace(/\s+/g, '_')}_${Date.now()}`;
        imageUrl = await this.imageUploadService.uploadImage(
          productData.imageBase64,
          filename
        );
      } catch (error: any) {
        throw new Error(`Falha no upload da imagem: ${error.message}`);
      }
    }

    const productInput: CreateProductInput = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      image_url: imageUrl,
      is_active: productData.is_active ?? true,
    };

    return await this.productRepository.create(productInput);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    return product;
  }

  async updateProduct(
    id: string,
    productData: Omit<UpdateProductInput, 'image_url'> & { imageBase64?: string }
  ): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error('Produto não encontrado');
    }

    let imageUrl = existing.image_url;

    if (productData.imageBase64) {
      try {
        const filename = `${productData.name?.replace(/\s+/g, '_') || 'product'}_${Date.now()}`;
        imageUrl = await this.imageUploadService.uploadImage(
          productData.imageBase64,
          filename
        );
      } catch (error: any) {
        throw new Error(`Falha no upload da nova imagem: ${error.message}`);
      }
    }

    const updateData: UpdateProductInput = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      image_url: imageUrl,
      is_active: productData.is_active,
    };

    return await this.productRepository.update(id, updateData);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    await this.productRepository.delete(id);
  }
}