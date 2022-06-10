FROM node:14.15.0

RUN apt-get update && apt-get install -y redis-server

WORKDIR /usr/src/app

COPY package*.json ./

RUN echo test

RUN npm install

COPY . .

EXPOSE 3001 



CMD [ "npm", "start" ]