import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  private readonly memoryCache = new Map<string, { value: string; expiresAt: number }>();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<number>('REDIS_PORT', 6379));
    const password = this.configService.get<string>('REDIS_PASSWORD', '');

    try {
      this.client = new Redis({
        host,
        port,
        password: password || undefined,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('⚠ Redis server offline. Operating in resilient in-memory fallback cache mode.');
            return null; // Stop retrying after 3 attempts
          }
          return Math.min(times * 1000, 3000);
        },
        maxRetriesPerRequest: 1,
        lazyConnect: true,
      });

      this.client.connect().then(() => {
        this.isConnected = true;
        this.logger.log(`✓ Connected to Redis Cache Layer at ${host}:${port}`);
      }).catch((err) => {
        this.isConnected = false;
        this.logger.warn(`⚠ Redis connection unestablished (${err.message}). In-memory cache fallback active.`);
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('✓ Redis connected and ready for caching operations');
      });
    } catch (err) {
      this.logger.warn(`⚠ Error initializing Redis client: ${err.message}. Fallback memory cache enabled.`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isConnected && this.client) {
        const data = await this.client.get(key);
        if (data) {
          return JSON.parse(data) as T;
        }
        return null;
      }
    } catch {
      // Fallback to memory
    }

    // In-memory fallback
    const cached = this.memoryCache.get(key);
    if (cached) {
      if (Date.now() > cached.expiresAt) {
        this.memoryCache.delete(key);
        return null;
      }
      return JSON.parse(cached.value) as T;
    }
    return null;
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    const serialized = JSON.stringify(value);

    try {
      if (this.isConnected && this.client) {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
        return;
      }
    } catch {
      // Fallback to memory
    }

    // In-memory fallback
    this.memoryCache.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    try {
      if (this.isConnected && this.client) {
        await this.client.del(key);
      }
    } catch {
      // Ignore
    }
    this.memoryCache.delete(key);
  }

  async invalidatePortfolioCache(): Promise<void> {
    this.logger.log('⚡ Invalidating portfolio cache in Redis due to data mutation');
    await this.del('portfolio:aggregate');
    await this.del('portfolio:personal');
    await this.del('portfolio:experiences');
    await this.del('portfolio:skills');
    await this.del('portfolio:architecture');
    await this.del('portfolio:education');
    await this.del('portfolio:mobility');
    await this.del('portfolio:languages');
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // Ignore on shutdown
      }
    }
  }
}
