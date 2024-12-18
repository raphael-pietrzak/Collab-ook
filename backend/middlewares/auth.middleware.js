const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Modèle utilisateur dans votre BDD

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    // Vérifie si le header Authorization contient un Bearer token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    // Valide le token
    if (!JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET not set' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupère l'utilisateur associé dans la BDD
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Ajoute l'utilisateur à la requête pour les prochaines étapes
    req.user = user;
    next(); // Passe au prochain middleware ou à la route finale
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;