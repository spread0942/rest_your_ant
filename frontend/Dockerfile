# --- Base stage ---
FROM node:22-slim AS base
WORKDIR /app

# --- Dependencies stage ---
FROM base AS deps
COPY package*.json ./
RUN npm ci

# --- Build stage ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VUE_APP_API_ENDPOINT
ENV VUE_APP_API_ENDPOINT=$VUE_APP_API_ENDPOINT
RUN npm run build

# --- Production stage ---
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
# Optional: custom nginx.conf for routing / history mode
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# --- Development stage ---
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 8000
CMD ["npm", "run", "serve"]
