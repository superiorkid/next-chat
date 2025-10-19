import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { ImageProcessModule } from '../image-process/image-process.module';

@Module({
  imports: [ImageProcessModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
