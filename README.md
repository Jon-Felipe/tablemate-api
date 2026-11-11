# TableMate API

A NestJS REST API for user authentication, restaurant discovery and management, and restaurant menus.

## Features

- Register customers and log in with email and password.
- Hash passwords with Argon2 and issue JWT access tokens.
- Browse restaurants and menus.
- Allow restaurant staff to manage their own restaurants and menu items; admins can manage all restaurants and menus.
- Validate request bodies and reject properties that are not part of the corresponding DTO.

## Technology

- Node.js and TypeScript
- NestJS 12
- JWT authentication and Argon2 password hashing
- `class-validator` and `class-transformer`
- Vitest and Supertest
- Oxlint and Prettier

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install

```bash
git clone <repository-url>
cd tablemate-api
npm install
```

### Configure

Create a `.env` file in the project root:

```env
JWT_SECRET=replace-with-a-long-random-secret
PORT=3000
```

`JWT_SECRET` is required. `PORT` is optional and defaults to `3000`. Keep secrets out of source control.

### Run

```bash
# Development with watch mode
npm run start:dev

# Build and run the production output
npm run build
npm run start:prod
```

The API is served under `http://localhost:3000/api/v1` by default. CORS is enabled.

## API

All routes below are relative to `/api/v1`. Protected routes require an `Authorization: Bearer <access-token>` header.

### Authentication and users

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/users` | Public | Register a customer |
| `POST` | `/users/login` | Public | Log in and receive an access token |
| `GET` | `/users` | Public | List users (password hashes are omitted) |
| `GET` | `/users/me` | Authenticated | Get the current user |
| `GET` | `/users/:id` | Authenticated | Get a user by ID |

Registration requires a name, valid email, and password of at least 12 characters. New registrations are assigned the `CUSTOMER` role.

Example registration:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "password": "a-long-password"
}
```

Login returns an `accessToken`. Tokens expire after 15 minutes.

### Restaurants

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/restaurants` | Public | List restaurants |
| `GET` | `/restaurants/:id` | Public | Get a restaurant |
| `GET` | `/restaurants/:id/menu` | Public | Get a restaurant menu |
| `POST` | `/restaurants` | Staff or admin | Create a restaurant |
| `PATCH` | `/restaurants/:id` | Owner staff or admin | Update a restaurant |
| `DELETE` | `/restaurants/:id` | Owner staff or admin | Delete a restaurant (returns `204`) |

Restaurant creation requires `name`, `imageUrl`, `description`, `cuisine`, `address`, and `city`. The creator is recorded as the owner. Staff may update or delete only their own restaurants; admins may manage any restaurant.

### Menus and menu items

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/restaurants/:restaurantId/menus` | Public | Get the restaurant menu |
| `GET` | `/restaurants/:restaurantId/menus/categories/:categoryId/items/:menuItemId` | Public | Get a menu item |
| `POST` | `/restaurants/:restaurantId/menus/categories/:categoryId/items` | Owner staff or admin | Add an item to a category |
| `PATCH` | `/restaurants/:restaurantId/menus/categories/:categoryId/items/:menuItemId` | Owner staff or admin | Update a menu item |
| `DELETE` | `/restaurants/:restaurantId/menus/categories/:categoryId/items/:menuItemId` | Owner staff or admin | Delete a menu item |

Menu item creation requires `name`, `description`, `imageUrl`, and a non-negative `price` (up to two decimal places). Update routes accept any subset of the corresponding create fields.

### Responses and validation

Successful responses generally use this shape:

```json
{
  "statusCode": 200,
  "message": "Restaurants retrieved successfully",
  "data": []
}
```

The delete-restaurant route returns no response body (`204`). Invalid request bodies and other failures are reported with the appropriate HTTP error status.

## Data and access notes

The current repositories store data in memory and include sample restaurants, menus, and users. Changes made while the server is running are not persisted and are lost when it restarts. User registration creates customer accounts; staff and admin access must be provisioned outside the public registration flow.

## Development

| Command | Description |
| --- | --- |
| `npm run start` | Start the application |
| `npm run start:dev` | Start in watch mode |
| `npm run start:debug` | Start in watch and debug mode |
| `npm run build` | Build the application |
| `npm run start:prod` | Run the built application |
| `npm run lint` | Lint source and test files |
| `npm run format` | Format source and test files |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:debug` | Run tests with the debugger |

## License

This project is marked `UNLICENSED` in `package.json`.
