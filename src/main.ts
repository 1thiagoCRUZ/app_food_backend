import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { validateEnv } from './shared/config/env.validation';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('Dentu Food API')
    .setDescription('API backend para o Dentu Food (Restaurantes e Clientes)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`[Bootstrap] Servidor rodando na porta ${process.env.PORT ?? 3000} em modo ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`[Swagger] Documentação disponível em http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();