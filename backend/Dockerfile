FROM node:22-alpine

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers
COPY . .

# Compiler TypeScript
RUN npm run build

# Exposer le port
EXPOSE 3001

# Démarrer l'application
CMD ["npm", "start"]
