import { IImageUploadService } from '../../core/ports/services/IImageUploadService';
import { env } from '../../config/env';

export class ImgBBImageUploadService implements IImageUploadService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.imgbb.com/1';

  constructor() {
    if (!env.imgbbApiKey) {
      const errorMessage = 'IMGBB_API_KEY not defined in the .env file';
      console.log('Error: ' + errorMessage);
      throw new Error(errorMessage);
    }

    this.apiKey = env.imgbbApiKey;
  }

  async uploadImage(imageData: string | Buffer, filename?: string): Promise<string> {
    try {
      const base64Image = typeof imageData === 'string' 
        ? imageData 
        : imageData.toString('base64');

      const formData = new FormData();
      formData.append('image', base64Image);
      if (filename) {
        formData.append('name', filename);
      }

      console.log('Uploading image to ImgBB with filename:', filename);

      const response = await fetch(
        `${this.baseUrl}/upload?key=${this.apiKey}`,
        { method: 'POST', body: formData }
      );

      console.log('Response of image upload:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro no upload: ${errorData.error?.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('Erro ao fazer upload para ImgBB:', error);
      throw new Error('Falha no upload da imagem');
    }
  }
}