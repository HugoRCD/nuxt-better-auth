# Deployment Guide

## Environment Variables

Copy these variables to your `.env` file for local development or add them to your hosting platform:

```bash
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database_name?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secret-key-here"

# GitHub OAuth (optional - for social login)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Nuxt UI Pro License (optional - only required for production)
NUXT_UI_PRO_LICENSE="your-license-key"
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
   - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: (optional) Your GitHub OAuth credentials
   - `NUXT_UI_PRO_LICENSE`: (optional) Your Nuxt UI Pro license

### Step 4: Run Database Migrations

After deployment, visit `https://your-app.vercel.app/api/migrate` to run the database migrations.

## Troubleshooting

### Migration Issues
- Ensure `DATABASE_URL` is correctly set
- Visit `/api/migrate` endpoint after deployment
- Check logs for migration errors

### Authentication Issues
- Verify `BETTER_AUTH_SECRET` is set and consistent
- Ensure GitHub OAuth credentials are correct (if using)

### Database Connection Issues
- Verify database URL format includes `?sslmode=require` for SSL connections
- Check if database allows connections from your deployment platform
- Ensure database user has proper permissions 