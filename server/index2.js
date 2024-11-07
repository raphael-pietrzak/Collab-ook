const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
const initDB = require('./utils/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialise la base de données
initDB().catch(console.error);

// Routes
app.use('/api', authRoutes);
app.use('/api/books', authenticateToken, bookRoutes);
app.use('/api/books/:bookId/chapters', authenticateToken, chapterRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});