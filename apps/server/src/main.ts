import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(import.meta.dirname, '..', 'public'));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('EduQuest API')
      .setDescription('API da plataforma de avaliações')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('api', app, document);
  app.use((request: Request, response: Response, next: NextFunction) => {
    if (request.method === 'GET' && request.accepts('html')) {
      response.sendFile(join(import.meta.dirname, '..', 'public', 'index.html'));
      return;
    }
    next();
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
