#Usar la imagen oficial de Node.js 12
FROM node:12-slim

#Crear y cambiarme al directorio de la aplicacion
WORKDIR /usr/src/app

#Copiar los archivos de las dependencias
COPY package*.json ./

#Instalar dependencias de produccion
RUN npm install --only=production

COPY . ./

CMD [ "npm", "start" ]