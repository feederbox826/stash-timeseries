FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm i

EXPOSE 9988/tcp
CMD node src/server.js