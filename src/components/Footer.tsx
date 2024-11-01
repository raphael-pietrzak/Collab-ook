import React from 'react';
import { BookOpenCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpenCheck className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Collab'ook</span>
            </div>
            <p className="text-gray-600">
              La plateforme d'écriture collaborative qui libère votre créativité.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Explorer</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-purple-600">Découvrir</a></li>
              <li><a href="#" className="hover:text-purple-600">Défis</a></li>
              <li><a href="#" className="hover:text-purple-600">Premium</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Ressources</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-purple-600">Guide</a></li>
              <li><a href="#" className="hover:text-purple-600">Blog</a></li>
              <li><a href="#" className="hover:text-purple-600">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Légal</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-purple-600">Conditions</a></li>
              <li><a href="#" className="hover:text-purple-600">Confidentialité</a></li>
              <li><a href="#" className="hover:text-purple-600">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>© 2024 Collab'ook. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}