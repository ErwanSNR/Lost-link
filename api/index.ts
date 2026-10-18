import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { Reflector } from '@nestjs/core';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const expressApp = express();
let isAppInitialized = false;

async function bootstrapOnce() {
  if (isAppInitialized) return; // supaya nggak bootstrap ulang tiap request (cold start lebih cepat)

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('LostLink API')
    .setDescription('Dokumentasi REST API Platform Lost & Found Sekolah')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  isAppInitialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await bootstrapOnce();
  expressApp(req as any, res as any);
}