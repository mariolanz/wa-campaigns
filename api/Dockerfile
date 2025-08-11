FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/* \    && npm install

FROM node:20-bookworm-slim AS builder
WORKDIR /app
# OpenSSL also needed during prisma generate
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \    && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate && npm run build && npm prune --omit=dev

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Ensure OpenSSL is present at runtime for Prisma engine
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl \    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node","dist/main.js"]
