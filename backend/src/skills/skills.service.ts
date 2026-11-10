import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from '../portfolio/portfolio-store';

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const cached = await this.redis.get('portfolio:skills');
    if (cached) return cached;

    try {
      const categories = await this.prisma.skillCategory.findMany({
        include: {
          skills: { orderBy: { level: 'desc' } },
        },
        orderBy: { order: 'asc' },
      });
      if (categories.length > 0) {
        await this.redis.set('portfolio:skills', categories, 3600);
        return categories;
      }
    } catch {
      this.logger.warn('PostgreSQL offline, skills served from persistent store.');
    }
    return portfolioStore.getStore().skillCategories;
  }

  async addSkill(dto: { category: string; name: string; level: number; featured?: boolean }) {
    const saved = portfolioStore.addSkill(dto.category, {
      name: dto.name,
      level: Number(dto.level),
      featured: Boolean(dto.featured),
    });

    try {
      let category = await this.prisma.skillCategory.findUnique({
        where: { category: dto.category },
      });

      if (!category) {
        category = await this.prisma.skillCategory.create({
          data: {
            category: dto.category,
          },
        });
      }

      const existing = await this.prisma.skill.findUnique({
        where: {
          categoryId_name: {
            categoryId: category.id,
            name: dto.name,
          },
        },
      });

      let result;
      if (existing) {
        result = await this.prisma.skill.update({
          where: { id: existing.id },
          data: {
            level: Number(dto.level),
            featured: Boolean(dto.featured),
          },
        });
      } else {
        result = await this.prisma.skill.create({
          data: {
            categoryId: category.id,
            name: dto.name,
            level: Number(dto.level),
            featured: Boolean(dto.featured),
          },
        });
      }

      await this.redis.invalidatePortfolioCache();
      return result;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); skill saved to portfolio disk store.`);
      await this.redis.invalidatePortfolioCache();
      return { success: true, ...saved };
    }
  }

  async deleteSkill(categoryName: string, skillName: string) {
    portfolioStore.deleteSkill(categoryName, skillName);

    try {
      const category = await this.prisma.skillCategory.findUnique({
        where: { category: categoryName },
      });
      if (category) {
        await this.prisma.skill.deleteMany({
          where: {
            categoryId: category.id,
            name: skillName,
          },
        });
      }
      await this.redis.invalidatePortfolioCache();
      return { success: true };
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); skill delete saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return { success: true, deleted: skillName };
    }
  }
}
