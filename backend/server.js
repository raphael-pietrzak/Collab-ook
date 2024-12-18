
// Importation des modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const chapterRoutes = require('./routes/chapter.routes');
const initDb = require('./config/initDb');

// Initialisation de la base de données
initDb();


dotenv.config();
const app = express();
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);     // Routes pour l'authentification
app.use('/api/books', bookRoutes);    // Routes pour les livres
app.use('/api/chapters', chapterRoutes);



// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});