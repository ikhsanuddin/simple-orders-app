<p align="center">
  <img src="docs/img/simple-order-app.png" width="320" style="max-width=100%;" alt="Simple order App Logo" />
</p>

<h1 align="center"> Simple Order App</h1>

  <p align="center">A full-stack order management application <br>built with <a href="http://nestjs.com" target="_blank">NestJS</a> (backend) and <a href="https://nextjs.org" target="_blank">Next.Js</a> (frontend), containerized with <a href="https://www.docker.com" target="_blank">Docker.</a></p>
    <p align="center">

# Simple Order App

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database via Mongoose
- **Node.js LTS** - Runtime environment

### Frontend
- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Simple CSS** - No UI frameworks

## Architecture

This application follows a **modular monolith** architecture with clear separation of concerns:

### Backend Architecture

The backend implements **MVC + Repository pattern**:

```
backend/src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── common/                    # Shared utilities
│   ├── filters/               # Exception filters
│   └── health.controller.ts   # Health check endpoint
├── modules/                   # Feature modules
│   ├── auth/                  # Authentication
│   │   ├── auth.controller.ts # HTTP layer
│   │   ├── auth.service.ts    # Business logic
│   │   └── dto/               # Data validation
│   ├── products/              # Product management
│   └── orders/                # Order management
└── database/mongo/
    ├── schemas/               # Mongoose schemas
    └── repositories/          # Data access layer
```

**Key Patterns:**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Abstract MongoDB operations
- **DTOs**: Validate incoming data with class-validator
- **Schemas**: Define data models with Mongoose

### Frontend Architecture

The frontend uses **Next.js App Router** with isolated API services:

```
frontend/
├── app/                       # App Router pages
│   ├── login/                 # Login page
│   ├── products/              # Product listing
│   ├── orders/                # Order history
│   │   └── new/               # Create order
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home redirect
├── services/                  # API integration
│   ├── auth.service.ts        # Authentication API
│   ├── products.service.ts    # Products API
│   └── orders.service.ts      # Orders API
├── components/                # Reusable UI components
└── styles/                    # CSS styling
```

## API Endpoints

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| GET    | `/health`            | Health check               |
| POST   | `/login`             | User authentication        |
| GET    | `/api/v1/products`   | List all products          |
| POST   | `/api/v1/orders`     | Create new order           |
| GET    | `/api/v1/orders`     | List all orders            |

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simple-order-app
   ```

2. **Run with Docker Compose**
   
   For production:
   ```bash
   docker-compose up
   ```
   
   For development with hot-reload:
   ```bash
   docker compose watch
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

### Demo Credentials

```
Email: admin@example.com
Password: admin123

Email: user@example.com
Password: user123
```
> *After sucessfuly running the seeders (seeder automaticly runs when spin up the backend)

## Development

### Backend Development

```bash
cd backend
pnpm install
cp .env.example .env
pnpm run start:dev
```

Backend runs on http://localhost:3000

### Frontend Development

```bash
cd frontend
pnpm install
cp .env.local.example .env.local
pnpm run dev
```

Frontend runs on http://localhost:3001

### MongoDB

When running locally without Docker:
```bash
# Make sure MongoDB is running
mongod --dbpath /your/data/path
```

### Docker Compose Auto-Seeding

The database is configured to automatically seed with initial users on first run when using Docker Compose.

#### How It Works

1. **Healthcheck**: MongoDB has a healthcheck that ensures it's fully ready before the backend starts
2. **Entrypoint Script**: The backend uses a custom entrypoint script that:
   - Waits for MongoDB to be accessible
   - Runs the database seeder
   - Starts the NestJS application
3. **Idempotent Seeding**: The seeder checks if users already exist, so it's safe to run multiple times

### Development with Docker Watch

For automatic hot-reload during development:

```bash
docker compose watch
```

This will:
- Sync source code changes in real-time
- Rebuild containers when package.json changes
- Keep development servers running with hot-reload

## Docker Services

The application consists of three Docker services:

1. **mongodb** - MongoDB 7 database
   - Port: 27017
   - Volume: `mongodb_data` (persistent storage)

2. **backend** - NestJS API server
   - Port: 3000
   - Depends on: mongodb

3. **frontend** - Next.js application
   - Port: 3001
   - Depends on: backend

## Project Structure

```
simple-order-app/
├── backend/               # NestJS API
├── frontend/              # Next.js app
├── docker-compose.yml     # Container orchestration
└── README.md             # This file
```

## Features

- ✅ User authentication
- ✅ Product catalog with search
- ✅ Shopping cart functionality
- ✅ Order creation with validation
- ✅ Order history tracking
- ✅ Responsive design
- ✅ Docker containerization
- ✅ Health check endpoint
- ✅ Input validation (DTOs)
- ✅ Centralized error handling
- ✅ Repository pattern
- ✅ Auto-seeded sample data

## Best Practices Implemented

1. **TypeScript** throughout for type safety
2. **DTO Validation** using class-validator
3. **Repository Pattern** for data access abstraction
4. **Modular Architecture** for maintainability
5. **Environment Configuration** for different environments
6. **Docker Multi-stage Builds** for optimized images
7. **Health Checks** for monitoring
8. **CORS Configuration** for security
9. **Error Handling** centralized filters
10. **Clean Code** with clear separation of concerns