# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Docker - [Download & Install Docker](https://docs.docker.com/get-docker/).
- Docker Compose - [Download & Install Docker Compose](https://docs.docker.com/compose/install/).

## Downloading

```bash
git clone {repository URL}
cd nodejs2025Q2-service
```

## Running application with Docker (Recommended)

### Development Mode

1. Create `.env` file from example:
```bash
cp .env.example .env
```

2. Start the application with Docker Compose (with hot-reload):
```bash
docker-compose up --build
```

The application will start on port 4000 (or the port specified in your `.env` file) with hot-reload enabled.

3. To run in detached mode:
```bash
docker-compose up -d
```

4. To stop the application:
```bash
docker-compose down
```

5. To stop and remove volumes (database data):
```bash
docker-compose down -v
```

### Production Mode

1. Create `.env` file with production settings:
```bash
cp .env.example .env
# Edit .env and set BUILD_TARGET=production and TYPEORM_SYNCHRONIZE=false
```

2. Start the application with Docker Compose (production):
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

3. Run migrations:
```bash
docker-compose -f docker-compose.prod.yml exec app npm run migration:run
```

4. To stop the application:
```bash
docker-compose -f docker-compose.prod.yml down
```

## Running application locally (Alternative)

### Prerequisites for local run
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- PostgreSQL - [Download & Install PostgreSQL](https://www.postgresql.org/download/).

### Installing NPM modules

```bash
npm install
```

### Running application

```bash
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

## Security

To check for vulnerabilities:

```bash
npm run audit
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## Docker Commands

### View running containers
```bash
docker-compose ps
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild containers
```bash
docker-compose up --build
```

### Run database migrations
```bash
docker-compose exec app npm run migration:run
```

### Generate new migration
```bash
docker-compose exec app npm run migration:generate -- src/migrations/MigrationName
```

## Project Features

### Docker Configuration
- ✅ Multi-stage Dockerfile for optimized image size
- ✅ User-defined bridge network with custom subnet
- ✅ Auto-restart on crash (`restart: unless-stopped`)
- ✅ Hot-reload in development mode
- ✅ Persistent volumes for database and logs
- ✅ Health checks for database
- ✅ Separate development and production configurations

### Database & ORM
- ✅ PostgreSQL 16 Alpine
- ✅ TypeORM with migrations
- ✅ Entity relationships with decorators (@ManyToOne, @OneToMany)
- ✅ Foreign key constraints with CASCADE
- ✅ Database connection via environment variables
- ✅ Automatic migration execution on startup

### Security & Best Practices
- ✅ Non-root user in Docker container
- ✅ Environment variables for sensitive data
- ✅ Vulnerability scanning script (`npm run audit`)
- ✅ .dockerignore for smaller images
- ✅ Health checks and depends_on configuration

### Development Workflow
- ✅ Hot-reload with volume mounting
- ✅ Separate dev/prod Docker configurations
- ✅ Migration management scripts
- ✅ Linting and formatting
- ✅ CI/CD workflows (GitHub Actions)

## Environment Variables

See `.env.example` for all available environment variables:
- `PORT` - Application port (default: 4000)
- `BUILD_TARGET` - Docker build target (development/production)
- `POSTGRES_*` - Database connection settings
- `TYPEORM_SYNCHRONIZE` - Auto-sync entities (use `false` in production)
- `JWT_*` - JWT authentication settings

## Migrations

For detailed information about database migrations, see [MIGRATIONS.md](./MIGRATIONS.md).

## CI/CD

The project includes GitHub Actions workflows for:
- Docker image building and pushing
- Linting and testing
- Security audits

Configure Docker Hub credentials in GitHub Secrets:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
