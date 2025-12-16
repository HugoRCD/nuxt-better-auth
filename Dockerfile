# ================================
# Stage 1: Base image with pnpm
# ================================
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# ================================
# Stage 2: Install dependencies
# ================================
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ================================
# Stage 3: Build the application
# ================================
FROM base AS build

# Build arguments for NuxtHub to use external PostgreSQL
ARG DATABASE_URL

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application with DATABASE_URL so NuxtHub uses PostgreSQL instead of pglite
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm build

# ================================
# Stage 4: Production runtime
# ================================
FROM node:22-alpine AS runtime

# Create non-root user for security
RUN addgroup --system --gid 1001 nuxt && \
    adduser --system --uid 1001 nuxt

WORKDIR /app

# Copy the built application
COPY --from=build --chown=nuxt:nuxt /app/.output ./.output

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Switch to non-root user
USER nuxt

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]
