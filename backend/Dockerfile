FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

RUN chmod +x wait-for-postgres.sh

EXPOSE 3000

CMD ["./wait-for-postgres.sh", "db", "npm", "start"]
