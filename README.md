![social-preview](./public/og.png)

> **⚠️** This repo is a fork of https://github.com/atinux/nuxthub-better-auth

# Nuxt x BetterAuth

A demo of using [BetterAuth](https://better-auth.com) with Nuxt and PostgreSQL. This template is designed to be deployed anywhere, with specific instructions for Vercel + Neon Database.

https://better-auth.hrcd.fr

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHugoRCD%2Fnuxt-better-auth&env=DATABASE_URL,BETTER_AUTH_SECRET,BETTER_AUTH_URL&envDescription=Required%20environment%20variables&envLink=https%3A%2F%2Fgithub.com%2FHugoRCD%2Fnuxt-better-auth%23environment-variables)

# TODO

- [x] OAuth not working (redirects to login page)
- [ ] Automatic migration
- [x] Connect notes with organizations
- [x] Default team on login
- [ ] Bug on inpersonate
- [x] Account change bug → Remain on other account's team
- [ ] Fix typescript user.role
- [x] Refresh bug in prod (disconnects user briefly)
- [x] Delete account
- [ ] Delete user default team when deleting account
- [x] Onboarding

## Features

- [BetterAuth](https://better-auth.com) for authentication with organizations support
- Server-Side rendering with Nuxt
- PostgreSQL database with [Drizzle ORM](https://orm.drizzle.team/)
- `useAuth()` Vue composable for easy authentication
- `serverAuth()` composable for accessing Better Auth instance on the server
- Deploy anywhere (Vercel, Netlify, Cloudflare, self-hosted)
- TypeScript support

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

Copy the `.env.example` file to `.env` and update the variables with your own values.

### Environment Variables

- `DATABASE_URL`: Your PostgreSQL connection string (use Neon Database for Vercel deployment)
- `BETTER_AUTH_SECRET`: A random string used by Better Auth for encryption and generating hashes
- `BETTER_AUTH_URL`: Your application URL (set to production URL when deploying)
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials (optional, see [create an OAuth application](https://github.com/settings/applications/new))
- `NUXT_UI_PRO_LICENSE`: Your Nuxt UI Pro license key (only required for production), purchase [here](https://ui.nuxt.com/pro)

### Database Setup

#### Option 1: Vercel + Neon Database (Recommended)

1. Deploy to Vercel using the deploy button above
2. In your Vercel dashboard, go to the Integrations tab
3. Install the **Neon Database** integration from the marketplace
4. Follow the setup to create a new database and get your `DATABASE_URL`
5. Add the `DATABASE_URL` to your Vercel environment variables

#### Option 2: Local Development with PostgreSQL

1. Install PostgreSQL locally or use a service like [Railway](https://railway.app) or [Supabase](https://supabase.com)
2. Create a database and get your connection string
3. Set the `DATABASE_URL` in your `.env` file

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Database Migrations

Generate migration files when you modify the schema:

```bash
pnpm db:generate
```

Run migrations to update your database:

```bash
pnpm db:migrate
```

## Production

Build the application for production:

```bash
pnpm build
```

## Deploy

### Deploy to Vercel (Recommended)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub repository
3. Add the required environment variables
4. Install the Neon Database integration for your database
5. Deploy!

After deployment, visit the `/api/migrate` endpoint to run database migrations.

### Database Migrations

Right now, we don't automatically run migrations on deployment. You can manually run them by visiting the `/api/migrate` endpoint after deploying.
