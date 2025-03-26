import React, { useEffect, useState } from 'react';
import { editor } from 'monaco-editor';
import { ConnectedUser } from '../types/document';
import { stringToColor, getContrastTextColor } from '../utils/colorUtils';

// Interface pour les curseurs décorés
interface CursorDecoration {
  userId: string;
  username: string;
  decorationIds: string[];
  color: string;
}

interface RemoteCursorsProps {
  editor: editor.IStandaloneCodeEditor | null;
  connectedUsers: ConnectedUser[];
  currentUserId: string;
}

const RemoteCursors: React.FC<RemoteCursorsProps> = ({ 
  editor, 
  connectedUsers,
  currentUserId
}) => {
  const [decorations, setDecorations] = useState<CursorDecoration[]>([]);

  // Mettre à jour les décorations lorsque les utilisateurs ou leurs positions de curseur changent
  useEffect(() => {
    if (!editor) {
      console.log('Editor not ready yet');
      return;
    }
    
    // Log plus détaillé des utilisateurs connectés
    console.log('All connected users:', connectedUsers);
    
    // Filtre les autres utilisateurs qui ont une position de curseur
    const otherUsers = connectedUsers.filter(user => 
      user.userId !== currentUserId && 
      user.cursor_line !== undefined && 
      user.cursor_column !== undefined
    );
    
    console.log('Remote users with cursor positions:', otherUsers);
    
    // Si aucun utilisateur avec position, on arrête là
    if (otherUsers.length === 0) {
      console.log('No remote users with cursor positions found');
      return;
    }

    // Supprimer les anciennes décorations
    const oldDecorations = decorations.flatMap(d => d.decorationIds);
    if (oldDecorations.length > 0) {
      editor.deltaDecorations(oldDecorations, []);
    }

    // Créer de nouvelles décorations pour chaque utilisateur
    const newDecorations: CursorDecoration[] = [];
    
    otherUsers.forEach(user => {
      try {
        const color = stringToColor(user.userId);
        const textColor = getContrastTextColor(color);
        
        console.log(`Adding cursor for ${user.username} at line ${user.cursor_line}, column ${user.cursor_column}`);
        
        // Position du curseur: ligne verticale
        const cursorPosition = {
          range: {
            startLineNumber: user.cursor_line!,
            startColumn: user.cursor_column!,
            endLineNumber: user.cursor_line!,
            endColumn: user.cursor_column!
          },
          options: {
            className: 'remote-cursor',
            hoverMessage: {
              value: user.username,
              isTrusted: true
            },
            zIndex: 100,
            beforeContentClassName: `remote-cursor-line ${user.userId}-cursor`,
          }
        };
        
        // Badge avec le nom d'utilisateur
        const nameBadge = {
          range: {
            startLineNumber: user.cursor_line!,
            startColumn: user.cursor_column!,
            endLineNumber: user.cursor_line!,
            endColumn: user.cursor_column!
          },
          options: {
            afterContentClassName: `remote-cursor-badge ${user.userId}-badge`,
            after: {
              content: user.username, // Utiliser le nom d'utilisateur, pas l'ID
              isTrusted: true
            }
          }
        };
        
        // Appliquer les décorations
        const ids = editor.deltaDecorations(
          [], 
          [cursorPosition, nameBadge]
        );
        
        console.log(`Applied decorations with IDs: ${ids.join(', ')}`);
        
        // Ajouter au CSS dynamique
        addCursorStyle(user.userId, color, textColor, user.username);
        
        // Déclaration de la variable manquante
        const cursorDecorations: string[] = [];
        cursorDecorations.push(...ids);
        
        newDecorations.push({
          userId: user.userId,
          username: user.username,
          decorationIds: cursorDecorations,
          color
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout du curseur pour " + user.username, error);
      }
    });
    
    setDecorations(newDecorations);
    console.log(`Registered ${newDecorations.length} cursors`);
    
    // Nettoyer les styles à la déconnexion
    return () => {
      decorations.forEach(deco => {
        removeCursorStyle(deco.userId);
      });
    };
  }, [editor, connectedUsers, currentUserId]);

  // Mécanisme de test - ajouter un curseur de test si aucun n'est trouvé
  useEffect(() => {
    if (connectedUsers.length > 0 && editor) {
      const othersWithCursor = connectedUsers.filter(u => 
        u.userId !== currentUserId && 
        u.cursor_line !== undefined && 
        u.cursor_column !== undefined
      );
      
      if (othersWithCursor.length === 0) {
        console.log("Aucun utilisateur avec position de curseur trouvé - vérification du pipeline de données");
        
        // Afficher un indicateur visuel pour le débogage
        try {
          const editorElement = editor.getDomNode();
          if (editorElement) {
            const infoDiv = document.createElement('div');
            infoDiv.id = 'cursor-debug-info';
            infoDiv.style.position = 'absolute';
            infoDiv.style.top = '0';
            infoDiv.style.right = '0';
            infoDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
            infoDiv.style.color = 'white';
            infoDiv.style.padding = '5px';
            infoDiv.style.zIndex = '1000';
            infoDiv.style.fontSize = '12px';
            infoDiv.textContent = `${connectedUsers.length} utilisateurs connectés, aucune position de curseur reçue`;
            
            // Supprimer l'élément s'il existe déjà
            const existingInfo = document.getElementById('cursor-debug-info');
            if (existingInfo) existingInfo.remove();
            
            editorElement.appendChild(infoDiv);
            
            // Supprimer après 5 secondes
            setTimeout(() => {
              const element = document.getElementById('cursor-debug-info');
              if (element) element.remove();
            }, 5000);
          }
        } catch (error) {
          console.error("Erreur lors de l'affichage de l'info de débogage", error);
        }
      }
    }
  }, [connectedUsers, editor, currentUserId]);

  // Ajouter des styles CSS pour les curseurs
  const addCursorStyle = (userId: string, bgColor: string, textColor: string, username: string) => {
    const styleId = `cursor-style-${userId}`;
    
    // Supprimer l'ancien style s'il existe
    removeCursorStyle(userId);
    
    // Créer un nouvel élément style
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.innerHTML = `
      .${userId}-cursor::before {
        content: '';
        position: absolute;
        display: inline-block;
        width: 2px !important;
        height: 18px !important;
        background-color: ${bgColor} !important;
        z-index: 1000 !important;
      }
      
      .${userId}-badge::after {
        content: "${username}" !important;
        background-color: ${bgColor} !important;
        color: ${textColor} !important;
        font-size: 12px !important;
        padding: 2px 4px !important;
        border-radius: 3px !important;
        margin-left: 4px !important;
        position: absolute !important;
        top: -18px !important;
        left: 0 !important;
        white-space: nowrap !important;
        z-index: 1000 !important;
      }
    `;
    
    document.head.appendChild(styleEl);
    console.log(`Added style for user ${username} with ID ${userId}`);
  };
  
  // Supprimer le style CSS d'un curseur
  const removeCursorStyle = (userId: string) => {
    const styleId = `cursor-style-${userId}`;
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  };

  return null; // Composant sans rendu visuel (ajoute des décorations directement à l'éditeur)
};

export default RemoteCursors;
