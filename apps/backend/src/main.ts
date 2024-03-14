import path from 'path';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const config: ConfigService = app.get(ConfigService);

  const originUrl = config.get('APP_ORIGIN_URL');
  const validOrigins = (config.get('CORS_ORIGINS') ?? '').split(',');

  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: validOrigins.length > 0 ? validOrigins : originUrl,
    credentials: true,
  });

  // Remove unecessary header
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
    })
  );

  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Run
  await app.listen(parseInt(config.get('PORT')!));
}

bootstrap().finally();
