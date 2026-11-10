import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from '../portfolio/portfolio-store';

@Injectable()
export class MobilityService {
  private readonly logger = new Logger(MobilityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getMobility() {
    const cached = await this.redis.get('portfolio:mobility');
    if (cached) return cached;

    try {
      const mobility = await this.prisma.mobility.findFirst();
      if (mobility) {
        await this.redis.set('portfolio:mobility', mobility, 3600);
        return mobility;
      }
    } catch {
      this.logger.warn('PostgreSQL offline, mobility served from persistent store.');
    }
    return portfolioStore.getStore().mobility;
  }

  async updateMobility(dto: any) {
    const saved = portfolioStore.updateMobility(dto);

    try {
      const existing = await this.prisma.mobility.findFirst();
      let updated;

      if (existing) {
        updated = await this.prisma.mobility.update({
          where: { id: existing.id },
          data: {
            status: dto.status,
            summary: dto.summary,
            highlights: dto.highlights,
            checklist: dto.checklist,
          },
        });
      } else {
        updated = await this.prisma.mobility.create({
          data: {
            status: dto.status || '● Immediate Relocation & Travel Ready',
            summary: dto.summary || '',
            highlights: dto.highlights || [],
            checklist: dto.checklist || [],
          },
        });
      }

      await this.redis.invalidatePortfolioCache();
      return updated;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); mobility saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return saved;
    }
  }
}
