import { useEffect, useRef, useState } from 'react';
import { Book, Users, ChevronDown } from 'lucide-react';
// import { useChaptersStore } from '../stores/useChaptersStore';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const userName = `Writer ${Math.floor(Math.random() * 100)}`;
const userColor = getRandomColor();

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('connecting');
  const [activeUsers, setActiveUsers] = useState(0);
  const [connectedUsers, setConnectedUsers] = useState<Array<{ name: string; color: string }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    if (!editorRef.current) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      'demo-document',
      ydoc
    );

    const ytext = ydoc.getText('content');
    const editorElement = editorRef.current;

    // Make the div editable
    editorElement.contentEditable = 'true';
    
    // Sync initial content
    editorElement.textContent = ytext.toString();

    // Handle local changes
    const observer = new MutationObserver(() => {
      if (editorElement.textContent !== ytext.toString()) {
        ytext.delete(0, ytext.length);
        ytext.insert(0, editorElement.textContent || '');
      }
    });

    observer.observe(editorElement, {
      characterData: true,
      childList: true,
      subtree: true
    });

    // Handle remote changes
    ytext.observe(() => {
      const remoteContent = ytext.toString();
      if (editorElement.textContent !== remoteContent) {
        editorElement.textContent = remoteContent;
      }
    });

    // Handle connection status
    provider.on('status', ({ status }: { status: string }) => {
      setStatus(status === 'connected' ? 'connected' : 'connecting');
    });

    // Handle awareness (connected users)
    provider.awareness.setLocalState({
      user: { name: userName, color: userColor }
    });

    provider.awareness.on('change', () => {
      const users = Array.from(provider.awareness.getStates().values())
        .map((state: any) => state.user);
      setConnectedUsers(users);
      setActiveUsers(users.length);
    });

    return () => {
      observer.disconnect();
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* <ChaptersSidebar /> */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg min-h-[calc(100vh-4rem)]">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Book className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">Harry Potter</h1>
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Users className="w-4 h-4" />
                  <span>{activeUsers} online</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                  <span className="w-2 h-2 rounded-full ml-2"
                    style={{
                      backgroundColor: status === 'connected' ? '#10B981' : '#F59E0B',
                    }}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    {connectedUsers.map((user, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: user.color }}
                        />
                        <span>{user.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div 
              ref={editorRef}
              className="p-6 min-h-[calc(100vh-12rem)] focus:outline-none prose prose-lg max-w-none"
              
            />
          </div>
        </div>
      </div>
    </div>
  );
}