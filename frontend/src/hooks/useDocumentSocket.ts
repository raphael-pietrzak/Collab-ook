import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ConnectedUser, 
  DocumentState, 
  TextOperation, 
  DocumentUpdate,
  CursorPosition
} from '../types/document';

interface UseDocumentSocketProps {
  documentId: string;
  userId: string;
  username: string;
  serverUrl: string;
  token: string; // Ajout du token pour l'authentification
}

interface UseDocumentSocketReturn {
  document: DocumentState | null;
  connectedUsers: ConnectedUser[];
  updateDocument: (content: string, operation?: TextOperation) => void;
  updateCursorPosition: (position: CursorPosition) => void;
  isConnected: boolean;
  error: string | null;
}

export const useDocumentSocket = ({
  documentId,
  userId,
  username,
  serverUrl,
  token
}: UseDocumentSocketProps): UseDocumentSocketReturn => {
  const [document, setDocument] = useState<DocumentState | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const versionRef = useRef<number>(0);
  const pendingCursorUpdatesRef = useRef<CursorPosition[]>([]);
  const reconnectingRef = useRef<boolean>(false);
  
  // Initialiser la connexion socket
  useEffect(() => {
    if (!documentId || !userId || !token) {
      setError("Information d'identification ou ID de document manquants");
      return;
    }
    
    console.log(`[Socket] Initializing connection to ${serverUrl} for doc ${documentId}`);
    
    // Créer la connexion socket avec authentification
    const socket = io(serverUrl, {
      auth: {
        token // Utilisation du token pour l'authentification
      },
      query: {
        documentId
      },
      reconnectionAttempts: 5,  // Essayer 5 fois de se reconnecter
      reconnectionDelay: 1000,  // Attendre 1 seconde entre chaque tentative
      timeout: 10000            // Timeout de 10 secondes
    });
    
    socketRef.current = socket;
    
    // Gestion des événements de connexion
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socket.emit('join-document', { documentId });
      console.log(`[Socket] Connected to document ${documentId}`);
      
      // Si nous nous reconnectons, envoyer les positions de curseur en attente
      if (reconnectingRef.current) {
        console.log('[Socket] Reconnected, sending pending cursor updates');
        reconnectingRef.current = false;
        
        // Envoyer uniquement la dernière position de curseur en attente
        if (pendingCursorUpdatesRef.current.length > 0) {
          const lastPosition = pendingCursorUpdatesRef.current[pendingCursorUpdatesRef.current.length - 1];
          setTimeout(() => {
            if (socketRef.current && isConnected) {
              updateCursorPosition(lastPosition);
              console.log('[Socket] Sent pending cursor position after reconnection');
            }
          }, 1000); // Attendre 1 seconde pour s'assurer que la connexion est stable
          
          // Vider la file d'attente
          pendingCursorUpdatesRef.current = [];
        }
      }
    });
    
    socket.on('reconnect_attempt', (attempt) => {
      console.log(`[Socket] Attempting to reconnect (${attempt})`);
      reconnectingRef.current = true;
    });
    
    socket.on('connect_error', (err) => {
      console.error('Connection error', err);
      setError(`Erreur de connexion: ${err.message}`);
      setIsConnected(false);
      reconnectingRef.current = true;
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
      reconnectingRef.current = true;
    });
    
    // Chargement initial du document
    socket.on('load-document', (docData: DocumentState) => {
      setDocument(docData);
      versionRef.current = docData.version;
      console.log('Document loaded, version:', docData.version);
    });
    
    // Mise à jour des utilisateurs connectés avec journalisation améliorée
    socket.on('users-changed', (users: ConnectedUser[]) => {
      console.log('[Socket] Received users-changed event with data:', users);
      
      if (!Array.isArray(users)) {
        console.error('[Socket] Invalid users data received:', users);
        return;
      }
      
      // S'assurer que les données utilisateur sont complètes
      const processedUsers = users.map(user => ({
        userId: user.userId || '',
        username: user.username || 'Unknown',
        cursor_position: user.cursor_position !== undefined ? user.cursor_position : -1,
        cursor_line: user.cursor_line !== undefined ? user.cursor_line : -1,
        cursor_column: user.cursor_column !== undefined ? user.cursor_column : -1,
      }));
      
      setConnectedUsers(processedUsers);
      
      const usersWithCursor = processedUsers.filter(
        u => u.cursor_line >= 0 && u.cursor_column >= 0
      );
      
      console.log(`[Socket] Users updated: ${processedUsers.length} connected, ${usersWithCursor.length} with cursor data`);
      
      if (usersWithCursor.length > 0) {
        console.log('[Socket] Users with cursor positions:', usersWithCursor);
      }
    });
    
    // Mise à jour du document en temps réel
    socket.on('document-updated', (update: DocumentUpdate) => {
      // Ignorer nos propres mises à jour (déjà appliquées localement)
      if (update.userId === userId) return;
      
      setDocument(prevDoc => {
        if (!prevDoc) return {
          content: update.content,
          version: update.version,
          lastUpdated: new Date(update.lastUpdated)
        };
        
        // Adopter la version la plus récente
        if (update.version >= versionRef.current) {
          versionRef.current = update.version;
          return {
            content: update.content,
            version: update.version,
            lastUpdated: new Date(update.lastUpdated)
          };
        }
        
        return prevDoc;
      });
    });
    
    // Demande de resynchronisation
    socket.on('sync-required', ({ version }) => {
      console.log('Sync required, server version:', version);
      // Forcer une rechargement du document
      socket.emit('join-document', { documentId });
    });
    
    // Réception améliorée des mises à jour de curseur
    socket.on('cursor-update', (userData: ConnectedUser) => {
      console.log('[Socket] Received cursor update:', userData);
      
      // Vérifications de base
      if (!userData || !userData.userId) {
        console.error('[Socket] Invalid cursor update received:', userData);
        return;
      }
      
      // Ignorer nos propres mises à jour
      if (userData.userId === userId) {
        console.log('[Socket] Ignoring our own cursor update');
        return;
      }
      
      // Vérifier la validité des données de position
      if (userData.cursor_line === undefined || userData.cursor_column === undefined) {
        console.warn('[Socket] Cursor update missing position data:', userData);
        return;
      }

      // Mise à jour de la liste des utilisateurs
      setConnectedUsers(prev => {
        // Chercher l'utilisateur dans la liste actuelle
        const existingUserIndex = prev.findIndex(u => u.userId === userData.userId);
        
        // Nouvelle liste d'utilisateurs
        const newUsers = [...prev];
        
        if (existingUserIndex >= 0) {
          // Mettre à jour l'utilisateur existant
          newUsers[existingUserIndex] = {
            ...newUsers[existingUserIndex],
            cursor_position: userData.cursor_position || 0,
            cursor_line: userData.cursor_line,
            cursor_column: userData.cursor_column
          };
          console.log(`[Socket] Updated cursor for user ${userData.username || userData.userId} at line ${userData.cursor_line}, column ${userData.cursor_column}`);
        } else {
          // Ajouter comme nouvel utilisateur
          newUsers.push(userData);
          console.log(`[Socket] Added new user from cursor update: ${userData.username || userData.userId}`);
        }
        
        return newUsers;
      });
    });
    
    // Gestion des erreurs
    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message || 'Une erreur est survenue');
    });
    
    // Nettoyage à la déconnexion
    return () => {
      console.log('[Socket] Disconnecting...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [documentId, userId, username, serverUrl, token]);
  
  // Fonction pour mettre à jour le document
  const updateDocument = useCallback((content: string, operation?: TextOperation) => {
    if (!socketRef.current || !isConnected || !document) return;
    
    const newVersion = versionRef.current + 1;
    versionRef.current = newVersion;
    
    // Mettre à jour l'état local immédiatement
    setDocument({
      content,
      version: newVersion,
      lastUpdated: new Date()
    });
    
    // Envoyer la mise à jour au serveur
    socketRef.current.emit('update-document', {
      documentId,
      content,
      operation,
      version: newVersion
    });
  }, [documentId, document, isConnected]);
  
  // Fonction pour mettre à jour la position du curseur - avec gestion de file d'attente
  const updateCursorPosition = useCallback((position: CursorPosition) => {
    // Vérifier que les données sont valides avant d'envoyer
    if (position.line < 0 || position.column < 0) {
      console.warn('[Cursor] Invalid cursor position:', position);
      return;
    }
    
    // Si la socket n'est pas initialisée ou connectée, ajouter à la file d'attente
    if (!socketRef.current || !isConnected) {
      console.log('[Cursor] Socket not ready, queueing cursor update');
      pendingCursorUpdatesRef.current.push(position);
      
      // Limiter la taille de la file d'attente pour éviter les fuites de mémoire
      if (pendingCursorUpdatesRef.current.length > 10) {
        pendingCursorUpdatesRef.current = pendingCursorUpdatesRef.current.slice(-10);
      }
      
      return;
    }
    
    // Données à envoyer au serveur
    const cursorData = {
      documentId,
      position: position.position || 0,
      line: position.line,
      column: position.column,
      userId,
      username
    };
    
    console.log('[Cursor] Sending position:', cursorData);
    
    // Envoi au serveur avec gestion d'erreur
    try {
      socketRef.current.emit('cursor-move', cursorData);
    } catch (error) {
      console.error('[Cursor] Error sending cursor position:', error);
      pendingCursorUpdatesRef.current.push(position);
    }
  }, [isConnected, documentId, userId, username]);
  
  return {
    document,
    connectedUsers,
    updateDocument,
    updateCursorPosition,
    isConnected,
    error
  };
};
