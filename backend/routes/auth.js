import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import e from 'cors';

const router = express.Router();

router.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findByUsername(username);
    const existingEmail = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    
    const user = await User.findByUsernameOrEmail(login);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '24h' });
    res.json({ token: token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
