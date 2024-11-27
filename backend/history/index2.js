import express from 'express';
import { initDB } from '../utils/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';


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