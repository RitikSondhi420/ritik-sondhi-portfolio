import { PrismaClient } from '@prisma/client';
import { CANONICAL_PORTFOLIO } from '../src/portfolio/default-portfolio';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PostgreSQL Database with Ritik Sondhi Portfolio Specifications...');

  // 1. Seed Personal Profile
  await prisma.personal.upsert({
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

  // 2. Seed Admin User
  await prisma.adminUser.upsert({
    where: { username: 'ritik' },
    update: {
      passwordHash: '$Ritik5$Portfolio9$',
    },
    create: {
      username: 'ritik',
      passwordHash: '$Ritik5$Portfolio9$',
    },
  });

  // 3. Seed Experiences
  for (const exp of CANONICAL_PORTFOLIO.experiences) {
    await prisma.experience.upsert({
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

  // 4. Seed Skills
  for (const cat of CANONICAL_PORTFOLIO.skillCategories) {
    const categoryRecord = await prisma.skillCategory.upsert({
      where: { category: cat.category },
      update: { order: cat.order },
      create: { category: cat.category, order: cat.order },
    });

    for (const skill of cat.skills) {
      await prisma.skill.upsert({
        where: {
          categoryId_name: {
            categoryId: categoryRecord.id,
            name: skill.name,
          },
        },
        update: {
          level: skill.level,
          featured: skill.featured || false,
        },
        create: {
          categoryId: categoryRecord.id,
          name: skill.name,
          level: skill.level,
          featured: skill.featured || false,
        },
      });
    }
  }

  // 5. Seed Architecture Nodes
  for (const node of CANONICAL_PORTFOLIO.architectureNodes) {
    await prisma.architectureNode.upsert({
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

  // 6. Seed Education
  for (const edu of CANONICAL_PORTFOLIO.education) {
    await prisma.education.upsert({
      where: { id: edu.id },
      update: {
        institution: edu.institution,
        degree: edu.degree,
        location: edu.location,
        period: edu.period,
        details: edu.details,
        order: edu.order,
      },
      create: {
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        location: edu.location,
        period: edu.period,
        details: edu.details,
        order: edu.order,
      },
    });
  }

  // 7. Seed Mobility
  await prisma.mobility.upsert({
    where: { id: 'mobility-primary' },
    update: {
      status: CANONICAL_PORTFOLIO.mobility.status,
      summary: CANONICAL_PORTFOLIO.mobility.summary,
      highlights: CANONICAL_PORTFOLIO.mobility.highlights,
      checklist: CANONICAL_PORTFOLIO.mobility.checklist,
    },
    create: {
      id: 'mobility-primary',
      status: CANONICAL_PORTFOLIO.mobility.status,
      summary: CANONICAL_PORTFOLIO.mobility.summary,
      highlights: CANONICAL_PORTFOLIO.mobility.highlights,
      checklist: CANONICAL_PORTFOLIO.mobility.checklist,
    },
  });

  // 8. Seed Spoken Languages
  for (const lang of CANONICAL_PORTFOLIO.languages) {
    await prisma.language.upsert({
      where: { name: lang.name },
      update: { proficiency: lang.proficiency },
      create: lang,
    });
  }

  console.log('✅ PostgreSQL Database seeding completed successfully with canonical portfolio specifications!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
