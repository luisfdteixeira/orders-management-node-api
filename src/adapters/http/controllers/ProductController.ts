import { Response } from 'express';
import  { ProductUseCases } from '../../../core/use-cases/ProductUseCases';
import { AuthRequest } from '../middlewares/auth';
import { CreateProductInput, UpdateProductInput } from '../../../core/dtos/ProductDTO';

export class ProductController {
  constructor(private productUseCases: ProductUseCases) {}

  async createProduct(
    req: AuthRequest<{}, {}, CreateProductInput>,
    res: Response
  ): Promise<void> {
    try {
      const { name, description, price, stock, image_base64 } = req.body;

      if (!name || price === undefined || stock === undefined) {
        res.status(400).json({ error: 'Name, price and stock are required' });
        return;
      }

      const product = await this.productUseCases.createProduct({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageBase64: image_base64,
        is_active: true,
      });

      res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listProducts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const products = await this.productUseCases.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req: AuthRequest<{ id: string }>, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await this.productUseCases.getProductById(id);
      res.json(product);
    } catch (error: any) {
      if (error.message === 'Product not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateProduct(req: AuthRequest<{id: string}, {}, UpdateProductInput>, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { name, description, price, stock, image_base64, is_active } = req.body;

      const product = await this.productUseCases.updateProduct(id, {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        imageBase64: image_base64,
        is_active,
      });

      res.json({
        message: 'Product updated successfully',
        product,
      });
    } catch (error: any) {
      if (error.message === 'Product not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.productUseCases.deleteProduct(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Product not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}