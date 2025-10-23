import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

export async function appConfig(app: INestApplication) {
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  ); // Transform is recomended configuration for avoind issues with arrays of files transformations

  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8000);
}
