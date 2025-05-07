# Image de base Node.js
FROM node:20-alpine

# Installation des dépendances système nécessaires pour SQLite3
RUN apk add --no-cache python3 make g++ sqlite

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration de l'application
COPY package*.json ./

# Installation des dépendances Node.js
RUN npm install

# Copie du reste des fichiers de l'application
COPY . .

# Création du répertoire pour stocker les données SQLite (si nécessaire)
RUN mkdir -p /app/db

# Exposition du port pour Express (3000 par défaut)
EXPOSE 3000

# Rendre le script de démarrage exécutable
RUN chmod +x ./start.sh

# Commande de démarrage de l'application avec le script
CMD ["./start.sh"]
