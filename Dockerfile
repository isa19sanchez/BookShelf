FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY bookshelf-backend/package*.json ./
COPY bookshelf-backend/.env ./

# Instalar dependencias
RUN npm install --production

# Copiar código del servidor
COPY bookshelf-backend/server.js ./

# Copiar archivos estáticos (HTML, CSS, JS)
COPY index.html ./
COPY bookShelf.css ./
COPY bookShelf.js ./

EXPOSE 3000

CMD ["node", "server.js"]

