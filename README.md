# Contract Management Backend

Backend API for a contract management assessment. The project is built with `Node.js`, `TypeScript`, `Express`, `Sequelize`, and `PostgreSQL`, and includes JWT auth, role-based access control, contract audit logs, pagination, and title search.

## Tech Stack

- `Node.js`
- `TypeScript`
- `Express`
- `Sequelize`
- `PostgreSQL`
- `express-validator`
- `JWT`

## Features

- User signup and login
- JWT-protected APIs
- Role-based access for `admin`, `bu`, and `viewer`
- Contract creation
- Contract listing with pagination and title search
- Contract detail with audit history
- Contract description editing only in `draft` or `pending_review`
- Contract status updates with audit logging
- Seed data for evaluation

## Prerequisites

- `Node.js` 18+ recommended
- `npm`
- `PostgreSQL` running locally or remotely

## Environment Setup

Create a `.env` file in the project root with values like:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=contractzy
DB_USER=postgres
DB_PASSWORD='Your_Password'

CORS_ORIGINS="http://localhost:4200"
JWT_SECRET=super-secret-jwt-key
```


## Installation

```bash
npm install
```

## Database Setup

1. Create the database:

```bash
npm run db:create
```

2. Run migrations:

```bash
npm run db:migrate
```

3. Seed sample data:

```bash
npm run db:seed
```

## Run the Project

For development:

```bash
npm run dev
```

For a production-style build:

```bash
npm run build
npm start
```

The API starts on:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

## Evaluation Accounts

After running the seed, these users are available:

- `admin@contractzy.com` / `Password123!`
- `bu@contractzy.com` / `Password123!`
- `viewer@contractzy.com` / `Password123!`

## Authentication

Login endpoint:

```http
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "admin@contractzy.com",
  "password": "Password123!"
}
```

Use the returned token as:

```http
Authorization: Bearer <token>
```

## Main API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Contracts

- `GET /api/contracts`
- `GET /api/contracts/:id`
- `POST /api/contracts`
- `PATCH /api/contracts/:id`
- `PATCH /api/contracts/:id/status`

## Contract Endpoint Notes

### List contracts

Supports:

- `page`
- `limit`
- `title`

Example:

```http
GET /api/contracts?page=1&limit=10&title=service
```

### Get contract by id

Returns the contract plus its audit log history.

### Create contract

Allowed roles:

- `admin`
- `bu`

### Edit contract description

Endpoint:

```http
PATCH /api/contracts/:id
Content-Type: application/json
```

Request body:

```json
{
  "description": "Updated description"
}
```

Rules:

- Only `admin` and `bu` can edit
- Only `description` can be edited
- Editing is allowed only when status is `draft` or `pending_review`
- Each successful update creates an audit log entry

### Update contract status

Endpoint:

```http
PATCH /api/contracts/:id/status
Content-Type: application/json
```

Request body:

```json
{
  "status": "approved"
}
```

Rules:

- Only `admin` and `bu` can update status
- Audit logs are created for status changes
- Non-admin users cannot modify contracts already in `approved` or `rejected`

## Seeded Contracts

The seed creates sample contracts in these states:

- `draft`
- `pending_review`
- `approved`

This makes it easy to evaluate:

- pagination and search
- contract detail and audit history
- allowed edit behavior
- status transition behavior
- role restrictions

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run db:create
npm run db:migrate
npm run db:migrate:undo
npm run db:seed
```

## Suggested Evaluation Flow

1. Run install, migration, and seed commands.
2. Log in as `admin`, `bu`, and `viewer`.
3. Call `GET /api/contracts` with pagination and search.
4. Open a contract by id and inspect audit history.
5. Edit the description of a contract in `draft` or `pending_review`.
6. Attempt to edit a contract in `approved` to confirm it is blocked.
7. Change contract status and verify a new audit entry is created.