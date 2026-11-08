# TableMate API

A RESTful backend API built with **NestJS and TypeScript** for managing restaurant operations, menus, menu categories, menu items, and user authentication.

TableMate aims to provide a scalable foundation for a restaurant management platform where restaurant owners can manage their restaurant data and menus, while customers can discover restaurants and explore their offerings.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Planned Features](#planned-features)
- [Contributing](#contributing)
- [License](#license)

## Overview

TableMate API is a backend application designed to support restaurant management operations through a structured RESTful API.

The application follows a modular architecture using NestJS, separating controllers, services, repositories, DTOs, and entities to maintain a clean separation of concerns.

The current implementation focuses on user authentication, restaurant management, and restaurant menu functionality.

## Features

### User Management

- User registration.
- User login.
- Secure password hashing using Argon2.
- JWT-based authentication.
- Protected API endpoints.

### Restaurant Management

- Restaurant data management.
- Restaurant retrieval.
- Restaurant-related operations.

### Menu Management

- Retrieve restaurant menus.
- Retrieve individual menu items.
- Create menu items.
- Update menu items.
- Delete menu items.
- Organize menu items into categories.

### Security

- JWT authentication guard.
- Argon2 password hashing.
- DTO-based request validation.
- Protected menu modification endpoints.

## Tech Stack

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| Node.js           | JavaScript runtime        |
| TypeScript        | Programming language      |
| NestJS 12         | Backend framework         |
| @nestjs/config    | Application configuration |
| @nestjs/jwt       | JWT authentication        |
| Argon2            | Password hashing          |
| class-validator   | Request validation        |
| class-transformer | Object transformation     |
| Vitest 5          | Testing framework         |
| Supertest         | HTTP endpoint testing     |
| Oxlint            | Code linting              |
| Prettier 3        | Code formatting           |
| npm               | Package management        |

## Project Structure

```text
tablemate-api/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── restaurants/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── menus/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── menus.controller.ts
│   │   │   ├── menus.service.ts
│   │   │   ├── menus.repository.ts
│   │   │   └── menus.module.ts
│   │   ├── restaurants.controller.ts
│   │   ├── restaurants.service.ts
│   │   ├── restaurants.repository.ts
│   │   ├── restaurant-data.module.ts
│   │   └── restaurants.module.ts
│   └── users/
│       ├── dto/
│       ├── entities/
│       ├── types/
│       ├── jwt-auth.guard.ts
│       ├── password-hashing.service.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.repository.ts
│       └── users.module.ts
├── test/
│   └── app.e2e-spec.ts
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (LTS recommended).
- npm.
- Git.

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project directory:

```bash
cd tablemate-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
JWT_SECRET=your-secret-key
```

Add any additional environment variables required by the application's configuration.

**Important:** Never commit your `.env` file or expose production secrets in your repository.

## Running the Application

### Development

Start the application in watch mode:

```bash
npm run start:dev
```

### Standard

```bash
npm run start
```

### Debug Mode

```bash
npm run start:debug
```

### Production

Build the application:

```bash
npm run build
```

Start the production build:

```bash
npm run start:prod
```

## API Endpoints

The following endpoints represent the current menu API implementation.

### Menus

| Method | Endpoint                                                                    | Description                      | Authentication |
| ------ | --------------------------------------------------------------------------- | -------------------------------- | -------------- |
| GET    | `/restaurants/:restaurantId/menus`                                          | Retrieve restaurant menu         | No             |
| GET    | `/restaurants/:restaurantId/menus/categories/:categoryId/items/:menuItemId` | Retrieve an individual menu item | No             |

### Menu Items

| Method | Endpoint                                                                    | Description      | Authentication |
| ------ | --------------------------------------------------------------------------- | ---------------- | -------------- |
| POST   | `/restaurants/:restaurantId/menus/categories/:categoryId/items`             | Create menu item | Required       |
| PATCH  | `/restaurants/:restaurantId/menus/categories/:categoryId/items/:menuItemId` | Update menu item | Required       |
| DELETE | `/restaurants/:restaurantId/menus/categories/:categoryId/items/:menuItemId` | Delete menu item | Required       |

## Authentication

Protected endpoints require a valid JWT access token.

Include the token in the request headers:

```http
Authorization: Bearer <access_token>
```

Example:

```http
GET /restaurants/123/menus
Authorization: Bearer your-access-token
```

## API Response Format

Successful API responses follow a consistent structure.

Example:

```json
{
  "statusCode": 200,
  "message": "Restaurant menu retrieved successfully",
  "data": {}
}
```

Errors are communicated using appropriate HTTP status codes and NestJS HTTP exceptions.

## Testing

TableMate uses Vitest for unit and end-to-end testing, with Supertest for HTTP endpoint testing.

### Run Unit Tests

```bash
npm run test
```

### Watch Mode

```bash
npm run test:watch
```

### Run End-to-End Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

### Debug Tests

```bash
npm run test:debug
```

## Code Quality

The project uses Oxlint and Prettier to maintain code quality and consistent formatting.

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Planned Features

The following features are planned as the application evolves.

### Restaurant Management

- Restaurant operating hours.
- Restaurant availability and status.
- Restaurant ownership and staff management.

### Menu Management

- Menu CRUD operations.
- Menu category CRUD operations.
- Menu item availability management.
- Menu item pricing.
- Menu and category reordering.
- Support for multiple menus per restaurant.

### Order Management

- Customer order placement.
- Order tracking.
- Order status management.
- Order history.
- Order cancellation.

### Reservations

- Table reservations.
- Reservation management.
- Reservation confirmation and cancellation.

### Customer Experience

- Customer profiles.
- Restaurant reviews and ratings.
- Favourite restaurants.
- Notifications.

### Payments

- Payment processing.
- Payment status tracking.
- Order payment history.

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "feat: add your feature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

Please ensure that relevant tests are included and passing before submitting changes.

## License

This project is currently private and is not licensed for public redistribution.

See the repository's `package.json` for its current license designation (`UNLICENSED`).
