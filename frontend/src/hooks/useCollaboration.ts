// hooks/useCollaboration.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useCollaboration = (chapterId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io('votre-serveur-socket', {
      query: { chapterId }
    });

    newSocket.on('collaborators', (users: string[]) => {
      setCollaborators(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [chapterId]);

  const sendUpdate = (content: string) => {
    if (socket) {
      socket.emit('content-update', { chapterId, content });
    }
  };

  return { collaborators, sendUpdate };
};

export default useCollaboration;