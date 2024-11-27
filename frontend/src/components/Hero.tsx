import React from 'react';
import { Users } from 'lucide-react';

export default function Hero() {
  return (
    <div className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Écrivez des histoires ensemble
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Découvrez le plaisir de la co-écriture. Créez des histoires uniques 
          avec des écrivains du monde entier ou vos amis.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
            <Users className="h-5 w-5" />
            Rejoindre l'aventure
          </button>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg border-2 border-purple-600 hover:bg-purple-50 transition">
            En savoir plus
          </button>
        </div>

        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Collaborative Writing"
            className="rounded-xl shadow-2xl mx-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}