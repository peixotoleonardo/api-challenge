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

## API Documentation

### Available Endpoints

All endpoints are prefixed with `/api/v1/menu`

### Create Menu

Creates a new menu item. Optionally specify a `relatedId` to create a submenu.

```bash
# Create main menu
curl -X POST http://localhost:8000/api/v1/menu \
  -H "Content-Type: application/json" \
  -d '{"name": "Lunch Menu"}'

# Create submenu
curl -X POST http://localhost:8000/api/v1/menu \
  -H "Content-Type: application/json" \
  -d '{"name": "Appetizers", "relatedId": "menu-id-here"}'
```

### Delete Menu

Deletes a menu and all its submenus.

```bash
curl -X DELETE http://localhost:8000/api/v1/menu/menu-id-here
```

### Fetch All Menus

Retrieves all menus with their hierarchical structure.

```bash
curl http://localhost:8000/api/v1/menu
```

Response example:
```json
[
  {
    "id": "menu-1",
    "name": "Lunch Menu",
    "submenus": [
      {
        "id": "submenu-1",
        "name": "Appetizers"
      },
      {
        "id": "submenu-2",
        "name": "Main Courses"
      }
    ]
  }
]
```

