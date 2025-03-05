import Document from '../models/Document.js';

const connectedUsers = new Map();
const documentVersions = new Map(); // Pour suivre la version de chaque document

export default function handleSocket(io, socket) {
  console.log('Client connected:', socket.user);

  const user = socket.user;

  socket.on('join-document', async (data) => {
    const { documentId } = data;

    connectedUsers.set(user.userId, {
      socketId: socket.id,
      username: user.username,
      connectedAt: new Date()
    });

    socket.join(documentId);
    
    const usersArray = Array.from(connectedUsers.entries()).map(([id, userData]) => ({
      userId: id,
      username: userData.username
    }));
    
    io.to(documentId).emit('users-changed', usersArray);
    
    const document = await Document.findByPk(documentId);
    if (document) {
      const currentVersion = documentVersions.get(documentId) || 0;
      socket.emit('load-document', {
        content: document.content,
        lastUpdated: document.lastUpdated,
        version: currentVersion
      });
    }
  });

  socket.on('update-document', async ({ documentId, content, operation, version }) => {
    try {
      const currentVersion = documentVersions.get(documentId) || 0;
      
      // Mettre à jour la version même si elle n'est pas strictement supérieure
      if (version >= currentVersion) {
        documentVersions.set(documentId, version);
        
        await Document.update(documentId, {
          content,
          lastUpdated: new Date()
        });
        
        // Propager à tous les clients sauf l'émetteur
        socket.broadcast.to(documentId).emit('document-updated', {
          content,
          lastUpdated: new Date(),
          operation,
          version
        });
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  });

  socket.on('cursor-move', (data) => {
    console.log('Cursor move:', data);
    socket.broadcast.emit('cursor-update', {
      userId: user.userId,
      username: user.username,
      cursor_position: data.position,
      cursor_line: data.line,
      cursor_column: data.column
    });
  });

  socket.on('disconnect', async () => {
    try {
      connectedUsers.delete(user.userId);
      
      const usersArray = Array.from(connectedUsers.entries()).map(([id, userData]) => ({
        userId: id,
        username: userData.username
      }));
      
      io.to(documentId).emit('users-changed', usersArray);
      console.log('Client disconnected');
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
}
