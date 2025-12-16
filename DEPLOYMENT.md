# Deployment Guide

## Deploy to Vercel

### Step 1: Deploy

1. Click the "Deploy with Vercel" button in the README
2. Connect your GitHub repository
3. Deploy the application

### Step 2: Set up PostgreSQL Database

**Option 1: Neon Database (Recommended)**

1. Go to your Vercel dashboard → Integrations
2. Install the **Neon Database** integration
3. Follow the setup wizard

**Option 2: Other providers**

Use any PostgreSQL provider (Railway, Supabase, etc.) and get a connection string.

### Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Your Vercel URL (e.g., `https://app.vercel.app`) |
| `GITHUB_CLIENT_ID` | Your GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub OAuth client secret |

---

## Self-Host with Docker (Coolify)

The easiest way to self-host this application is using Docker with Coolify. This setup includes PostgreSQL and Redis out of the box.

### Prerequisites

- A server with [Coolify](https://coolify.io) installed
- A [GitHub OAuth App](https://github.com/settings/applications/new) (required for authentication)

### Deploy to Coolify

1. **Add your repository** in Coolify:
   - Go to Projects → New Project → New Resource
   - Select "Private Repository (with GitHub App)" or "Public Repository"
   - Choose your repository and branch

2. **Select Docker Compose** as the build pack

3. **Assign a domain** to the `app` service

4. **Configure GitHub OAuth** in Coolify's Environment Variables:
   ```bash
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

5. **Deploy** - Everything else is auto-configured:
   - `BETTER_AUTH_URL` → Generated from your domain (via `SERVICE_URL_APP`)
   - `BETTER_AUTH_SECRET` → Auto-generated 64-bit secure password
   - `DATABASE_URL` → Auto-configured with secure password
   - Database migrations → Handled automatically by NuxtHub

> **Only 2 variables to configure!** Thanks to [Coolify's Magic Variables](https://coolify.io/docs/knowledge-base/docker/compose#coolify-s-magic-environment-variables), all secrets are auto-generated.

### How it works

The Docker image is pre-built via GitHub Actions with PostgreSQL available during build. This ensures NuxtHub uses the postgres-js driver instead of pglite.

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
