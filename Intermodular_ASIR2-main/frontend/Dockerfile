# ETAPA 1: Construcción
FROM node:18-alpine as build

WORKDIR /app

# 1. Copiamos SOLO los archivos de dependencias primero
# Esto permite que Docker use la caché. Si no cambias dependencias,
# este paso y el "npm install" se saltan automáticamente (ahorras minutos).
COPY package*.json ./

# 2. Instalamos dependencias (limpias, de Linux)
RUN npm install

# 3. AHORA copiamos el código fuente
# Como hemos ignorado node_modules en el .dockerignore, aquí entra limpio.
COPY . .

# 4. Construimos la web (Genera la carpeta dist o build)
# ADVERTENCIA: Esto consume mucha RAM. Gracias al SWAP que creamos en AWS, no explotará.
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine

# OJO: Verifica si tu proyecto genera 'dist' (Vite) o 'build' (Create React App).
# Si falla, cambia /app/dist por /app/build en la línea de abajo.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]