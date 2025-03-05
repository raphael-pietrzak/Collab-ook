import Document from '../models/Document.js';
import ActiveConnection from '../models/ActiveConnection.js';
import db from '../config/database.js';

export default function handleSocket(io, socket) {
  console.log('Client connected');

  socket.on('join-document', async (data) => {
    console.log('Joining document:', data);
    const { userId, documentId } = data;

    
    // Créer une nouvelle connexion active
    await ActiveConnection.create({
      user_id: userId,
      document_id: documentId,
      socket_id: socket.id
    });

    // Récupérer les utilisateurs connectés via le modèle
    const connectedUsers = await ActiveConnection.findByDocumentId(documentId);

    socket.join(documentId);
    io.to(documentId).emit('users-changed', connectedUsers);
    
    const document = await Document.findByPk(documentId);
    if (document) {
      socket.emit('load-document', {
        content: document.content,
        lastUpdated: document.lastUpdated
      });
    }
  });

  socket.on('update-document', async ({ documentId, content }) => {
    try {
      await Document.update(documentId, {
        content,
        lastUpdated: new Date()
      });
      
      const updatedDoc = await Document.findByPk(documentId);
      if (updatedDoc) {
        io.to(documentId).emit('document-updated', {
          content: updatedDoc.content,
          lastUpdated: updatedDoc.lastUpdated
        });
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  });

  socket.on('cursor-move', async (data) => {
    try {
      // Mettre à jour la position du curseur
      await ActiveConnection.update(socket.id, {
        cursor_position: data.position,
        cursor_line: data.line,
        cursor_column: data.column
      });

      const userConnection = await ActiveConnection.findBySocketId(socket.id);

      if (userConnection) {
        socket.to(data.documentId).emit
          ('cursor-update', {
          userId: userConnection.user_id,
          username: userConnection.username,
          position: data.position,
          line: data.line,
          column: data.column
        });
      }
    } catch (error) {
      console.error('Error updating cursor position:', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      // Récupérer la connexion avant de la supprimer
      const connection = await ActiveConnection.findBySocketId(socket.id);
      
      // Supprimer la connexion active
      await ActiveConnection.deleteBySocketId(socket.id);
      
      if (connection) {
        // Récupérer la liste mise à jour des utilisateurs connectés
        const connectedUsers = await ActiveConnection.findByDocumentId(connection.document_id);
        io.to(connection.document_id).emit('users-changed', connectedUsers);
      }

      console.log('Client disconnected');
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
}
