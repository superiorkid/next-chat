import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerModule } from 'nestjs-pino';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './shared/database/database.module';
import { FileUploadModule } from './shared/file-upload/file-upload.module';
import { ImageProcessModule } from './shared/image-process/image-process.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guards/jwt.guard';
import { WebSocketModule } from './shared/websocket/websocket.module';

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
    WebSocketModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
