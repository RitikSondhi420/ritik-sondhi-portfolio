import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from '../portfolio/portfolio-store';

@Injectable()
export class PersonalService {
  private readonly logger = new Logger(PersonalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getPersonal() {
    const cached = await this.redis.get('portfolio:personal');
    if (cached) return cached;

    try {
      const data = await this.prisma.personal.findFirst();
      if (data) {
        await this.redis.set('portfolio:personal', data, 3600);
        return data;
      }
    } catch {
      this.logger.warn('PostgreSQL offline, returning persistent personal profile.');
    }
    return portfolioStore.getStore().personal;
  }

  async updatePersonal(updateDto: any) {
    const saved = portfolioStore.updatePersonal(updateDto);

    try {
      const existing = await this.prisma.personal.findFirst();
      let updated;
      if (existing) {
        updated = await this.prisma.personal.update({
          where: { id: existing.id },
          data: {
            name: updateDto.name,
            title: updateDto.title,
            location: updateDto.location,
            relocation: updateDto.relocation,
            email: updateDto.email,
            phone: updateDto.phone,
            linkedin: updateDto.linkedin,
            summary: updateDto.summary,
          },
        });
      } else {
        updated = await this.prisma.personal.create({
          data: {
            name: updateDto.name || saved.name,
            title: updateDto.title || saved.title,
            location: updateDto.location || saved.location,
            relocation: updateDto.relocation || saved.relocation,
            email: updateDto.email || saved.email,
            phone: updateDto.phone || saved.phone,
            linkedin: updateDto.linkedin || saved.linkedin,
            summary: updateDto.summary || saved.summary,
          },
        });
      }
      await this.redis.invalidatePortfolioCache();
      return updated;
    } catch (err: any) {
      this.logger.warn(`PostgreSQL offline (${err?.message || err}). Saved permanently to portfolio disk store.`);
      await this.redis.invalidatePortfolioCache();
      return saved;
    }
  }
}
