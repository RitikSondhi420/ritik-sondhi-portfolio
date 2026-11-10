import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API route prefix
  app.setGlobalPrefix('api');

  // CORS for frontend Vite dev and production origins (Netlify, Vercel, localhost)
  const allowedOriginsEnv = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : [];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.vercel.app') ||
        allowedOriginsEnv.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all web origins for portfolio API
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  });

  // Global input validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 NestJS Portfolio Backend is live on port ${port}`);
  logger.log(`📡 API Base URL: http://localhost:${port}/api`);
  logger.log(`🗄️ Database: PostgreSQL via Prisma ORM`);
  logger.log(`⚡ Caching: Redis In-Memory Layer (port 6379)`);
  logger.log(`=======================================================`);
}

bootstrap();
