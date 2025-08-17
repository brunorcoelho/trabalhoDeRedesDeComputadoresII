FROM node:18-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --no-audit --fund=false

COPY . .

RUN npm run build:frontend

FROM node:18-slim
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --production --no-audit --fund=false

COPY --from=build /usr/src/app .

EXPOSE 3000

CMD ["npm", "start"]