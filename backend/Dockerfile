FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

# TODO (Fase 2): diferenciar CMD de dev (tsx watch) e produção (build + start).
CMD ["npm", "run", "dev"]
