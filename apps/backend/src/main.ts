import path from 'path';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const config: ConfigService = app.get(ConfigService);

  const originUrl = config.get<string>('APP_ORIGIN_URL');
  const validOrigins = (config.get<string>('CORS_ORIGINS') ?? '').split(',');

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

  app.use(cookieParser());

  // Run
  await app.listen(parseInt(config.get<string>('PORT')!));
}

bootstrap().finally();
