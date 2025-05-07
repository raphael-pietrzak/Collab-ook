import { BookOpenCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import logo.svg
import logo from '../../assets/logo.svg';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Bookshelf" className="h-28" />
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!token ? (
              <>
                <a href="#" className="text-gray-600 hover:text-purple-600">Découvrir</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">Défis</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">Premium</a>
                <a href="/login" className="text-gray-600 hover:text-purple-600">Connexion</a>
                <a href="/register" className="text-gray-600 hover:text-purple-600">Inscription</a>
                <a href="/gallery-test" className="text-gray-600 hover:text-purple-600">GallerieTest</a>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => navigate('/gallery')}
                >
                  Commencer
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/gallery-test" className="text-gray-600 hover:text-purple-600">GallerieTest</a>
                <a href="/gallery" className="text-gray-600 hover:text-purple-600">Galerie</a>
                <a href="/editor" className="text-gray-600 hover:text-purple-600">Editor</a>
                <a href="/shared-editor/10" className="text-gray-600 hover:text-purple-600">Document partagé</a>
                <a href="/profile" className="text-gray-600 hover:text-purple-600 flex items-center space-x-2">
                  <User className="h-6 w-6" />
                  <span>{user?.username || 'Utilisateur'}</span>
                </a>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}