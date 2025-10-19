import { Module } from '@nestjs/common';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [FileUploadModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
