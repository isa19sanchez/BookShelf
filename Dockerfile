FROM node:20-alpine

WORKDIR /app

COPY bookshelf-backend/package*.json ./

RUN npm install --production

COPY bookshelf-backend/ .

EXPOSE 3000

CMD ["npm", "start"]

