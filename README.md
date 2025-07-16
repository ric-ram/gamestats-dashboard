[![CI](https://github.com/ric-ram/gamestats-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/ric-ram/gamestats-dashboard/actions/workflows/ci.yml)

# GameStats Dashboard

A real-time analytics dashboard for game events. Ingesting Kafka streams, persisting raw events in MariaDB, aggregating with Redis, and visualizing live metrics in Next.js.

## Overview

GameStats Dashboard lets you track player activities (logins, level completions, card draws, etc) in real time.

- **Backend:** NestJS Kafka consumer, TypeORM (MariaDB), Redis cache
- **Frontend:** Next.js with live charts (Recharts)
- **Dev Environment:** Docker Compose for Kafka, MariaDB, and the app (auto-rebuild on code changes)

At this stage, only the /produce-and-save endpoint exists to demonstrate end-to-end ingestion and persistence. The frontend dashboard and additional API endpoints will be added in upcoming milestones.

## Prerequisites

- Docker & Docker Compose installed
- Node.js v22.7.0 & npm (for building images)
- GitHub repository clone

## Installation

1. Clone the repo
    ```bash
    git clone https://github.com/your-org/GameStats-Dashboard.git
    cd GameStats-Dashboard
    ```
2. Copy environment variables
    ```bash
    cp .env.example .env
    # Edit .env to set your DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_SYNC
    ```

## Development Environment

We use Docker Compose so you don’t need npm run start:dev locally — containers watch for changes:

```bash
docker-compose up --build -d
```

- Backend (NestJS) → http://localhost:3001
- Kafka CLI tools, MariaDB are all available as services

## Running Migrations

All database migrations are managed from the monorepo root. There are no dedicated scripts in the backend workspace. Use the following commands from the project root:

```bash
# Generate a new migration (TypeORM will detect changes):
npm run migrate:generate -n <MigrationName>

# Run pending migrations:
npm run migrate:run
```

This ensures migrations apply consistently across all environments. After running migrations, your backend container will have an up-to-date schema.

## Usage

- **Produce & Save an Event**:

```bash
curl http://localhost:3001/produce-and-save
```

- Response:

```bash
"Produced event and saved with id <uuid>"
```

Future endpoints will be made available

## Testing

Backend unit and e2e tests run against a test database:

```bash
docker-compose exec backend npm test
```

## Roadmap

- [ ] Define and apply database schema with TypeORM migrations
- [ ] Implement Redis-based real-time aggregations
- [ ] Secure Data API, exposing secure REST endpoints
- [ ] Implement Live Dashboard using Next.js
- [ ] CI/CD Workflows & Testing for backend and frontend
- [ ] Production Deployment & Observability

## Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m "feat: add XYZ")
4. Push to your branch (git push origin feature/your-feature)
5. Open a Pull Request

Please follow our coding standards (ESLint, Prettier) and commit message guidelines.

## License

MIT © Ricardo Ramos
