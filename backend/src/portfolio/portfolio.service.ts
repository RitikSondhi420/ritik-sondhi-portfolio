import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { portfolioStore } from './portfolio-store';
import { CANONICAL_PORTFOLIO } from './default-portfolio';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getPortfolioData() {
    const CACHE_KEY = 'portfolio:aggregate';

    // 1. Check Redis Cache
    const cached = await this.redis.get<any>(CACHE_KEY);
    if (cached) {
      return cached;
    }

    // 2. Query PostgreSQL via Prisma
    try {
      const [personal, experiences, skillCategories, architectureNodes, education, mobility, languages] =
        await Promise.all([
          this.prisma.personal.findFirst(),
          this.prisma.experience.findMany({ orderBy: { order: 'asc' } }),
          this.prisma.skillCategory.findMany({
            include: {
              skills: { orderBy: { level: 'desc' } },
            },
            orderBy: { order: 'asc' },
          }),
          this.prisma.architectureNode.findMany({ orderBy: { order: 'asc' } }),
          this.prisma.education.findMany({ orderBy: { order: 'asc' } }),
          this.prisma.mobility.findFirst(),
          this.prisma.language.findMany({ orderBy: { createdAt: 'asc' } }),
        ]);

      if (!personal && experiences.length === 0) {
        // Database is empty or unseeded, serve persistent disk store
        const storeData = portfolioStore.getStore();
        await this.redis.set(CACHE_KEY, storeData, 3600);
        return storeData;
      }

      const store = portfolioStore.getStore();

      const compiledData = {
        personal: personal
          ? {
              ...personal,
              experienceYears: (personal as any).experienceYears || store.personal.experienceYears || '3+',
              metrics: (personal as any).metrics || store.personal.metrics || CANONICAL_PORTFOLIO.personal.metrics,
              languages: languages.length > 0 ? languages : store.personal.languages || CANONICAL_PORTFOLIO.personal.languages,
            }
          : store.personal,
        experiences:
          experiences.length > 0
            ? experiences.map((e) => ({
                id: e.id,
                company: e.company,
                role: e.role,
                period: e.period,
                location: e.location,
                type: e.type,
                summary: (e as any).summary || (Array.isArray(e.achievements) && e.achievements[0]) || '',
                achievements: Array.isArray(e.achievements) ? e.achievements : [],
                deliverables: Array.isArray(e.deliverables) ? e.deliverables : [],
                techStack: Array.isArray(e.techStack) ? e.techStack : [],
                architectureHighlights: (e as any).architectureHighlights || e.architecturePattern || '',
                architecturePattern: e.architecturePattern || '',
              }))
            : store.experiences,
        skillCategories: skillCategories.length > 0 ? skillCategories : store.skillCategories,
        architectureNodes:
          architectureNodes.length > 0
            ? architectureNodes.map((n) => {
                const patterns = (n as any).engineeringPatterns || (n as any).patterns || [];
                const icon = (n as any).icon || (n.id === 'client' ? 'client' : n.id === 'gateway' ? 'gateway' : n.id === 'service' ? 'service' : n.id === 'database' ? 'database' : 'cicd');
                return {
                  id: n.id,
                  title: n.title,
                  subtitle: n.subtitle,
                  icon,
                  metric: n.metric || 'Active',
                  metricLabel: n.metricLabel || 'Performance',
                  metrics: { label: n.metricLabel || 'Performance', value: n.metric || 'Active' },
                  description: n.description,
                  patterns,
                  engineeringPatterns: patterns,
                };
              })
            : store.architectureNodes,
        education: education.length > 0 ? education : store.education,
        mobility: mobility ? mobility : store.mobility,
      };

      // 3. Cache in Redis
      await this.redis.set(CACHE_KEY, compiledData, 3600);
      return compiledData;
    } catch (err: any) {
      this.logger.warn(`Database offline (${err?.message || err}). Serving latest persistent portfolio store.`);
      return portfolioStore.getStore();
    }
  }

  async resetPortfolioData() {
    this.logger.log('🔄 Resetting portfolio data to canonical resume specifications...');

    // 1. Reset disk store
    const resetStore = portfolioStore.resetToDefaults();

    // 2. Invalidate Redis cache
    await this.redis.del('portfolio:aggregate');

    // 3. Try to re-sync PostgreSQL if reachable
    try {
      // Re-seed personal
      await this.prisma.personal.upsert({
        where: { id: 'ritik-personal-primary' },
        update: {
          name: CANONICAL_PORTFOLIO.personal.name,
          title: CANONICAL_PORTFOLIO.personal.title,
          location: CANONICAL_PORTFOLIO.personal.location,
          relocation: CANONICAL_PORTFOLIO.personal.relocation,
          email: CANONICAL_PORTFOLIO.personal.email,
          phone: CANONICAL_PORTFOLIO.personal.phone,
          linkedin: CANONICAL_PORTFOLIO.personal.linkedin,
          summary: CANONICAL_PORTFOLIO.personal.summary,
        },
        create: {
          id: 'ritik-personal-primary',
          name: CANONICAL_PORTFOLIO.personal.name,
          title: CANONICAL_PORTFOLIO.personal.title,
          location: CANONICAL_PORTFOLIO.personal.location,
          relocation: CANONICAL_PORTFOLIO.personal.relocation,
          email: CANONICAL_PORTFOLIO.personal.email,
          phone: CANONICAL_PORTFOLIO.personal.phone,
          linkedin: CANONICAL_PORTFOLIO.personal.linkedin,
          summary: CANONICAL_PORTFOLIO.personal.summary,
        },
      });

      // Re-seed experiences
      for (const exp of CANONICAL_PORTFOLIO.experiences) {
        await this.prisma.experience.upsert({
          where: { id: exp.id },
          update: {
            company: exp.company,
            role: exp.role,
            period: exp.period,
            location: exp.location,
            type: exp.type,
            architecturePattern: exp.architectureHighlights,
            achievements: exp.achievements,
            deliverables: exp.deliverables,
            techStack: exp.techStack,
            order: exp.order,
          },
          create: {
            id: exp.id,
            company: exp.company,
            role: exp.role,
            period: exp.period,
            location: exp.location,
            type: exp.type,
            architecturePattern: exp.architectureHighlights,
            achievements: exp.achievements,
            deliverables: exp.deliverables,
            techStack: exp.techStack,
            order: exp.order,
          },
        });
      }

      // Re-seed architecture nodes
      for (const node of CANONICAL_PORTFOLIO.architectureNodes) {
        await this.prisma.architectureNode.upsert({
          where: { id: node.id },
          update: {
            title: node.title,
            subtitle: node.subtitle,
            metric: node.metric,
            metricLabel: node.metricLabel,
            description: node.description,
            patterns: node.patterns,
            order: node.order,
          },
          create: {
            id: node.id,
            title: node.title,
            subtitle: node.subtitle,
            metric: node.metric,
            metricLabel: node.metricLabel,
            description: node.description,
            patterns: node.patterns,
            order: node.order,
          },
        });
      }
    } catch {
      // Postgres may be offline, persistent disk store has already been reset
    }

    // 4. Prime cache with fresh reset store
    await this.redis.set('portfolio:aggregate', resetStore, 3600);

    return {
      success: true,
      message: 'Portfolio data reset to canonical resume specifications successfully',
      data: resetStore,
    };
  }

  getDefaultData() {
    return portfolioStore.getStore();
  }
}
