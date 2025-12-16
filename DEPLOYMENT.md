# Deployment Guide

## Self-Host with Docker (Coolify)

The easiest way to self-host this application is using Docker with Coolify. This setup includes PostgreSQL and Redis out of the box.

### Prerequisites

- A server with [Coolify](https://coolify.io) installed
- Or Docker & Docker Compose for local/manual deployment

### Deploy to Coolify (Recommended)

1. **Add your repository** in Coolify:
   - Go to Projects → New Project → New Resource
   - Select "Private Repository (with GitHub App)" or "Public Repository"
   - Choose your repository and branch

2. **Select Docker Compose** as the build pack

3. **Assign a domain** to the `app` service in Coolify

4. **Configure GitHub OAuth** in Coolify's Environment Variables:
   ```bash
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```
   → [Create a GitHub OAuth App](https://github.com/settings/applications/new)

5. **Deploy** - Coolify auto-configures everything else:
   - `BETTER_AUTH_URL` → Generated from your domain
   - `BETTER_AUTH_SECRET` → Auto-generated secure password
   - `DATABASE_URL` → Auto-configured with secure password
   - Database migrations → Handled automatically by NuxtHub

> **Minimal config!** Only GitHub OAuth credentials needed. Thanks to [Coolify's Magic Variables](https://coolify.io/docs/knowledge-base/docker/compose#coolify-s-magic-environment-variables), all other secrets are auto-generated.

### Manual Docker Deployment

For manual deployment without Coolify:

```bash
# Clone the repository
git clone https://github.com/HugoRCD/nuxt-better-auth.git
cd nuxt-better-auth

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values

# Start all services
docker compose up -d
```

### Docker Architecture

```
┌─────────────────────────────────────────┐
│            Coolify Network              │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │  Nuxt   │──│ Postgres│  │  Redis  │  │
│  │  App    │  │  :5432  │  │  :6379  │  │
│  └─────────┘  └─────────┘  └─────────┘  │
└─────────────────────────────────────────┘
```

---

## Environment Variables

Copy these variables to your `.env` file for local development or add them to your hosting platform:

```bash
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database_name?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000" # Change to your production URL when deploying

# GitHub OAuth (optional - for social login)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Authentication Schema Management

This project uses Better Auth with custom database integration. When you modify the authentication configuration or need to generate the auth schema:

```bash
# Generate Better Auth schema from configuration
pnpm auth:schema
```

This command:
- Reads the Better Auth configuration from `server/utils/auth.ts`
- Generates the corresponding database schema in `server/database/schema/auth.ts`
- Automatically applies ESLint fixes to the generated code

**When to run this command:**
- After modifying Better Auth plugins or configuration
- When setting up the project for the first time
- Before creating new database migrations
- When integrating auth tables with custom tables

## Deploy to Vercel

### Step 1: Deploy to Vercel

1. Click the "Deploy with Vercel" button in the README
2. Connect your GitHub repository
3. Configure the required environment variables (you can add them later)
4. Deploy the application

### Step 2: Set up PostgreSQL Database

**Option 1: Neon Database (Recommended)**

1. Go to your Vercel dashboard
2. Navigate to your project
3. Click on the "Integrations" tab
4. Search for "Neon" and install the **Neon Database** integration
5. Follow the setup wizard to create a new database
6. Copy the PostgreSQL connection string provided by Neon

**Option 2: Other PostgreSQL providers**

You can use any PostgreSQL provider like Railway, Supabase, or your own PostgreSQL instance. Just make sure to get a valid PostgreSQL connection string.

### Step 3: Configure Environment Variables

1. In your Vercel project settings, go to "Environment Variables"
2. Add the following variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate a random string (use `openssl rand -base64 32`)
   - `BETTER_AUTH_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: (optional) Your GitHub OAuth credentials

## Troubleshooting

### Authentication Issues
- Verify `BETTER_AUTH_SECRET` is set and consistent
- Check `BETTER_AUTH_URL` matches your deployment URL
- Ensure GitHub OAuth credentials are correct (if using)

### Database Connection Issues
- Verify database URL format includes `?sslmode=require` for SSL connections
- Check if database allows connections from your deployment platform
- Ensure database user has proper permissions

### Docker/Coolify Issues

**Container won't start:**
```bash
# Check logs
docker compose logs app
docker compose logs db
docker compose logs redis
```

**Database connection refused:**
- Ensure PostgreSQL is healthy: `docker compose ps`
- The app waits for PostgreSQL to be ready before starting

**Reset everything:**
```bash
# Stop and remove all containers and volumes
docker compose down -v

# Rebuild and start fresh
docker compose up -d --build
```

**Health check failing:**
- The app exposes `/api/health` endpoint
- Ensure port 3000 is not blocked by firewall