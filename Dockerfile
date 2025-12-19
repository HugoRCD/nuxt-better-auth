# Stage 1: Base
FROM node:22.21.1-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Stage 3: Build
FROM base AS build
ARG DATABASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm build

# Stage 4: Runtime
FROM node:22.21.1-alpine AS runtime
RUN addgroup --system --gid 1001 nuxt && adduser --system --uid 1001 nuxt
WORKDIR /app
COPY --from=build --chown=nuxt:nuxt /app/.output ./.output
RUN mkdir -p .data && chown nuxt:nuxt .data

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

USER nuxt
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", ".output/server/index.mjs"]
