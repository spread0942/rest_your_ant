FROM node:18-alpine

# Install PostgreSQL client for wait script
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Make wait script executable
RUN chmod +x wait-for-postgres.sh

EXPOSE 3000

CMD ["./wait-for-postgres.sh", "db", "npm", "start"]
