FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --production

ENV PORT 3000
EXPOSE 3000

ENTRYPOINT ["node", "build"]
