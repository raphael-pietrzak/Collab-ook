# Image de base Node.js
FROM node:20-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances Node.js
RUN npm install

# Copie du reste des fichiers de l'application
COPY . .

# Exposition du port pour Vite
EXPOSE 5173

# Commande de démarrage de l'application en mode développement
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
