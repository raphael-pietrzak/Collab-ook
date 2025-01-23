import React, { useEffect, useState, useRef } from 'react';
import { Users, Save } from 'lucide-react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');


interface User {
  id: number;
  username: string;
}

interface CursorPosition {
  userId: number;
  username: string;
  position: number;
  line: number;
  column: number;
}

function Document() {
  const [content, setContent] = useState('');
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const measureDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeDocument = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/documents', {
          method: 'POST'
        });
        const document = await response.json();
        console.log('Created document:', document);
        setDocumentId(1);

        // Join document room
        socket.emit('join-document', {documentId: 1, userId:1});
      } catch (error) {
        console.error('Error creating document:', error);
      }
    };

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('load-document', ({ content, lastUpdated }) => {
      setContent(content);
      setLastSaved(new Date(lastUpdated));
    });

    socket.on('document-updated', ({ content, lastUpdated }) => {
      setContent(content);
      setLastSaved(new Date(lastUpdated));
    });

    socket.on('users-changed', (users: User[]) => {
      setConnectedUsers(users);
      console.log('Connected users:', users);
    });

    socket.on('cursor-update', (cursorData: CursorPosition) => {
      console.log('Cursor update:', cursorData);
      setCursors(prev => {
        const filtered = prev.filter(c => c.userId !== cursorData.userId);
        return [...filtered, cursorData];
      });
      console.log('Cursor updated:', cursorData);
    });

    initializeDocument();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('load-document');
      socket.off('document-updated');
      socket.off('users-changed');
      socket.off('cursor-update');
    };
  }, []);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setLastSaved(new Date());
    console.log('Content changed:', newContent);
    if (documentId) {
      socket.emit('update-document', {
        documentId,
        content: newContent
      });
    }
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const position = textareaRef.current.selectionStart;
      const value = textareaRef.current.value;
      const lines = value.substr(0, position).split('\n');
      const line = lines.length - 1;
      const column = lines[lines.length - 1].length;

      socket.emit('cursor-move', {
        documentId,
        position,
        line,
        column
      });

      console.log('Selection changed:', { position, line, column });
    }
  };

  const getCursorCoordinates = (position: number): { x: number; y: number } => {
    if (!textareaRef.current || !measureDivRef.current) return { x: 0, y: 0 };

    const text = textareaRef.current.value;
    const textBeforeCursor = text.substring(0, position);
    const lines = textBeforeCursor.split('\n');
    
    // Créer un span temporaire pour mesurer
    const span = document.createElement('span');
    span.textContent = lines[lines.length - 1];
    
    // Copier le style de textarea
    const textareaStyle = window.getComputedStyle(textareaRef.current);
    span.style.font = textareaStyle.font;
    span.style.whiteSpace = 'pre';
    
    measureDivRef.current.appendChild(span);
    const width = span.offsetWidth;
    measureDivRef.current.removeChild(span);

    // Calculer la hauteur de ligne
    const lineHeight = parseInt(textareaStyle.lineHeight);
    const top_margin = 42
    const left_margin = 39

    return {
      x: width + left_margin,
      y: (lines.length - 1) * lineHeight + top_margin
    };
  };

  const renderCursors = () => {
    return cursors.map((cursor) => {
      const { x, y } = getCursorCoordinates(cursor.position);
      return (
        <div
          key={cursor.userId}
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '2px',
            height: '20px',
            backgroundColor: `hsl(${cursor.userId * 137.5 % 360}, 70%, 50%)`,
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '2px',
              padding: '2px 6px',
              backgroundColor: `hsl(${cursor.userId * 137.5 % 360}, 70%, 50%)`,
              color: 'white',
              borderRadius: '3px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            {cursor.username}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm text-gray-600">
                {connectedUsers.length} utilisateurs connectés
              </span>
            </div>
            {lastSaved && (
              <div className="flex items-center text-sm text-gray-600">
                <Save className="w-4 h-4 mr-1" />
                Sauvegardé à {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </header>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onSelect={handleSelectionChange}
            className="w-full h-[60vh] p-4 text-gray-800 border-0 focus:ring-0 resize-none"
            placeholder="Commencez à écrire ici..."
          />
          <div ref={measureDivRef} style={{ position: 'absolute', visibility: 'hidden' }} />
          {renderCursors()}
        </div>
      </div>
    </div>
  );
}

export default Document;