import Document from '../models/Document.js';

const connectedUsers = new Map();

export default function handleSocket(io, socket) {
  console.log('Client connected:', socket.user);

  const { documentId } = socket.handshake.query;
  const user = socket.user;

  socket.on('join-document', async (data) => {
    console.log('Joining document:', data);

    connectedUsers.set(user.id, {
      socketId: socket.id,
      username: user.username,
      connectedAt: new Date()
    });

    console.log('DOCUMENT ID:', documentId);
    socket.join(documentId);
    console.log('Connected users:', connectedUsers);
    
    const usersArray = Array.from(connectedUsers.entries()).map(([id, userData]) => ({
      userId: id,
      username: userData.username
    }));
    
    io.to(documentId).emit('users-changed', usersArray);
    
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

  socket.on('cursor-move', (data) => {
    socket.broadcast.emit('cursor_position_update', {
      userId: user.id,
      username: user.username,
      cursor_position: data.position,
      cursor_line: data.line,
      cursor_column: data.column
    });
  });

  socket.on('disconnect', async () => {
    try {
      connectedUsers.delete(user.id);
      
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
