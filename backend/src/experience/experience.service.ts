import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from '../portfolio/portfolio-store';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const cached = await this.redis.get('portfolio:experiences');
    if (cached) return cached;

    try {
      const experiences = await this.prisma.experience.findMany({
        orderBy: { order: 'asc' },
      });
      if (experiences.length > 0) {
        await this.redis.set('portfolio:experiences', experiences, 3600);
        return experiences;
      }
    } catch {
      this.logger.warn('PostgreSQL offline, serving experiences from persistent store.');
    }
    return portfolioStore.getStore().experiences;
  }

  async create(data: any) {
    const saved = portfolioStore.createExperience(data);

    try {
      const created = await this.prisma.experience.create({ data: saved });
      await this.redis.invalidatePortfolioCache();
      return created;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); saved to portfolio disk store.`);
      await this.redis.invalidatePortfolioCache();
      return saved;
    }
  }

  async update(id: string, data: any) {
    const saved = portfolioStore.updateExperience(id, data);

    try {
      const updated = await this.prisma.experience.update({
        where: { id },
        data: {
          company: data.company,
          role: data.role,
          period: data.period,
          location: data.location,
          type: data.type,
          architecturePattern: data.architecturePattern,
          achievements: data.achievements,
          deliverables: data.deliverables,
          techStack: data.techStack,
        },
      });
      await this.redis.invalidatePortfolioCache();
      return updated;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); updated in portfolio disk store.`);
      await this.redis.invalidatePortfolioCache();
      return saved;
    }
  }

  async delete(id: string) {
    portfolioStore.deleteExperience(id);

    try {
      const deleted = await this.prisma.experience.delete({ where: { id } });
      await this.redis.invalidatePortfolioCache();
      return { success: true, deletedId: deleted.id };
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); removed from portfolio disk store.`);
      await this.redis.invalidatePortfolioCache();
      return { success: true, deletedId: id };
    }
  }
}
