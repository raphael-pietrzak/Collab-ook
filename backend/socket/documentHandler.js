import Document from '../models/Document.js';
import db from '../config/database.js';

export default function handleSocket(io, socket) {
  console.log('Client connected');

  socket.on('join-document', async (data) => {
    const { documentId, userId } = data;
    console.log('User', userId, 'joined document', documentId);
    
    // Enregistrer la connexion active
    await db('active_connections').insert({
      user_id: userId,
      document_id: documentId,
      socket_id: socket.id
    });

    // Récupérer tous les utilisateurs connectés à ce document
    const connectedUsers = await db('active_connections')
      .join('users', 'active_connections.user_id', 'users.id')
      .where('document_id', documentId)
      .select('users.username', 'users.id');
    
    const allUsers = await db('users').select('username', 'id');

    // Émettre la liste mise à jour des utilisateurs connectés
    socket.join(documentId);
    console.log('Connected users:', allUsers);
    io.to(documentId).emit('users-changed', allUsers);
    
    socket.join(`document-${documentId}`);
    
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
      await Document.update(1, {
        content,
        lastUpdated: new Date()
      });
      
      const updatedDoc = await Document.findByPk(documentId);
      if (updatedDoc) {
        socket.to(`document-${documentId}`).emit('document-updated', {
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
      await knex('active_connections')
        .where('socket_id', socket.id)
        .update({
          cursor_position: data.position,
          cursor_line: data.line,
          cursor_column: data.column
        });

      const userConnection = await knex('active_connections')
        .join('users', 'active_connections.user_id', 'users.id')
        .where('socket_id', socket.id)
        .first();

      socket.to(data.documentId.toString()).emit('cursor-update', {
        userId: userConnection.user_id,
        username: userConnection.username,
        position: data.position,
        line: data.line,
        column: data.column
      });
    } catch (error) {
      console.error('Error updating cursor position:', error);
    }
  });

  socket.on('disconnect', async () => {
    // Supprimer la connexion active
    await db('active_connections')
      .where('socket_id', socket.id)
      .del();
    
    // Notifier les autres utilisateurs
    const documentConnections = await db('active_connections')
      .where('socket_id', socket.id)
      .first();
    
    if (documentConnections) {
      const connectedUsers = await db('active_connections')
        .join('users', 'active_connections.user_id', 'users.id')
        .where('document_id', documentConnections.document_id)
        .select('users.username', 'users.id');
      
      io.to(documentConnections.document_id).emit('users-changed', connectedUsers);
    }

    console.log('Client disconnected');
  });
}
