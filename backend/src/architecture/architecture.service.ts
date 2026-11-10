import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from '../portfolio/portfolio-store';

@Injectable()
export class ArchitectureService {
  private readonly logger = new Logger(ArchitectureService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll() {
    const cached = await this.redis.get('portfolio:architecture');
    if (cached) return cached;

    try {
      const nodes = await this.prisma.architectureNode.findMany({
        orderBy: { order: 'asc' },
      });
      if (nodes.length > 0) {
        await this.redis.set('portfolio:architecture', nodes, 3600);
        return nodes;
      }
    } catch {
      this.logger.warn('PostgreSQL offline, architecture served from persistent store.');
    }
    return portfolioStore.getStore().architectureNodes;
  }

  async update(id: string, data: any) {
    const saved = portfolioStore.updateArchitectureNode(id, data);

    try {
      const existing = await this.prisma.architectureNode.findUnique({ where: { id } });
      let result;
      if (!existing) {
        result = await this.prisma.architectureNode.create({
          data: {
            id,
            title: data.title,
            subtitle: data.subtitle,
            metric: data.metrics?.value || data.metric || 'Active',
            metricLabel: data.metrics?.label || data.metricLabel || 'Performance',
            description: data.description,
            patterns: data.engineeringPatterns || data.patterns || [],
            order: Number(data.order) || 0,
          },
        });
      } else {
        result = await this.prisma.architectureNode.update({
          where: { id },
          data: {
            title: data.title,
            subtitle: data.subtitle,
            metric: data.metrics?.value || data.metric || 'Active',
            metricLabel: data.metrics?.label || data.metricLabel || 'Performance',
            description: data.description,
            patterns: data.engineeringPatterns || data.patterns || [],
          },
        });
      }
      await this.redis.invalidatePortfolioCache();
      return result;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}); architecture tier saved to disk store.`);
      await this.redis.invalidatePortfolioCache();
      return saved;
    }
  }
}
