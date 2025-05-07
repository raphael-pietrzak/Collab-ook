import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifications supplémentaires pour s'assurer que les champs requis sont présents
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }
    
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

    // Confirmer que l'utilisateur a bien été créé avec toutes les informations nécessaires
    console.log('User registered successfully:', { id: user.id, username: user.username });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    
    // Vérifications supplémentaires
    if (!login || !password) {
      return res.status(400).json({ error: 'Login and password are required' });
    }
    
    const user = await User.findByUsernameOrEmail(login);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Vérifier que l'utilisateur a bien un nom d'utilisateur
    if (!user.username) {
      console.error('User found but username is missing:', user.id);
      return res.status(500).json({ error: 'User data is incomplete' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Création du token avec le format exact attendu par le middleware socket.io
    const token = jwt.sign(
      { 
        userId: user.id.toString(), // Convertir en chaîne pour assurer la cohérence
        username: user.username 
      }, 
      'your-secret-key', 
      { expiresIn: '1h' }
    );
    
    console.log('User logged in successfully:', { id: user.id, username: user.username });
    
    res.json({ 
      token,
      user : { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour tester un token
router.get('/api/auth/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    console.log('Token verified successfully:', decoded);
    
    // Vérifier que le token contient les informations requises
    if (!decoded.userId || !decoded.username) {
      return res.status(401).json({ error: 'Invalid token format', decoded });
    }
    
    res.json({ 
      valid: true, 
      user: { 
        userId: decoded.userId, 
        username: decoded.username 
      } 
    });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token', message: error.message });
  }
});

export default router;
