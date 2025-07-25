# Menu API

A RESTful API service for managing restaurant menus, built with modern technologies and best practices.

## Technology Stack

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **MongoDB** - Database
- **Joi** - Data validation
- **Pino** - Logging
- **Jest** - Testing
- **Docker** - Containerization
- **Prometheus & Grafana** - Monitoring

## Getting Started

### Prerequisites

- Docker and Docker Compose
- pnpm (for local development)

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd api-challenge
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=8000
LOG_LEVEL=info
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
```

3. Start the application and its dependencies:
```bash
docker compose up -d
```

This will start:
- The API application on port specified in `.env`
- MongoDB on port 27017
- Prometheus for metrics collection
- Grafana dashboard on port 3333 (credentials: admin/admin)

### Development

To run the application locally:

```bash
pnpm install
pnpm start
```

### Testing

```bash
pnpm test
```

## Monitoring

- Grafana Dashboard: http://localhost:3333
- Prometheus: http://localhost:9090

