import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PersonalModule } from './personal/personal.module';
import { ExperienceModule } from './experience/experience.module';
import { SkillsModule } from './skills/skills.module';
import { ArchitectureModule } from './architecture/architecture.module';
import { EducationModule } from './education/education.module';
import { MobilityModule } from './mobility/mobility.module';
import { LanguagesModule } from './languages/languages.module';
import { InquiriesModule } from './inquiries/inquiries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    PortfolioModule,
    PersonalModule,
    ExperienceModule,
    SkillsModule,
    ArchitectureModule,
    EducationModule,
    MobilityModule,
    LanguagesModule,
    InquiriesModule,
  ],
})
export class AppModule {}
