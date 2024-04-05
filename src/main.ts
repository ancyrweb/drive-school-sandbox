import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/infrastructure/nest/app-module.js';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  await app.listen(3000);
}

bootstrap();
