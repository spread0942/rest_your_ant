# --- Base image ---
FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y bash curl postgresql-client && rm -rf /var/lib/apt/lists/*


# --- Dependencies stage ---
FROM base AS deps
COPY package*.json ./
RUN npm ci

# --- Build stage ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production stage ---
FROM base AS production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY wait-for-postgres.sh ./wait-for-postgres.sh
RUN npm prune --production && chmod +x ./wait-for-postgres.sh
EXPOSE 3000
CMD ["./wait-for-postgres.sh", "db", "npm", "start"]

# --- Development stage ---
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 9229
CMD ["node", "--inspect=0.0.0.0:9229", "-r", "ts-node/register", "src/app.ts"]
