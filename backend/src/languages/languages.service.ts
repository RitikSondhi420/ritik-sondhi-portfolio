import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from '../portfolio/portfolio-store';

@Injectable()
export class LanguagesService {
  private readonly logger = new Logger(LanguagesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const cached = await this.redis.get('portfolio:languages');
    if (cached) return cached;

    try {
      const languages = await this.prisma.language.findMany({
        orderBy: { createdAt: 'asc' },
      });
      if (languages.length > 0) {
        await this.redis.set('portfolio:languages', languages, 3600);
        return languages;
      }
    } catch {
      this.logger.warn('PostgreSQL offline, languages served from persistent store.');
    }
    return portfolioStore.getStore().languages;
  }

  async addLanguage(data: { name: string; proficiency: string }) {
    const saved = portfolioStore.addLanguage(data);

    try {
      const language = await this.prisma.language.upsert({
        where: { name: data.name },
        update: { proficiency: data.proficiency },
        create: { name: data.name, proficiency: data.proficiency },
      });
      await this.redis.invalidatePortfolioCache();
      return language;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); language saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return { success: true, ...saved };
    }
  }

  async deleteLanguage(name: string) {
    portfolioStore.deleteLanguage(name);

    try {
      await this.prisma.language.deleteMany({
        where: { name },
      });
      await this.redis.invalidatePortfolioCache();
      return { success: true };
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); language delete saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return { success: true, deleted: name };
    }
  }
}
