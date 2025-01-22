import React, { useState, useEffect } from 'react';
import { BookOpenCheck, User } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (par exemple via un token dans localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token pour déconnecter
    setIsLoggedIn(false);
    window.location.href = '/'; // Rediriger vers la page d'accueil
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpenCheck className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-indigo-500 cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              Collab'ook
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isLoggedIn ? (
              <>
                <a href="#" className="text-gray-600 hover:text-purple-600">Découvrir</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">Défis</a>
                <a href="#" className="text-gray-600 hover:text-purple-600">Premium</a>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  onClick={() => window.location.href = '/gallery'}
                >
                  Commencer
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/gallery" className="text-gray-600 hover:text-purple-600">Galerie</a>
                <a href="/editor" className="text-gray-600 hover:text-purple-600">Editor</a>
                <a href="/profile" className="text-gray-600 hover:text-purple-600 flex items-center space-x-2">
                  <User className="h-6 w-6" />
                  <span>Mon Profil</span>
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