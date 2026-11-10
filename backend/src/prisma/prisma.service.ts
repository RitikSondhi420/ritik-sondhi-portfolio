import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✓ Successfully connected to PostgreSQL Database via Prisma ORM');
    } catch (error: any) {
      this.logger.warn(`⚠ Could not connect to PostgreSQL: ${error?.message || error}. Ensure Docker PostgreSQL container is active.`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected gracefully');
  }
}

export * from '@prisma/client';
