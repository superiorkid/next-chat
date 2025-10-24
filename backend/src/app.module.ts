import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerModule } from 'nestjs-pino';
import { JwtGuard } from './common/guards/jwt.guard';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ChatModule } from './modules/chat/chat.module';
import { PresenceModule } from './modules/presence/presence.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './shared/database/database.module';
import { FileUploadModule } from './shared/file-upload/file-upload.module';
import { ImageProcessModule } from './shared/image-process/image-process.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({ context: 'HTTP' }),
        transport: { target: 'pino-pretty', options: { singleLine: true } },
      },
    }),
    DatabaseModule,
    NestjsFormDataModule.config({ isGlobal: true }),
    FileUploadModule,
    ImageProcessModule,
    AuthenticationModule,
    UserModule,
    PresenceModule,
    ChatModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
