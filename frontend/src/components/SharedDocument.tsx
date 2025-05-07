import React, { useState, useEffect, useRef } from 'react';
import { useDocumentSocket } from '../hooks/useDocumentSocket';
import UserList from './UserList';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { TextOperation, CursorPosition } from '../types/document';
import RemoteCursors from './RemoteCursors'; // Importer le nouveau composant

interface SharedDocumentProps {
  documentId: string;
  userId: string;
  username: string;
  serverUrl: string;
  token: string; // Ajout du token comme prop
}

const SharedDocument: React.FC<SharedDocumentProps> = ({
  documentId,
  userId,
  username,
  serverUrl,
  token // Récupération du token
}) => {
  const {
    document,
    connectedUsers,
    updateDocument,
    updateCursorPosition,
    isConnected,
    error
  } = useDocumentSocket({
    documentId,
    userId,
    username,
    serverUrl,
    token // Passage du token au hook
  });
  
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isInitialLoad = useRef<boolean>(true);
  const lastVersionRef = useRef<number>(0);
  const lastCursorUpdateRef = useRef<number>(0); // Pour limiter les mises à jour du curseur
  const wasConnectedRef = useRef<boolean>(false); // Pour suivre l'état de connexion précédent
  
  // Synchroniser l'état local avec le document au chargement initial
  useEffect(() => {
    if (document && isInitialLoad.current) {
      setContent(document.content);
      lastVersionRef.current = document.version;
      isInitialLoad.current = false;
    }
  }, [document]);
  
  // Nouvelle effet pour synchroniser le contenu lorsque le document est mis à jour
  useEffect(() => {
    if (document && !isInitialLoad.current) {
      // Mettre à jour le contenu seulement si la version a changé
      if (document.version > lastVersionRef.current) {
        console.log(`Mise à jour du contenu depuis le serveur (version ${document.version})`);
        setContent(document.content);
        lastVersionRef.current = document.version;
      }
    }
  }, [document]);

  // Vérifier si nous recevons bien les positions de curseur des autres utilisateurs
  useEffect(() => {
    if (connectedUsers.length > 0) {
      console.log('Connected users with cursor info:', 
        connectedUsers.map(u => ({
          username: u.username, 
          cursor: u.cursor_line ? `${u.cursor_line}:${u.cursor_column}` : 'none'
        }))
      );
    }
  }, [connectedUsers]);

  // Gérer les changements d'état de connexion
  useEffect(() => {
    // Si on vient de se reconnecter
    if (isConnected && !wasConnectedRef.current) {
      console.log('[Connection] Reconnected, refreshing editor state');
      
      // Resynchroniser la position du curseur après une courte période
      setTimeout(() => {
        if (editorRef.current) {
          handleCursorUpdate(true);
          console.log('[Connection] Cursor position resynchronized after reconnection');
        }
      }, 1000);
    }
    
    // Mettre à jour la référence pour la prochaine comparaison
    wasConnectedRef.current = isConnected;
  }, [isConnected]);

  // Fonction pour gérer le changement de contenu dans l'éditeur
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      // Dans une implémentation réelle, nous calculerions l'opération
      // basée sur la différence entre l'ancien et le nouveau contenu
      const operation: TextOperation = {
        type: 'replace',
        position: 0,
        text: value
      };
      
      setContent(value);
      updateDocument(value, operation);
    }
  };
  
  // NOUVELLE GESTION DES CURSEURS
  
  // Fonction pour mettre à jour la position du curseur de manière optimisée
  const handleCursorUpdate = (force = false) => {
    const now = Date.now();
    const editor = editorRef.current;
    
    // Limiter les mises à jour à 100ms d'intervalle, sauf si force est true
    if (!editor || (!force && now - lastCursorUpdateRef.current < 100)) return;
    
    lastCursorUpdateRef.current = now;
    const position = editor.getPosition();
    
    if (!position) return;
    
    const model = editor.getModel();
    if (!model) return;
    
    // Créer l'objet position du curseur
    const cursorPosition: CursorPosition = {
      position: model.getOffsetAt(position),
      line: position.lineNumber,
      column: position.column
    };
    
    // Envoyer la mise à jour
    updateCursorPosition(cursorPosition);
  };

  // Configuration de l'éditeur et des événements liés au curseur
  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    console.log("[Editor] Editor mounted and ready");
    
    // Événements pour les mises à jour du curseur avec debounce intégré
    let cursorUpdateTimeout: NodeJS.Timeout | null = null;
    
    editorInstance.onDidChangeCursorPosition(() => {
      // Annuler le timeout précédent s'il existe
      if (cursorUpdateTimeout) {
        clearTimeout(cursorUpdateTimeout);
      }
      
      // Programmer une nouvelle mise à jour avec un délai de 50ms
      cursorUpdateTimeout = setTimeout(() => {
        handleCursorUpdate();
        cursorUpdateTimeout = null;
      }, 50);
    });
    
    // Événement pour détecter le focus/blur sur l'éditeur
    editorInstance.onDidFocusEditorText(() => {
      console.log("[Editor] Editor focused, starting cursor tracking");
      // Envoyer la position initiale
      handleCursorUpdate(true);
    });
    
    // Mise à jour après le chargement complet
    setTimeout(() => handleCursorUpdate(true), 500);
  };
  
  // Envoi périodique de la position du curseur (heartbeat) optimisé
  useEffect(() => {
    console.log("[Editor] Starting cursor heartbeat");
    
    // Heartbeat plus fréquent quand connecté, moins fréquent quand déconnecté
    const heartbeatInterval = isConnected ? 3000 : 10000;
    
    // Variable pour suivre la dernière position envoyée
    let lastSentPosition = {
      line: -1,
      column: -1
    };
    
    const sendHeartbeat = () => {
      const editor = editorRef.current;
      if (!editor) return;
      
      const position = editor.getPosition();
      if (!position) return;
      
      // Ne pas renvoyer la même position sauf si nous venons de nous reconnecter
      const shouldSend = position.lineNumber !== lastSentPosition.line || 
                          position.column !== lastSentPosition.column || 
                          !wasConnectedRef.current;
      
      if (shouldSend) {
        // Mettre à jour la dernière position envoyée
        lastSentPosition = {
          line: position.lineNumber,
          column: position.column
        };
        
        const model = editor.getModel();
        if (!model) return;
        
        // Envoyer la position
        const cursorPosition = {
          position: model.getOffsetAt(position),
          line: position.lineNumber,
          column: position.column
        };
        
        console.log('[Heartbeat] Sending cursor position:', cursorPosition);
        updateCursorPosition(cursorPosition);
      }
    };
    
    const intervalId = setInterval(sendHeartbeat, heartbeatInterval);
    
    // Envoyer la position initiale après un court délai
    setTimeout(sendHeartbeat, 500);
    
    return () => clearInterval(intervalId);
  }, [isConnected, updateCursorPosition]);

  return (
    <div className="flex flex-col h-screen w-full">
      {/* En-tête avec statut de connexion et diagnostic */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold truncate">Document: {documentId}</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            {connectedUsers.length > 0 ? (
              <span>{connectedUsers.length} utilisateurs connectés</span>
            ) : (
              <span>Aucun autre utilisateur</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
          </div>
        </div>
      </div>
      
      {/* Message d'erreur si nécessaire */}
      {error && (
        <div className="bg-red-500 text-white p-2 text-center">
          {error}
        </div>
      )}
      
      {/* Layout principal: éditeur + liste des utilisateurs */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 h-full relative" style={{ minHeight: "500px" }}>
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 z-10">
              <p className="text-white">Connexion en cours...</p>
            </div>
          )}
          <Editor
            height="100%"
            language="markdown"
            theme="vs-dark"
            value={content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              wordWrap: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false
            }}
            className="border-2 border-gray-700" // Ajouter une bordure pour visualiser la zone
          />
          
          {/* Ajouter le composant RemoteCursors */}
          <RemoteCursors 
            editor={editorRef.current} 
            users={connectedUsers} 
            currentUserId={userId} 
          />
        </div>
        
        {/* Panneau latéral avec la liste des utilisateurs */}
        <div className="w-64 bg-slate-900 p-4 overflow-y-auto">
          <UserList 
            users={connectedUsers} 
            currentUserId={userId} 
          />
          
          {/* Information sur la dernière mise à jour */}
          {document && (
            <div className="mt-4 text-xs text-slate-400">
              <p>Version: {document.version}</p>
              <p>Dernière mise à jour: {new Date(document.lastUpdated).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedDocument;
