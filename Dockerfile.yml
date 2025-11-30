FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["sh", "-c", "npm run knex -- migrate:latest && node dist/server.cjs"]