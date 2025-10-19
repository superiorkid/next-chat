import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerModule } from 'nestjs-pino';
import { auth } from './lib/auth';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './shared/database/database.module';
import { FileUploadModule } from './shared/file-upload/file-upload.module';
import { ImageProcessModule } from './shared/image-process/image-process.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({ context: 'HTTP' }),
        transport: { target: 'pino-pretty', options: { singleLine: true } },
      },
    }),
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    NestjsFormDataModule.config({ isGlobal: true }),
    FileUploadModule,
    UserModule,
    ImageProcessModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
