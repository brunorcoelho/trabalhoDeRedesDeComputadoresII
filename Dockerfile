FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --no-audit --fund=false

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]