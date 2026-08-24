import { Response } from 'express';
import  { ProductUseCases } from '../../../core/use-cases/ProductUseCases';
import { AuthRequest } from '../middlewares/auth';

export class ProductController {
  constructor(private productUseCases: ProductUseCases) {}

  async createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description, price, stock, image_base64 } = req.body;

      if (!name || price === undefined || stock === undefined) {
        res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios' });
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
        message: 'Produto criado com sucesso',
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

  async getProductById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await this.productUseCases.getProductById(id);
      res.json(product);
    } catch (error: any) {
      if (error.message === 'Produto não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async updateProduct(req: AuthRequest, res: Response): Promise<void> {
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
        message: 'Produto atualizado com sucesso',
        product,
      });
    } catch (error: any) {
      if (error.message === 'Produto não encontrado') {
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
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error: any) {
      if (error.message === 'Produto não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}