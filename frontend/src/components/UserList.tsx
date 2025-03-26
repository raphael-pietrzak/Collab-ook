import React from 'react';
import { ConnectedUser } from '../types/document';

interface UserListProps {
  users: ConnectedUser[];
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="bg-slate-800 text-white p-3 rounded-lg">
      <h3 className="text-sm font-semibold mb-2 text-slate-300">
        Utilisateurs connectés ({users.length})
      </h3>
      <ul className="space-y-1.5">
        {users.map(user => (
          <li 
            key={user.userId} 
            className={`flex items-center gap-2 ${
              user.userId === currentUserId ? 'text-green-400' : 'text-white'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm truncate">
              {user.username} 
              {user.userId === currentUserId && ' (vous)'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
