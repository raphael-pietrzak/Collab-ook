import { io } from 'socket.io-client';
import jwt from 'jsonwebtoken';

// Configuration
const serverUrl = 'http://localhost:3000';
const documentId = '1';

// Créer plusieurs utilisateurs de test avec le format exact attendu
const users = [
  { userId: '123', username: 'user1' },
  { userId: '456', username: 'user2' }
];

// Créer une connexion socket pour un utilisateur
function createConnection(user) {
  // Assurer que le token a le format exact attendu par le middleware
  const token = jwt.sign({ 
    userId: user.userId, 
    username: user.username 
  }, 'your-secret-key');
  
  console.log(`[${user.username}] Création de token:`, jwt.decode(token));
  
  const socket = io(serverUrl, { auth: { token } });
  
  socket.on('connect', () => {
    console.log(`[${user.username}] Connecté, socket ID:`, socket.id);
    socket.emit('join-document', { documentId });
  });
  
  socket.on('connect_error', (error) => {
    console.error(`[${user.username}] Erreur de connexion:`, error.message);
  });
  
  socket.on('users-changed', (users) => {
    console.log(`[${user.username}] Utilisateurs dans le document:`, users.map(u => u.username).join(', '));
  });
  
  socket.on('load-document', (data) => {
    console.log(`[${user.username}] Document chargé:`, {
      version: data.version,
      taille: data.content ? data.content.length : 0
    });
  });
  
  socket.on('document-updated', (data) => {
    console.log(`[${user.username}] Document mis à jour:`, {
      version: data.version,
      operation: data.operation?.type
    });
  });
  
  socket.on('cursor-update', (data) => {
    console.log(`[${user.username}] Position du curseur de ${data.username}:`, {
      position: data.cursor_position,
      ligne: data.cursor_line,
      colonne: data.cursor_column
    });
  });
  
  return { socket, user };
}

// Exécuter le test multi-clients
async function runMultiClientTest() {
  console.log('=== DÉBUT DU TEST MULTI-CLIENTS ===');
  
  // Créer les connexions
  const clients = users.map(user => createConnection(user));
  
  // Attente pour s'assurer que les connexions sont établies
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Premier utilisateur déplace son curseur
  setTimeout(() => {
    const client1 = clients[0];
    console.log(`[${client1.user.username}] Déplacement du curseur`);
    client1.socket.emit('cursor-move', {
      position: 15,
      line: 2,
      column: 5
    });
  }, 3000);
  
  // Deuxième utilisateur modifie le document
  setTimeout(() => {
    const client2 = clients[1];
    console.log(`[${client2.user.username}] Modification du document`);
    client2.socket.emit('update-document', {
      documentId,
      content: 'Modification par user2',
      operation: { type: 'replace', position: 0 },
      version: 2
    });
  }, 5000);
  
  // Déconnexion du premier utilisateur
  setTimeout(() => {
    const client1 = clients[0];
    console.log(`[${client1.user.username}] Déconnexion`);
    client1.socket.disconnect();
  }, 8000);
  
  // Déconnexion du deuxième utilisateur
  setTimeout(() => {
    const client2 = clients[1];
    console.log(`[${client2.user.username}] Déconnexion`);
    client2.socket.disconnect();
    console.log('=== FIN DU TEST MULTI-CLIENTS ===');
  }, 10000);
}

runMultiClientTest().catch(err => console.error('Erreur lors du test:', err));
