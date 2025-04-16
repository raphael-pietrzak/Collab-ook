import Document from '../models/Document.js';

// Restructurer pour organiser les utilisateurs par document
const documents = new Map(); // Map pour stocker les informations par document
// Structure: documentId -> { users: Map<userId, userInfo>, version: number }

// Helper pour logger l'état du document
const logDocumentState = (documentId) => {
  const docData = documents.get(documentId) || { users: new Map(), version: 0 };
  const connectedCount = docData.users.size;
  console.log(`[Doc ${documentId}] Current version: ${docData.version}, Connected users: ${connectedCount}`);
  console.log(`[Doc ${documentId}] Users:`, Array.from(docData.users.entries()).map(([id, data]) => 
    `${data.username}(${id})`).join(', '));
};

export default function handleSocket(io, socket) {
  console.log(`[Socket] Client connected: ${socket.id}`);
  console.log(`[Socket] User: ${socket.user.username} (ID: ${socket.user.userId})`);

  const user = socket.user;
  let currentDocumentId = null;

  socket.on('join-document', async (data) => {
    const { documentId } = data;
    currentDocumentId = documentId;
    console.log(`[Socket ${socket.id}] User ${user.username} joining document: ${documentId}`);

    // Initialiser la structure du document si elle n'existe pas encore
    if (!documents.has(documentId)) {
      documents.set(documentId, {
        users: new Map(),
        version: 0
      });
    }

    // Ajouter l'utilisateur à la liste des utilisateurs du document
    const docData = documents.get(documentId);
    docData.users.set(user.userId, {
      socketId: socket.id,
      userId: user.userId,  // Ajout explicite de l'ID
      username: user.username,
      connectedAt: new Date(),
      // Initialiser les positions de curseur à des valeurs par défaut
      cursor_position: 0,
      cursor_line: 1,
      cursor_column: 1
    });

    socket.join(documentId);
    console.log(`[Doc ${documentId}] User ${user.username} joined the room`);
    
    // Construire la liste des utilisateurs avec leurs positions de curseur
    const usersArray = Array.from(docData.users.entries()).map(([id, userData]) => ({
      userId: id,
      username: userData.username,
      cursor_position: userData.cursor_position,
      cursor_line: userData.cursor_line,
      cursor_column: userData.cursor_column
    }));
    
    // Émettre à tous les utilisateurs du document, y compris celui qui vient de se connecter
    io.to(documentId).emit('users-changed', usersArray);
    console.log(`[Doc ${documentId}] Emitted users-changed event with ${usersArray.length} users`);
    
    try {
      const document = await Document.findByPk(documentId);
      if (document) {
        console.log(`[Doc ${documentId}] Loading document, version: ${docData.version}`);
        socket.emit('load-document', {
          content: document.content,
          lastUpdated: document.lastUpdated,
          version: docData.version
        });
      } else {
        console.log(`[Doc ${documentId}] Document not found in database - creating new document`);
        // Créer un document vide si non existant
        try {
          const newDoc = await Document.create({
            id: documentId,
            content: "",
            lastUpdated: new Date()
          });
          console.log(`[Doc ${documentId}] New document created`);
          socket.emit('load-document', {
            content: "",
            lastUpdated: new Date(),
            version: 0
          });
        } catch (createError) {
          console.error(`[Doc ${documentId}] Error creating document:`, createError);
          socket.emit('error', { message: "Could not create document" });
        }
      }
    } catch (error) {
      console.error(`[Doc ${documentId}] Error loading document:`, error);
    }
    
    logDocumentState(documentId);
  });

  socket.on('update-document', async ({ documentId, content, operation, version }) => {
    try {
      console.log(`[Doc ${documentId}] Update request from ${user.username}, version: ${version}`);
      console.log(`[Doc ${documentId}] Operation: ${operation?.type || 'Unknown'}`);
      
      if (!documents.has(documentId)) {
        documents.set(documentId, {
          users: new Map(),
          version: 0
        });
      }

      const docData = documents.get(documentId);
      const currentVersion = docData.version;
      
      console.log(`[Doc ${documentId}] Current version: ${currentVersion}, Incoming version: ${version}`);
      
      // Accepter la mise à jour si la version est plus récente ou égale
      if (version >= currentVersion) {
        // Mettre à jour la version du document
        docData.version = version;
        console.log(`[Doc ${documentId}] Version updated to: ${version}`);
        
        try {
          // Vérifier si le document existe avant de mettre à jour
          const documentExists = await Document.findByPk(documentId);
          
            if (documentExists) {
            await Document.update(documentId, {
              content,
              lastUpdated: new Date()
            });
            console.log(`[Doc ${documentId}] Database updated`);
          } else {
            // Créer le document s'il n'existe pas
            await Document.create({
              id: documentId,
              content,
              lastUpdated: new Date()
            });
            console.log(`[Doc ${documentId}] Document created in database`);
          }
        } catch (dbError) {
          console.error(`[Doc ${documentId}] Database update failed:`, dbError);
        }
        
        // Propager à tous les clients, y compris l'émetteur pour confirmer
        io.to(documentId).emit('document-updated', {
          content,
          lastUpdated: new Date(),
          operation,
          version,
          userId: user.userId // Ajouter l'ID de l'utilisateur pour permettre au client d'ignorer sa propre mise à jour
        });
        console.log(`[Doc ${documentId}] Broadcasted update to all clients`);
      } else {
        console.log(`[Doc ${documentId}] Update rejected - older version (${version} < ${currentVersion})`);
        // Envoyer la version actuelle à l'utilisateur pour qu'il se synchronise
        socket.emit('sync-required', {
          version: currentVersion
        });
      }
    } catch (error) {
      console.error(`[Doc ${documentId}] Error updating document:`, error);
    }
    
    logDocumentState(documentId);
  });

  socket.on('cursor-move', (data) => {
    if (!currentDocumentId) {
      console.warn(`[Socket ${socket.id}] Cursor move ignored: no current document`);
      return;
    }
    
    try {
      // Validations de base pour éviter les erreurs
      if (!data || typeof data.line !== 'number' || typeof data.column !== 'number') {
        console.warn(`[Socket ${socket.id}] Invalid cursor data received:`, data);
        return;
      }
      
      console.log(`[Socket ${socket.id}] Cursor move from ${user.username} at position: ${data.position}, line: ${data.line}, column: ${data.column}`);
      
      // Mettre à jour les données utilisateur dans la structure de document
      if (documents.has(currentDocumentId)) {
        const docData = documents.get(currentDocumentId);
        if (docData.users.has(user.userId)) {
          const userData = docData.users.get(user.userId);
          userData.cursor_position = data.position;
          userData.cursor_line = data.line;
          userData.cursor_column = data.column;
          docData.users.set(user.userId, userData);
          
          // Log pour le débogage
          console.log(`[Doc ${currentDocumentId}] Updated cursor position for ${user.username}`);
        } else {
          // Utilisateur non trouvé dans la map des utilisateurs, probablement reconnecté
          console.log(`[Doc ${currentDocumentId}] User ${user.username} not found in users Map, re-adding`);
          docData.users.set(user.userId, {
            socketId: socket.id,
            userId: user.userId,
            username: user.username,
            connectedAt: new Date(),
            cursor_position: data.position,
            cursor_line: data.line,
            cursor_column: data.column
          });
          
          // Recalculer la liste des utilisateurs et la diffuser
          const usersArray = Array.from(docData.users.entries()).map(([id, userData]) => ({
            userId: id,
            username: userData.username,
            cursor_position: userData.cursor_position,
            cursor_line: userData.cursor_line,
            cursor_column: userData.cursor_column
          }));
          
          io.to(currentDocumentId).emit('users-changed', usersArray);
        }
      } else {
        // Le document n'existe pas dans la structure en mémoire
        console.log(`[Socket ${socket.id}] Document ${currentDocumentId} not found, re-initializing`);
        // Réinitialiser la structure du document
        documents.set(currentDocumentId, {
          users: new Map(),
          version: 0
        });
        
        // Rejoindre à nouveau le document
        socket.emit('sync-required', { version: 0 });
      }
      
      // Envoyer la mise à jour à tous les autres clients dans le même document
      const cursorData = {
        userId: user.userId,
        username: user.username,
        cursor_position: data.position,
        cursor_line: data.line,
        cursor_column: data.column
      };
      
      // Émission à tous les autres clients du document
      socket.to(currentDocumentId).emit('cursor-update', cursorData);
      
      // Log pour confirmer l'émission
      console.log(`[Doc ${currentDocumentId}] Emitted cursor-update event to other clients`);
    } catch (error) {
      console.error(`[Socket ${socket.id}] Error handling cursor movement:`, error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      console.log(`[Socket ${socket.id}] User ${user.username} disconnected`);
      
      if (currentDocumentId && documents.has(currentDocumentId)) {
        const docData = documents.get(currentDocumentId);
        docData.users.delete(user.userId);
        
        const usersArray = Array.from(docData.users.entries()).map(([id, userData]) => ({
          userId: id,
          username: userData.username
        }));
        
        io.to(currentDocumentId).emit('users-changed', usersArray);
        console.log(`[Doc ${currentDocumentId}] Emitted users-changed event after disconnect`);
        logDocumentState(currentDocumentId);
        
        // Si plus personne dans le document, nettoyer les données
        if (docData.users.size === 0) {
          documents.delete(currentDocumentId);
          console.log(`[Doc ${currentDocumentId}] No more users, removed document data from memory`);
        }
      }
    } catch (error) {
      console.error('[Socket] Error handling disconnect:', error);
    }
  });
}
