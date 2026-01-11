# Obracubra

A modern Rubik's Cube timer application with persistent storage using PostgreSQL.

## Features

- High-precision timer with WCA-style controls
- Random scramble generation
- Statistics tracking (average of 5, average of 12)
- Persistent solve history with PostgreSQL
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Express, TypeScript, Node.js
- **Database**: PostgreSQL
- **UI Components**: Radix UI

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (recommended) OR PostgreSQL 12+ installed locally

## Database Setup

### Option 1: Using Docker Compose (Recommended)

The easiest way to run PostgreSQL locally:

```bash
# Start PostgreSQL in a Docker container
docker-compose up -d

# The database will be automatically created and ready to use
# Default credentials are already configured in .env.example
```

To stop the database:
```bash
docker-compose down
```

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL if you haven't already:
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download and install from https://www.postgresql.org/download/windows/
   ```

2. Create a database for the application:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE obracubra;

   # Exit psql
   \q
   ```

3. Configure environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit .env with your database credentials
   # Default values work for local PostgreSQL installation
   ```

## Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. The database schema will be created automatically on first run.

## Development

Start both the frontend and backend servers concurrently:

```bash
npm run dev
```

This will start:
- Frontend dev server at http://localhost:5000
- Backend API server at http://localhost:3001

## Building for Production

Build both frontend and backend:

```bash
npm run build
npm run build:server
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=obracubra
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
PORT=3001
```

## Database Schema

The application uses a single `solves` table:

```sql
CREATE TABLE solves (
  id UUID PRIMARY KEY,
  time INTEGER NOT NULL,           -- Time in milliseconds
  scramble TEXT NOT NULL,          -- Cube scramble sequence
  timestamp TIMESTAMPTZ NOT NULL,  -- When solve was completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

- `GET /api/solves` - Get all solves
- `POST /api/solves` - Create a new solve
- `DELETE /api/solves/:id` - Delete a solve by ID
- `DELETE /api/solves` - Delete all solves
- `GET /health` - Health check endpoint

## Project Structure

```
obracubra/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── server/                # Backend source code
│   ├── index.ts          # Express server entry point
│   ├── db.ts             # Database connection and initialization
│   ├── routes/           # API route handlers
│   └── tsconfig.json     # Server TypeScript configuration
└── package.json          # Dependencies and scripts
```

## License

MIT
