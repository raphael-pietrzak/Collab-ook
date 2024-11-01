import React from 'react';
import { Trophy, Crown, Sparkles } from 'lucide-react';

export default function PremiumFeatures() {
  return (
    <div className="py-20 bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-4">
            Passez à la vitesse supérieure
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Débloquez des fonctionnalités premium pour une expérience d'écriture encore plus riche.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
            <Trophy className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Défis d'écriture</h3>
            <ul className="space-y-3 text-purple-200">
              <li>• Thèmes hebdomadaires</li>
              <li>• Récompenses et badges exclusifs</li>
              <li>• Compétitions d'écriture</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl">
            <Sparkles className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-4">Outils avancés</h3>
            <ul className="space-y-3 text-purple-200">
              <li>• Suivi des contributions</li>
              <li>• Fiches personnages</li>
              <li>• Chat vocal intégré</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}