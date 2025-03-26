import React from 'react';
import { ConnectedUser } from '../types/document';
import { generateUserColor, getContrastTextColor } from '../utils/colorUtils';

interface UserListProps {
  users: ConnectedUser[];
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div>
      <h2 className="text-white font-semibold mb-3">Utilisateurs connectés</h2>
      <ul className="space-y-2">
        {users.map(user => {
          const isCurrentUser = user.userId === currentUserId;
          const userColor = generateUserColor(user.userId);
          const textColor = getContrastTextColor(userColor);
          
          return (
            <li 
              key={user.userId} 
              className={`rounded p-2`}
              style={{ 
                backgroundColor: isCurrentUser ? 'rgba(255, 255, 255, 0.1)' : userColor,
                color: isCurrentUser ? 'white' : textColor
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium">
                    {user.username} {isCurrentUser && '(vous)'}
                  </span>
                </div>
                
                {/* Indicateur de curseur actif */}
                {!isCurrentUser && user.cursor_line >= 0 && user.cursor_column >= 0 && (
                  <div className="text-xs whitespace-nowrap ml-2" title={`Ligne ${user.cursor_line}, Colonne ${user.cursor_column}`}>
                    L:{user.cursor_line}, C:{user.cursor_column}
                  </div>
                )}
              </div>
            </li>
          );
        })}
        {users.length === 0 && (
          <li className="text-slate-400 italic">
            Aucun utilisateur connecté
          </li>
        )}
      </ul>
    </div>
  );
};

export default UserList;
