import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MemoryStoredFile } from 'nestjs-form-data';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { generateRandomString } from 'src/lib/generate-random-string';
import { ImageProcessService } from '../image-process/image-process.service';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly rootUploadDir = join(process.cwd(), 'uploads');

  constructor(private imageProcessService: ImageProcessService) {
    if (!existsSync(this.rootUploadDir)) {
      mkdirSync(this.rootUploadDir, { recursive: true });
      this.logger.log(`Created root upload directory: ${this.rootUploadDir}`);
    }
  }

  private ensureDirExists(dir: string) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      this.logger.log(`Created upload subdirectory: ${dir}`);
    }
  }

  async uploadSingleFile({
    file,
    subFolder = '',
    compress = true,
  }: {
    file: MemoryStoredFile;
    subFolder: string;
    compress?: boolean;
  }): Promise<{ url: string; filename: string }> {
    try {
      const targetDir = join(this.rootUploadDir, subFolder);
      this.ensureDirExists(targetDir);

      const uniqueName = `${generateRandomString(12)}-${file.originalName}`;
      const filePath = join(targetDir, uniqueName);

      let fileBuffer = file.buffer;
      if (compress && file.mimeType.startsWith('image/')) {
        fileBuffer = await this.imageProcessService.compress(
          file.buffer,
          file.mimeType,
        );
      }

      writeFileSync(filePath, fileBuffer);
      this.logger.log(`File uploaded: ${subFolder}/${uniqueName}`);

      return {
        url: `/uploads/${subFolder ? `${subFolder}/` : ``}${uniqueName}`,
        filename: uniqueName,
      };
    } catch (error) {
      this.logger.error(`Error uploading file`, error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async uploadMultipleFile(
    files: MemoryStoredFile[],
    subFolder = '',
  ): Promise<{ url: string; filename: string }[]> {
    const results: { url: string; filename: string }[] = [];
    for (const file of files) {
      const uploaded = await this.uploadSingleFile({ file, subFolder });
      results.push(uploaded);
    }
    return results;
  }

  deleteSingleFile(filename: string, subfolder = '') {
    try {
      const filePath = filename.startsWith('/')
        ? join(process.cwd(), filename)
        : join(this.rootUploadDir, subfolder, filename);

      if (existsSync(filePath)) {
        unlinkSync(filePath);
        this.logger.log(`Deleted file: ${filePath}`);
      } else {
        this.logger.warn(`File not found: ${filePath}`);
      }
    } catch (error) {
      this.logger.error('Error deleting file', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  deleteMultipleFile(filenames: string[], subfolder = '') {
    for (const filename of filenames) {
      this.deleteSingleFile(filename, subfolder);
    }
  }
}
