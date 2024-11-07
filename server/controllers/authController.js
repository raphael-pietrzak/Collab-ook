
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [user] = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    if (user) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute({
      sql: 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      args: [username, email, hashedPassword]
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.login = async (req, res) => {
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
};