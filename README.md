# Plateforme d'Écriture Collaborative

Une application web permettant aux écrivains de collaborer sur des projets littéraires en fonction de leurs genres et styles préférés.

## 📖 À propos du projet

Cette plateforme met en relation des auteurs souhaitant collaborer sur des projets d'écriture. Elle permet de rechercher des partenaires selon les genres littéraires et les styles d'écriture, facilitant ainsi la création collaborative de livres en ligne.

## 🛠️ Technologies utilisées

- **Frontend**: React (Conteneurisé avec Docker)
- **Backend**: Node.js (Conteneurisé avec Docker)
- **Base de données**: Stockage local Sqlite dans le conteneur backend

## 🚀 Installation et démarrage

### Prérequis

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Étapes d'installation

1. Clonez le dépôt

```bash
git clone https://github.com/raphael-pietrzak/Collab-ook.git
cd Collab-ook
```

2. Démarrez les conteneurs Docker

```bash
docker-compose up -d
```

3. Accédez à l'application

- Frontend: <http://localhost:5173>
- API Backend: <http://localhost:3000>

### Arrêt des services

```bash
docker-compose down
```

## 🔍 Fonctionnalités principales

- **Recherche de collaborateurs** par genre littéraire et style d'écriture
- **Création d'espaces collaboratifs** pour chaque projet de livre
- **Éditeur de texte collaboratif** en temps réel
- **Gestion des versions et des révisions** de chaque chapitre
- **Système de commentaires et annotations** pour faciliter la collaboration
- **Profils personnalisables** mettant en avant les compétences et préférences littéraires

## 👨‍💻 Développement

Pour travailler en mode développement, les volumes Docker sont configurés pour refléter les changements en temps réel :

- Les modifications du code frontend sont automatiquement appliquées
- Les modifications du code backend nécessitent un redémarrage du serveur

## 📝 Licence

Ce projet est sous licence MIT.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à me contacter :

- **Nom**: Pietrzak Raphaël
- **Email**: <pietrzakraphael7@gmail.com>
