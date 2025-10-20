import { Module } from '@nestjs/common';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { TokenRepository } from './token.repository';
import { SessionRepository } from './session.repository';

@Module({
  imports: [FileUploadModule],
  controllers: [UserController],
  providers: [UserRepository, UserService, TokenRepository, SessionRepository],
  exports: [UserRepository, TokenRepository, SessionRepository],
})
export class UserModule {}
