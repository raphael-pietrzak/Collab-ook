import React, { useState, useEffect, useRef } from 'react';
import { useDocumentSocket } from '../hooks/useDocumentSocket';
import UserList from './UserList';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { TextOperation } from '../types/document';
import RemoteCursors from './RemoteCursors';

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
  
  // Nouvelle fonction pour mettre à jour la position du curseur plus fréquemment
  const setupCursorTracking = (editor: editor.IStandaloneCodeEditor) => {
    let debounceTimeout: NodeJS.Timeout | null = null;
    
    const updateCursorDebounced = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      
      debounceTimeout = setTimeout(() => {
        const position = editor.getPosition();
        if (position) {
          updateCursorPosition({
            position: editor.getModel()?.getOffsetAt(position) || 0,
            line: position.lineNumber,
            column: position.column
          });
        }
      }, 50); // Délai court pour ne pas surcharger le serveur
    };

    // Écouter les mouvements du curseur
    editor.onDidChangeCursorPosition(updateCursorDebounced);
    
    // Écouter le défilement pour mettre à jour le curseur même sans déplacement
    editor.onDidScrollChange(updateCursorDebounced);
  };
  
  // Envoyer régulièrement la position du curseur même sans mouvement
  useEffect(() => {
    if (!editorRef.current || !isConnected) return;
    
    // Fonction pour envoyer la position actuelle du curseur
    const sendCurrentPosition = () => {
      const editor = editorRef.current;
      if (!editor) return;
      
      const position = editor.getPosition();
      if (position) {
        console.log(`Envoi périodique de la position du curseur: ligne ${position.lineNumber}, colonne ${position.column}`);
        updateCursorPosition({
          position: editor.getModel()?.getOffsetAt(position) || 0,
          line: position.lineNumber,
          column: position.column
        });
      }
    };
    
    // Envoyer la position toutes les 3 secondes
    const intervalId = setInterval(sendCurrentPosition, 3000);
    
    // Envoyer une fois immédiatement après le montage
    setTimeout(sendCurrentPosition, 500);
    
    return () => clearInterval(intervalId);
  }, [isConnected, updateCursorPosition]);
  
  // Modifier le handler de montage pour utiliser la nouvelle fonction de suivi
  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    console.log("Éditeur monté et prêt");
    
    // Configurer le suivi du curseur avec mise en mémoire tampon
    let debounceTimeout: NodeJS.Timeout | null = null;
    
    const updateCursorDebounced = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      
      debounceTimeout = setTimeout(() => {
        const position = editorInstance.getPosition();
        if (position) {
          console.log(`Émission de la position du curseur: ligne ${position.lineNumber}, colonne ${position.column}`);
          updateCursorPosition({
            position: editorInstance.getModel()?.getOffsetAt(position) || 0,
            line: position.lineNumber,
            column: position.column
          });
        }
      }, 50);
    };

    // Écouter les mouvements du curseur
    editorInstance.onDidChangeCursorPosition((e) => {
      updateCursorDebounced();
      // Log direct de la position pour le débogage
      console.log(`Position du curseur changée: ${e.position.lineNumber}:${e.position.column}`);
    });
    
    // Écouter également le défilement pour mettre à jour les positions
    editorInstance.onDidScrollChange(() => {
      updateCursorDebounced();
    });
    
    // Mettre à jour la position initiale après le chargement
    setTimeout(updateCursorDebounced, 500);
    
    // Log plus visible pour le débogage
    console.log("%c Éditeur monté et événements configurés", "background: green; color: white; padding: 2px;");
  };
  
  return (
    <div className="flex flex-col h-screen w-full">
      {/* En-tête avec statut de connexion */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold truncate">Document: {documentId}</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
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
          
          {/* RemoteCursors avec vérification que l'éditeur est monté */}
          {editorRef.current && (
            <RemoteCursors 
              editor={editorRef.current} 
              connectedUsers={connectedUsers}
              currentUserId={userId} 
            />
          )}
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
