<div align="center">

# ⚡ Ritik Sondhi — Full-Stack Portfolio & System Architecture

An engineering-first, high-performance portfolio and system architecture visualizer built with **React 19, TypeScript, Vite, NestJS, PostgreSQL, Prisma, and Redis**.

[![CI/CD Pipeline](https://github.com/RitikSondhi420/ritik-sondhi-portfolio/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/RitikSondhi420/ritik-sondhi-portfolio/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E.svg?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748.svg?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D.svg?logo=redis&logoColor=white)](https://redis.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[Live Demo](#) • [Explore Architecture](#-system-architecture) • [Features](#-key-features) • [Getting Started](#-getting-started) • [Contact](#-contact)

</div>

---

## 📖 Overview

This repository hosts the source code for **Ritik Sondhi's** modern developer portfolio. Designed with microservice patterns, reactive state management, and real-time interactive widgets, this project demonstrates modern engineering practices including clean architecture, resilient fallbacks, JWT authentication, and fluid responsive design across all viewports.

---

## ✨ Key Features

### 🌓 Dual-Theme Engine & Dynamic Companion Avatars
- **🌿 Peaceful Zen Light Mode**: A soothing, eye-friendly mineral mist stone (`#f4f6f5`) and eucalyptus teal palette designed to eliminate harsh glare and eye strain.
  - Accompanied by **Aura**, the peaceful zen spirit companion with glowing halo, fluttering feather wings, and mindful developer quotes.
- **😈 Obsidian Cyberpunk Dark Mode**: Deep obsidian-purple palette with glowing crimson accents and sleek glassmorphism.
  - Accompanied by **Ignis**, the fiery chibi demon companion with glowing horns, bat wings, devil tail, flame crown, and cheeky developer humor.
- **Reactive Transformation**: Toggling themes instantly morphs the companion avatar and updates dialogue personas in real-time.

### 🤖 Interactive Agentic AI Copilot
- An in-app conversational assistant capable of answering questions regarding Ritik's tech stack, production experience, microservice architecture, and project accomplishments.

### 🏛️ Interactive Architecture Visualizer
- Visual topology map breaking down client tiers, API gateways, decoupled service layers, PostgreSQL database persistence, Redis cache invalidation, and CI/CD pipelines.

### 💼 Career Matrix & Bento Skills Grid
- Interactive timeline highlighting 3+ years of production experience, architectural achievements, and categorized competencies across Frontend, Backend, Databases, Cloud, and AI-assisted workflows.

### 🔐 Live Admin Control Center
- In-browser live editor with JWT authentication and secure backend synchronization (with zero-config offline fallback), allowing real-time profile, skill, and experience updates.

### 📱 100% Cross-Device Responsiveness
- Engineered from the ground up for mobile phones (320px–480px), tablets (768px–1024px), desktop laptops, and 4K displays with fluid `clamp()` typography and touch-optimized drawers.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Lucide React, Canvas Confetti, Modern CSS Variables |
| **Backend** | NestJS 10, Node.js, Express, TypeScript |
| **Database & Cache** | PostgreSQL, Prisma ORM, Redis (In-memory caching & session store) |
| **Authentication** | Passport.js, JWT, Bcrypt |
| **DevOps & Tooling** | Docker, Docker Compose, pnpm, ESLint, Git |

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Client Browser<br/>(React 19 + TypeScript + Vite)"]
    Gateway["API Gateway / Reverse Proxy<br/>(:3001/api)"]
    NestBackend["NestJS Microservice Layer<br/>(Portfolio, Auth, Inquiries)"]
    RedisCache["Redis In-Memory Cache<br/>(Aggregate Queries)"]
    PostgresDB[("PostgreSQL Database<br/>(Prisma ORM)")]

    Client -->|HTTP / REST + JWT| Gateway
    Gateway --> NestBackend
    NestBackend <-->|Read / Write Through| RedisCache
    NestBackend <-->|Prisma Client| PostgresDB
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) package manager
- (Optional) [Docker Desktop](https://www.docker.com/) for PostgreSQL & Redis containers

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/ritik-sondhi-portfolio.git
cd ritik-sondhi-portfolio
```

---

### 2. Frontend Setup
```bash
cd Frontend
pnpm install
pnpm dev
```
The client will be running at `http://localhost:5173`.

---

### 3. Backend Setup (Optional for Full Stack)
```bash
cd backend
pnpm install

# Configure your environment variables (.env)
# DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
# REDIS_URL="redis://localhost:6379"
# JWT_SECRET="your-secure-jwt-secret"

# Initialize Prisma schema and seed initial data
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed

# Start backend server
pnpm start:dev
```
The NestJS API will be running at `http://localhost:3001`.

> **Note:** The frontend is equipped with an automatic offline data fallback and can run independently even if the backend is not started.

---

## 📁 Repository Structure

```text
my_portfolio/
├── Frontend/                 # React 19 + TypeScript + Vite application
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── components/       # UI sections, Modals, Navbar, Companion
│   │   ├── context/          # PortfolioContext (State & Theme Engine)
│   │   ├── data/             # Portfolio dataset & type definitions
│   │   ├── services/         # API Client & JWT helpers
│   │   ├── App.tsx           # Main application shell
│   │   ├── App.css           # Responsive layout rules
│   │   └── index.css         # Dual-theme CSS variables (Light/Dark)
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # NestJS backend application
│   ├── prisma/               # Schema definitions & database seeds
│   ├── src/                  # Controllers, Modules, Services & DTOs
│   │   ├── architecture/     # Architecture topology endpoints
│   │   ├── auth/             # Authentication & JWT strategies
│   │   ├── experience/       # Career trajectory endpoints
│   │   ├── personal/         # Bio & contact endpoints
│   │   ├── portfolio/        # Aggregated cached portfolio endpoint
│   │   ├── redis/            # Redis caching service
│   │   └── skills/           # Technical skills endpoints
│   ├── Dockerfile
│   └── package.json
│
└── README.md                 # Project documentation
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/<your-username>/ritik-sondhi-portfolio/issues).

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Ritik Sondhi**  
- **Email:** [sondhiritik666@gmail.com](mailto:sondhiritik666@gmail.com)  
- **LinkedIn:** [linkedin.com/in/ritik-sondhi-113038422](https://linkedin.com/in/ritik-sondhi-113038422)  
- **Location:** Nadaun, Himachal Pradesh, India *(Open to immediate relocation)*

