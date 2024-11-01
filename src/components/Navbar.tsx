import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <BookOpenCheck className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Collab'ook
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-purple-600">Découvrir</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Défis</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Premium</a>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"  onClick={() => window.location.href = '/creation'}>
              Commencer
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}