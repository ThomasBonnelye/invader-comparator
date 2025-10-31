FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY vitest.config.ts ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY index.html ./
COPY public ./public
COPY src ./src

# Build de production
RUN npm run build

# Image de production avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
