import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from '../portfolio/portfolio-store';

@Injectable()
export class EducationService {
  private readonly logger = new Logger(EducationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const cached = await this.redis.get('portfolio:education');
    if (cached) return cached;

    try {
      const items = await this.prisma.education.findMany({
        orderBy: { order: 'asc' },
      });
      if (items.length > 0) {
        await this.redis.set('portfolio:education', items, 3600);
        return items;
      }
    } catch {
      this.logger.warn('PostgreSQL offline, education served from persistent store.');
    }
    return portfolioStore.getStore().education;
  }

  async create(data: any) {
    const saved = portfolioStore.createEducation(data);

    try {
      const item = await this.prisma.education.create({
        data: {
          degree: data.degree,
          institution: data.institution,
          location: data.location,
          period: data.period,
          details: data.details,
          order: Number(data.order) || 0,
        },
      });
      await this.redis.invalidatePortfolioCache();
      return item;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); education saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return saved;
    }
  }

  async update(id: string, data: any) {
    const saved = portfolioStore.updateEducation(id, data);

    try {
      const updated = await this.prisma.education.update({
        where: { id },
        data: {
          degree: data.degree,
          institution: data.institution,
          location: data.location,
          period: data.period,
          details: data.details,
        },
      });
      await this.redis.invalidatePortfolioCache();
      return updated;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); education update saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return saved;
    }
  }

  async delete(id: string) {
    portfolioStore.deleteEducation(id);

    try {
      await this.prisma.education.delete({ where: { id } });
      await this.redis.invalidatePortfolioCache();
      return { success: true };
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); education delete saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return { success: true, deletedId: id };
    }
  }
}
