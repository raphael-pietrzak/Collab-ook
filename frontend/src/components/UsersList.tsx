import React from 'react';

interface User {
  userId: string;
  username: string;
}

interface UsersListProps {
  users: User[];
  currentUserId: string;
}

const UsersList: React.FC<UsersListProps> = ({ users, currentUserId }) => {
  // Fonction pour générer une couleur unique basée sur l'ID utilisateur
  const getColorForUser = (userId: string) => {
    const colors = [
      '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'
    ];
    
    // Utilisation du userId pour obtenir un index stable
    const hash = userId.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {users.map(user => (
        <div 
          key={user.userId}
          className="flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: getColorForUser(user.userId),
            color: '#fff'
          }}
        >
          <span className="mr-1">
            {user.userId === currentUserId ? '(Vous) ' : ''}
            {user.username}
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </div>
      ))}
      {users.length === 0 && (
        <div className="text-sm text-gray-500">Aucun utilisateur connecté</div>
      )}
    </div>
  );
};

export default UsersList;
