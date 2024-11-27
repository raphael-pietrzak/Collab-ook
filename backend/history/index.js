import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = createClient({
  url: 'file:local.db',
});

// Initialize database tables
async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
      progress INTEGER DEFAULT 0,
      synopsis TEXT,
      title TEXT NOT NULL,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      book_id INTEGER,
      order_index INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books (id)
    )
  `);
}

initDB().catch(console.error);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute({
      sql: 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      args: [username, email, hashedPassword]
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book routes
app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    // get user name
    const user = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [req.user.id]
    });
    
    const result = await db.execute({
      sql: 'INSERT INTO books (title, user_id) VALUES (?, ?) RETURNING id',
      args: [title, req.user.id]
    });
    res.status(201).json({ id: result.rows[0].id, title, user_id: req.user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books', authenticateToken, async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM books WHERE user_id = ?',
      args: [req.user.id]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/book', async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM books'
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute({
      sql: 'DELETE FROM chapters WHERE book_id = ?',
      args: [id]
    });

    await db.execute({
      sql: 'DELETE FROM books WHERE id = ?',
      args: [id]
    });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chapter routes
app.post('/api/books/:bookId/chapters', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { bookId } = req.params;

    // Get the next order index
    const result = await db.execute({
      sql: 'SELECT MAX(order_index) as max_order FROM chapters WHERE book_id = ?',
      args: [bookId]
    });
    const nextOrder = (result.rows[0].max_order || 0) + 1;

    const chapter = await db.execute({
      sql: 'INSERT INTO chapters (title, content, book_id, order_index) VALUES (?, ?, ?, ?) RETURNING id',
      args: [title, content, bookId, nextOrder]
    });

    res.status(201).json({ id: chapter.rows[0].id, title, content, book_id: bookId, order_index: nextOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/chapters/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    await db.execute({
      sql: 'UPDATE chapters SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [title, content, id]
    });

    res.json({ id, title, content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books/:bookId/chapters', authenticateToken, async (req, res) => {

  try {
    const { bookId } = req.params;
    const result = await db.execute({
      sql: 'SELECT * FROM chapters WHERE book_id = ? ORDER BY order_index',
      args: [bookId]
    });
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});