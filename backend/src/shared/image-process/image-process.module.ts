import { Module } from '@nestjs/common';
import { ImageProcessService } from './image-process.service';

@Module({
  providers: [ImageProcessService],
  exports: [ImageProcessService],
})
export class ImageProcessModule {}
