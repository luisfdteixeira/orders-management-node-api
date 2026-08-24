export interface IImageUploadService {
  uploadImage(imageData: string | Buffer, filename?: string): Promise<string>;
}