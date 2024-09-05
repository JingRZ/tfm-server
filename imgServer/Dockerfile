# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /server

# Copia los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

EXPOSE 3000

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["npx", "nodemon", "server.js"]
