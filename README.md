# Expense Tracker Backend

A RESTful API for tracking personal expenses, built with Node.js, Express, and PostgreSQL. Features JWT-based authentication and full data isolation between users.

## Features

- **User Authentication** — Register and login with phone number and password, using bcrypt for password hashing
- **JWT Authorization** — Stateless token-based authentication protecting all expense routes
- **Expense Management** — Create, retrieve, and delete expenses
- **Date Filtering** — Retrieve expenses for a specific date via query parameters
- **Data Isolation** — Each user can only access and modify their own expenses, enforced at the query level

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (hosted on Supabase)
- **Authentication:** JWT (jsonwebtoken), bcrypt
- **Environment Management:** dotenv

## Architecture

The project follows a layered structure separating concerns:

```
src/
├── config/         # Database connection setup
├── controllers/    # Business logic for each route
├── middleware/      # JWT verification middleware
├── routes/          # Route definitions
├── app.js           # Express app configuration
└── server.js         # Server entry point
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT token |

### Expenses (Protected — requires Bearer token)

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/expenses` | Add a new expense |
| GET | `/expenses` | Get all expenses for the authenticated user |
| GET | `/expenses?date=YYYY-MM-DD` | Get expenses for a specific date |
| DELETE | `/expenses/:id` | Delete an expense (only if owned by the authenticated user) |

## Security Highlights

- Passwords are never stored in plain text — hashed using bcrypt before saving
- JWT tokens are required for all expense-related operations
- User identity is derived from the verified JWT token, never trusted from request body/params — preventing users from accessing or modifying another user's data
- Generic error messages on login failures (no distinction between "user not found" and "wrong password") to prevent user enumeration

