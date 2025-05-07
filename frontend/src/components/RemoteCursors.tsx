import React, { useEffect, useRef } from 'react';
import { editor } from 'monaco-editor';
import { ConnectedUser } from '../types/document';
import { generateUserColor, getContrastTextColor } from '../utils/colorUtils';

interface RemoteCursorsProps {
  editor: editor.IStandaloneCodeEditor | null;
  users: ConnectedUser[];
  currentUserId: string;
}

interface CursorDecoration {
  userId: string;
  decorationId?: string;
  color: string;
}

const RemoteCursors: React.FC<RemoteCursorsProps> = ({ editor, users, currentUserId }) => {
  // Garder une trace des décorations pour pouvoir les supprimer plus tard
  const decorationsRef = useRef<CursorDecoration[]>([]);

  useEffect(() => {
    if (!editor) return;

    // Fonction pour créer/mettre à jour les décorations
    const updateCursors = () => {
      if (!editor) return;
      
      const model = editor.getModel();
      if (!model) return;
      
      // Filtrer les utilisateurs (exclure l'utilisateur actuel et ceux sans position de curseur)
      const remoteUsers = users.filter(user => 
        user.userId !== currentUserId && 
        user.cursor_line >= 0 && 
        user.cursor_column >= 0
      );
      
      console.log('Updating remote cursors for users:', remoteUsers.map(u => u.username));
      
      // Supprimer les anciennes décorations
      if (decorationsRef.current.length > 0) {
        const oldDecorationIds = decorationsRef.current
          .map(d => d.decorationId)
          .filter((id): id is string => id !== undefined);
        
        if (oldDecorationIds.length > 0) {
          editor.deltaDecorations(oldDecorationIds, []);
        }
      }
      
      // Créer les nouvelles décorations
      const newDecorations: CursorDecoration[] = [];
      const decorationOptions: editor.IModelDeltaDecoration[] = [];
      
      remoteUsers.forEach(user => {
        try {
          const position = {
            lineNumber: user.cursor_line,
            column: user.cursor_column
          };
          
          // Générer une couleur unique pour cet utilisateur
          const userColor = generateUserColor(user.userId);
          const textColor = getContrastTextColor(userColor);
          
          // Créer les options de décoration (curseur + étiquette)
          decorationOptions.push({
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            options: {
              className: 'remote-cursor-line',
              glyphMarginClassName: 'remote-cursor-gutter',
              hoverMessage: { value: `${user.username} est ici` },
              // Curseur vertical coloré
              beforeContentClassName: `remote-cursor-before remote-cursor-${user.userId.replace(/[^a-zA-Z0-9]/g, '')}`,
              // Marqueur de curseur avec nom
              after: {
                content: ` ${user.username}`,
                inlineClassName: `remote-cursor-label remote-cursor-label-${user.userId.replace(/[^a-zA-Z0-9]/g, '')}`
              },
              // Style spécifique pour ce curseur (injecté via styleElement)
              stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
            }
          });
          
          // Ajouter le style personnalisé pour ce curseur dans le DOM
          addCursorStyle(user.userId, userColor, textColor);
          
          // Mémoriser cette décoration
          newDecorations.push({
            userId: user.userId,
            color: userColor
          });
          
        } catch (error) {
          console.error('Erreur lors de la création de décoration de curseur:', error);
        }
      });
      
      // Appliquer les décorations
      if (decorationOptions.length > 0) {
        const decorationIds = editor.deltaDecorations([], decorationOptions);
        
        // Mettre à jour les références avec les IDs
        newDecorations.forEach((dec, index) => {
          dec.decorationId = decorationIds[index];
        });
      }
      
      // Mettre à jour notre référence
      decorationsRef.current = newDecorations;
    };

    // Fonction pour ajouter le style CSS pour un curseur
    const addCursorStyle = (userId: string, backgroundColor: string, textColor: string) => {
      const sanitizedId = userId.replace(/[^a-zA-Z0-9]/g, '');
      const styleId = `cursor-style-${sanitizedId}`;
      
      // Supprimer le style existant s'il existe
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Créer un nouvel élément de style
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        .remote-cursor-${sanitizedId} {
          border-left: 2px solid ${backgroundColor};
          border-radius: 0;
          margin-left: -1px;
        }
        .remote-cursor-label-${sanitizedId} {
          background-color: ${backgroundColor};
          color: ${textColor};
          padding: 0 4px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
          position: relative;
          top: -1px;
        }
      `;
      
      // Ajouter le style au document
      document.head.appendChild(styleElement);
    };

    // Mettre à jour les curseurs initialement et à chaque changement
    updateCursors();
    
    // Nettoyer les styles et décorations lors du démontage
    return () => {
      if (decorationsRef.current.length > 0) {
        // Supprimer les décorations de l'éditeur
        const oldDecorationIds = decorationsRef.current
          .map(d => d.decorationId)
          .filter((id): id is string => id !== undefined);
        
        if (editor && oldDecorationIds.length > 0) {
          editor.deltaDecorations(oldDecorationIds, []);
        }
      }
      
      // Supprimer les éléments de style
      users.forEach(user => {
        const sanitizedId = user.userId.replace(/[^a-zA-Z0-9]/g, '');
        const styleId = `cursor-style-${sanitizedId}`;
        const styleElement = document.getElementById(styleId);
        if (styleElement) {
          styleElement.remove();
        }
      });
    };
  }, [editor, users, currentUserId]);

  // Ce composant ne rend rien visuellement - tout est géré via l'API Monaco
  return null;
};

export default RemoteCursors;
