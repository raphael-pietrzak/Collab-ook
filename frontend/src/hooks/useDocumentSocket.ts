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
  
  // Initialiser la connexion socket
  useEffect(() => {
    if (!documentId || !userId || !token) {
      setError("Information d'identification ou ID de document manquants");
      return;
    }
    
    // Créer la connexion socket avec authentification
    const socket = io(serverUrl, {
      auth: {
        token // Utilisation du token pour l'authentification
      },
      query: {
        documentId
      }
    });
    
    socketRef.current = socket;
    
    // Gestion des événements de connexion
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socket.emit('join-document', { documentId });
      console.log(`Connected to document ${documentId}`);
    });
    
    socket.on('connect_error', (err) => {
      console.error('Connection error', err);
      setError(`Erreur de connexion: ${err.message}`);
      setIsConnected(false);
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });
    
    // Chargement initial du document
    socket.on('load-document', (docData: DocumentState) => {
      setDocument(docData);
      versionRef.current = docData.version;
      console.log('Document loaded, version:', docData.version);
    });
    
    // Mise à jour des utilisateurs connectés
    socket.on('users-changed', (users: ConnectedUser[]) => {

      console.log('Raw users-changed event data:', users);
      
      // S'assurer que les données utilisateur sont complètes
      const processedUsers = users.map(user => ({
        ...user,
        // Fournir des valeurs par défaut si nécessaires
        cursor_position: user.cursor_position !== undefined ? user.cursor_position : undefined,
        cursor_line: user.cursor_line !== undefined ? user.cursor_line : undefined,
        cursor_column: user.cursor_column !== undefined ? user.cursor_column : undefined,
      }));
      
      setConnectedUsers(processedUsers);
      console.log('Users updated:', processedUsers.length, 'connected');
      console.log('Users with cursor data:', processedUsers.filter(u => u.cursor_line !== undefined).length);
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
    
    // Mise à jour des curseurs des autres utilisateurs - rendre le traitement plus robuste
    socket.on('cursor-update', (userData: ConnectedUser) => {
      console.log('Received cursor update:', userData);
      
      // Vérifier que les données du curseur sont présentes et valides
      if (userData && userData.userId && (userData.cursor_line !== undefined || userData.cursor_column !== undefined)) {
        setConnectedUsers(prev => {
          // Vérifier si l'utilisateur existe déjà
          const existingUserIndex = prev.findIndex(u => u.userId === userData.userId);
          
          if (existingUserIndex >= 0) {
            // Créer une nouvelle array avec l'utilisateur mis à jour
            const newUsers = [...prev];
            newUsers[existingUserIndex] = {
              ...newUsers[existingUserIndex],
              ...userData
            };
            console.log(`Updated cursor for user ${userData.username} at index ${existingUserIndex}`);
            return newUsers;
          } else {
            // Ajouter le nouvel utilisateur
            console.log(`Adding new user from cursor update: ${userData.username}`);
            return [...prev, userData];
          }
        });
      } else {
        console.warn('Received invalid cursor update data:', userData);
      }
    });
    
    // Gestion des erreurs
    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message || 'Une erreur est survenue');
    });
    
    // Nettoyage à la déconnexion
    return () => {
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
  
  // Fonction pour mettre à jour la position du curseur - ajouter plus d'informations
  const updateCursorPosition = useCallback((position: CursorPosition) => {
    if (!socketRef.current || !isConnected) {
      console.warn('Cannot update cursor: socket disconnected or not initialized');
      return;
    }
    
    // Vérifier que les données sont valides avant d'envoyer
    if (position.line <= 0 || position.column <= 0) {
      console.warn('Invalid cursor position:', position);
      return;
    }
    
    console.log('Sending cursor position:', position);
    
    // Ajouter des informations pour le débogage
    const cursorData = {
      documentId,
      ...position,
      userId, // Inclure explicitement l'userId
      username // Inclure le username pour être sûr
    };
    
    socketRef.current.emit('cursor-move', cursorData);
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
