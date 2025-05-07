import { io } from 'socket.io-client';
import jwt from 'jsonwebtoken';

// Configuration de test
const config = {
  serverUrl: 'http://localhost:3000',
  // Crée un token de test avec le format exact attendu par le middleware socket.io
  testToken: jwt.sign(
    { 
      userId: '123', 
      username: 'test-user' 
    }, 
    'your-secret-key'
  ),
  documentId: '1' // ID du document à tester
};

console.log('Token de test créé:', jwt.decode(config.testToken));

// Fonction pour créer une connexion socket
const createSocketConnection = (token) => {
  console.log('Tentative de connexion avec token:', token ? 'Token fourni' : 'Aucun token');
  
  const socket = io(config.serverUrl, {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Connexion établie, ID socket:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Erreur de connexion:', error.message);
  });

  return socket;
};

// Test de scénario complet
const runTest = async () => {
  console.log('=== DÉBUT DU TEST ===');
  
  // 1. Connexion avec token valide
  const socket = createSocketConnection(config.testToken);
  
  // ... reste du code inchangé ...
};

// Exécution du test
runTest().catch(err => console.error('Erreur lors du test:', err));
