# Usamos una imagen ligera (Alpine)
FROM node:18-alpine

WORKDIR /app

# 1. Copiamos SOLO los archivos de definición primero
# Esto permite que Docker guarde en caché las librerías si no has añadido nuevas
COPY package*.json ./

# 2. Instalamos las dependencias usando lo que dice el package.json
RUN npm install

# 3. Copiamos el código fuente
COPY . .

# 4. IMPORTANTE: Documentación del puerto
EXPOSE 3000

# 5. Comando de arranque
# OJO: En tu archivo ponía "server.js". Si tu archivo principal se llama "index.js", cámbialo aquí.
CMD ["node", "server.js"]