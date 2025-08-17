FROM node:18-slim
RUN apt-get update && apt-get install -y git
WORKDIR /usr/src/app
RUN git clone https://github.com/seu-usuario/seu-repositorio.git
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]