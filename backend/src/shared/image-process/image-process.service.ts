import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageProcessService {
  private readonly logger = new Logger(ImageProcessService.name);

  async compress(buffer: Buffer, mimeType: string) {
    try {
      const image = sharp(buffer).rotate();
      switch (mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
          return await image.jpeg({ quality: 75 }).toBuffer();
        case 'image/png':
          return await image.png({ compressionLevel: 0 }).toBuffer();
        case 'image/webp':
          return await image.webp({ quality: 75 }).toBuffer();
        default:
          return buffer;
      }
    } catch (error) {
      this.logger.error('Image compression failed', error);
      return buffer;
    }
  }

  async resize(buffer: Buffer, maxWidth: number, maxHeight: number) {
    return sharp(buffer)
      .resize(maxWidth, maxHeight, { fit: 'inside' })
      .toBuffer();
  }
}
