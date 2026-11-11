export const CANONICAL_PORTFOLIO = {
  personal: {
    name: 'Ritik Sondhi',
    title: 'Full Stack Developer',
    experienceYears: '3+',
    location: 'Nadaun, Himachal Pradesh, India',
    relocation: 'Open to immediate relocation and travel',
    email: 'sondhiritik666@gmail.com',
    phone: '+91 8219708977',
    linkedin: 'https://linkedin.com/in/ritik-sondhi-113038422',
    summary:
      'Full Stack Developer with 3+ years of experience in building scalable web applications, microservices, and interactive dashboards using React.js, Next.js, Node.js, NestJS, TypeScript, and PostgreSQL. Proficient in Redux Toolkit, REST API design, Prisma ORM, and Dockerized CI/CD workflows. Experienced in collaborating with cross-functional teams in agile environments, writing clean type-safe code, and optimizing database performance for high-traffic applications.',
    languages: [
      { name: 'English', proficiency: 'Professional' },
      { name: 'Hindi', proficiency: 'Native' },
    ],
    metrics: [
      { label: 'Experience', value: '3+ Years' },
      { label: 'Tech Stack', value: 'Full Stack' },
      { label: 'Projects Delivered', value: '10+' },
      { label: 'Code Quality', value: 'Production Ready' },
    ],
  },

  languages: [
    { name: 'English', proficiency: 'Professional' },
    { name: 'Hindi', proficiency: 'Native' },
  ],

  experiences: [
    {
      id: 'propertise',
      company: 'Propertise',
      role: 'Full Stack Developer',
      period: 'Mar 2025 to Aug 2026',
      location: 'Dubai (Remote)',
      type: 'Distributed Team',
      summary:
        'Worked as a Full Stack Developer in a distributed team across Dubai and India, delivering sprint tasks and production releases on schedule.',
      achievements: [
        'Built backend microservices and payment integration modules in NestJS and PostgreSQL to handle billing workflows.',
        'Integrated third-party payment gateways and webhook listeners with automated retry mechanisms and ledger records.',
        'Participated in daily standups, sprint reviews, and weekly code reviews to maintain clean code and strict TypeScript standards.',
        'Configured Docker containers and GitHub Actions CI/CD pipelines to automate build and deployment steps for staging.',
      ],
      deliverables: [
        'Built backend microservices and payment integration modules in NestJS and PostgreSQL to handle billing workflows.',
        'Integrated third-party payment gateways and webhook listeners with automated retry mechanisms and ledger records.',
        'Participated in daily standups, sprint reviews, and weekly code reviews to maintain clean code and strict TypeScript standards.',
        'Configured Docker containers and GitHub Actions CI/CD pipelines to automate build and deployment steps for staging.',
      ],
      techStack: ['NestJS', 'TypeScript', 'PostgreSQL', 'Docker', 'CI/CD', 'Payment Gateways', 'REST APIs'],
      architectureHighlights:
        'Designed a modular service layer to isolate payment gateway integrations from core database schemas, making third-party provider updates simple and reliable.',
      architecturePattern:
        'Designed a modular service layer to isolate payment gateway integrations from core database schemas, making third-party provider updates simple and reliable.',
      order: 1,
    },
    {
      id: 'primotech',
      company: 'Primotech',
      role: 'Software Engineer (MERN Stack)',
      period: 'Jun 2024 to Mar 2025',
      location: 'Mohali, Punjab',
      type: 'Hybrid',
      summary:
        'Worked on building real-time reporting dashboards and data analytics features for business teams to track sales and forecasting.',
      achievements: [
        'Developed responsive dashboard interfaces using React.js and TypeScript, improving data loading times by 35%.',
        'Integrated Power BI embedded reports with Microsoft SSO authentication for secure user access.',
        'Optimized complex SQL queries and database schemas using Prisma ORM to speed up report generation.',
        'Set up automated test runs and linting checks in GitHub Actions to catch bugs early in development.',
      ],
      deliverables: [
        'Developed responsive dashboard interfaces using React.js and TypeScript, improving data loading times by 35%.',
        'Integrated Power BI embedded reports with Microsoft SSO authentication for secure user access.',
        'Optimized complex SQL queries and database schemas using Prisma ORM to speed up report generation.',
        'Set up automated test runs and linting checks in GitHub Actions to catch bugs early in development.',
      ],
      techStack: ['React.js', 'Node.js', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Power BI Embedded', 'GitHub Actions'],
      architectureHighlights:
        'Implemented a secure reporting pipeline connecting Power BI embedded analytics with internal SQL databases using Microsoft SSO token authentication.',
      architecturePattern:
        'Implemented a secure reporting pipeline connecting Power BI embedded analytics with internal SQL databases using Microsoft SSO token authentication.',
      order: 2,
    },
    {
      id: 'braincave',
      company: 'BrainCave Software Pvt. Ltd',
      role: 'MERN Stack Developer',
      period: 'Oct 2023 to Mar 2024',
      location: 'West Bengal (Remote)',
      type: 'Remote',
      summary:
        'Developed core modules for an educational operations and timetable management web application.',
      achievements: [
        'Built interactive scheduling grids and calendar views in React.js for managing teacher and student timetables.',
        'Implemented conflict-checking logic to prevent overlapping room bookings and teacher allocations.',
        'Designed RESTful APIs using Node.js and Express.js, implementing JWT authentication and Role-Based Access Control (RBAC).',
        'Worked closely with frontend developers and QA engineers to resolve defects and ensure smooth deployments.',
      ],
      deliverables: [
        'Built interactive scheduling grids and calendar views in React.js for managing teacher and student timetables.',
        'Implemented conflict-checking logic to prevent overlapping room bookings and teacher allocations.',
        'Designed RESTful APIs using Node.js and Express.js, implementing JWT authentication and Role-Based Access Control (RBAC).',
        'Worked closely with frontend developers and QA engineers to resolve defects and ensure smooth deployments.',
      ],
      techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT', 'RBAC'],
      architectureHighlights:
        'Created an automated timetable scheduling engine with conflict validation and role-based permissions for admin and teacher accounts.',
      architecturePattern:
        'Created an automated timetable scheduling engine with conflict validation and role-based permissions for admin and teacher accounts.',
      order: 3,
    },
    {
      id: 'agami',
      company: 'Agami Technologies Pvt. Ltd',
      role: 'Full Stack Developer',
      period: 'Dec 2022 to Aug 2023',
      location: 'Greater Noida, UP',
      type: 'On-site / Hybrid',
      summary:
        'Worked on web dashboards and backend services for tracking loan applications and document verification workflows.',
      achievements: [
        'Built role-based loan application tracking dashboards in React.js, TypeScript, and Redux Toolkit.',
        'Integrated third-party Loan Origination System (LOS) APIs and webhook endpoints to sync application status in real time.',
        'Implemented automated email and SMS notification triggers based on loan stage transitions.',
        'Wrote API test cases in Postman and tracked sprint tasks in JIRA to deliver weekly deliverables on time.',
      ],
      deliverables: [
        'Built role-based loan application tracking dashboards in React.js, TypeScript, and Redux Toolkit.',
        'Integrated third-party Loan Origination System (LOS) APIs and webhook endpoints to sync application status in real time.',
        'Implemented automated email and SMS notification triggers based on loan stage transitions.',
        'Wrote API test cases in Postman and tracked sprint tasks in JIRA to deliver weekly deliverables on time.',
      ],
      techStack: ['React.js', 'TypeScript', 'Redux Toolkit', 'Node.js', 'REST APIs', 'Webhooks', 'Postman', 'Git'],
      architectureHighlights:
        'Built an event-driven webhook handler that captured loan status updates from external systems and updated user dashboard state in real time.',
      architecturePattern:
        'Built an event-driven webhook handler that captured loan status updates from external systems and updated user dashboard state in real time.',
      order: 4,
    },
  ],

  skillCategories: [
    {
      category: 'Frontend Development',
      order: 1,
      skills: [
        { name: 'React.js', level: 95, featured: true },
        { name: 'Next.js', level: 90, featured: true },
        { name: 'TypeScript', level: 95, featured: true },
        { name: 'Redux Toolkit', level: 90, featured: true },
        { name: 'JavaScript (ES6+)', level: 95, featured: true },
        { name: 'Tailwind CSS', level: 92, featured: true },
        { name: 'HTML5 / CSS3', level: 95 },
        { name: 'Material-UI', level: 85 },
      ],
    },
    {
      category: 'Backend & Microservices',
      order: 2,
      skills: [
        { name: 'Node.js', level: 92, featured: true },
        { name: 'NestJS', level: 90, featured: true },
        { name: 'Express.js', level: 90, featured: true },
        { name: 'REST APIs', level: 95, featured: true },
        { name: 'Microservices', level: 88, featured: true },
        { name: 'JWT & RBAC', level: 92, featured: true },
        { name: 'API Integration', level: 92 },
      ],
    },
    {
      category: 'Databases & ORM',
      order: 3,
      skills: [
        { name: 'PostgreSQL', level: 92, featured: true },
        { name: 'SQL & Query Optimization', level: 90, featured: true },
        { name: 'Prisma ORM', level: 92, featured: true },
        { name: 'MongoDB', level: 88, featured: true },
        { name: 'Redis Caching', level: 85 },
      ],
    },
    {
      category: 'DevOps & Tools',
      order: 4,
      skills: [
        { name: 'Docker', level: 88, featured: true },
        { name: 'GitHub Actions (CI/CD)', level: 90, featured: true },
        { name: 'Git & GitHub', level: 95, featured: true },
        { name: 'Postman', level: 90, featured: true },
        { name: 'JIRA & Agile', level: 90 },
        { name: 'Code Reviews', level: 95 },
      ],
    },
    {
      category: 'Core Competencies',
      order: 5,
      skills: [
        { name: 'System Architecture', level: 90, featured: true },
        { name: 'Clean Code Practices', level: 95, featured: true },
        { name: 'Problem Solving', level: 92, featured: true },
        { name: 'Team Collaboration', level: 95 },
      ],
    },
  ],

  education: [
    {
      id: 'mca',
      institution: 'Chitkara University',
      degree: 'Master of Computer Applications (MCA)',
      period: 'Aug 2021 to Aug 2023',
      location: 'Baddi, Himachal Pradesh',
      details:
        'Coursework in Advanced Software Engineering, Database Management Systems, Distributed Computing, and Web Technologies.',
      order: 1,
    },
    {
      id: 'bca',
      institution: 'Chitkara University',
      degree: 'Bachelor of Computer Applications (BCA)',
      period: 'Aug 2018 to Aug 2021',
      location: 'Baddi, Himachal Pradesh',
      details:
        'Coursework in Data Structures, Object-Oriented Programming with Java and C++, Web Development, and Relational Databases.',
      order: 2,
    },
  ],

  architectureNodes: [
    {
      id: 'client',
      title: 'Client Tier',
      subtitle: 'React 19, Next.js and Redux Toolkit',
      icon: 'client',
      metric: '60 FPS Grids',
      metricLabel: 'Performance',
      metrics: { label: 'Performance', value: '60 FPS Grids' },
      description:
        'Responsive frontend built with React 19, TypeScript, and Redux Toolkit. Features fluid mobile layouts, instant theme toggling, and clean state management.',
      patterns: [
        'Centralized state management with Redux Toolkit',
        'Responsive design using modern CSS variables and flex/grid layouts',
        'Strict TypeScript interfaces for type safety',
      ],
      engineeringPatterns: [
        'Centralized state management with Redux Toolkit',
        'Responsive design using modern CSS variables and flex/grid layouts',
        'Strict TypeScript interfaces for type safety',
      ],
      order: 1,
    },
    {
      id: 'gateway',
      title: 'API Gateway and Auth',
      subtitle: 'NestJS Guards and JWT Authentication',
      icon: 'gateway',
      metric: '< 2.4ms',
      metricLabel: 'Auth Latency',
      metrics: { label: 'Auth Latency', value: '< 2.4ms' },
      description:
        'Central API gateway handling incoming requests, CORS validation, rate limiting, and JWT token authentication before routing to service modules.',
      patterns: [
        'JWT authentication with secure token verification',
        'Role-Based Access Control (RBAC) guards',
        'Dynamic CORS configuration for production domains',
      ],
      engineeringPatterns: [
        'JWT authentication with secure token verification',
        'Role-Based Access Control (RBAC) guards',
        'Dynamic CORS configuration for production domains',
      ],
      order: 2,
    },
    {
      id: 'service',
      title: 'Service Abstraction Layer',
      subtitle: 'Decoupled Business Logic',
      icon: 'service',
      metric: 'Modular',
      metricLabel: 'Architecture',
      metrics: { label: 'Architecture', value: 'Modular' },
      description:
        'Modular backend services designed in NestJS to separate core business rules from external third-party APIs such as payment gateways and reporting tools.',
      patterns: [
        'Service and controller separation for clean code',
        'Idempotent webhook handlers with error handling',
        'Reusable service modules for easy maintenance',
      ],
      engineeringPatterns: [
        'Service and controller separation for clean code',
        'Idempotent webhook handlers with error handling',
        'Reusable service modules for easy maintenance',
      ],
      order: 3,
    },
    {
      id: 'database',
      title: 'Data Engine Tier',
      subtitle: 'PostgreSQL and Prisma ORM',
      icon: 'database',
      metric: 'Fast Indexing',
      metricLabel: 'Query Speed',
      metrics: { label: 'Query Speed', value: 'Fast Indexing' },
      description:
        'Relational database setup with PostgreSQL managed through Prisma ORM, featuring optimized indexes and automated migrations.',
      patterns: [
        'Normalized relational schema with foreign key constraints',
        'Prisma ORM connection pooling and type-safe queries',
        'Automated database migrations and seed scripts',
      ],
      engineeringPatterns: [
        'Normalized relational schema with foreign key constraints',
        'Prisma ORM connection pooling and type-safe queries',
        'Automated database migrations and seed scripts',
      ],
      order: 4,
    },
    {
      id: 'cicd',
      title: 'CI/CD Pipeline',
      subtitle: 'Docker and GitHub Actions',
      icon: 'cicd',
      metric: '100% Automated',
      metricLabel: 'Automation',
      metrics: { label: 'Automation', value: '100% Automated' },
      description:
        'Automated pipelines in GitHub Actions that run TypeScript type checks, build frontend and backend bundles, and prepare Docker images for deployment.',
      patterns: [
        'Automated build and typecheck validation on every push',
        'Multi-stage Docker builds for minimal container size',
        'Automated deployment triggers to cloud hosting',
      ],
      engineeringPatterns: [
        'Automated build and typecheck validation on every push',
        'Multi-stage Docker builds for minimal container size',
        'Automated deployment triggers to cloud hosting',
      ],
      order: 5,
    },
  ],

  mobility: {
    status: 'Immediate Relocation & Travel Ready',
    summary:
      'Available for immediate joining with zero notice period. Experienced in working with remote and hybrid teams across India and international time zones.',
    highlights: [
      'Open to relocation across India (Bengaluru, NCR, Hyderabad, Pune, Mohali)',
      'Open to relocation to Dubai / UAE and other international locations',
      'Experienced in remote agile team collaboration, sprint delivery, and code reviews',
    ],
    checklist: [
      'Immediate joining with zero notice period',
      'Experienced in agile sprint delivery and code reviews',
      'Available for hybrid or remote collaboration',
    ],
  },
};
