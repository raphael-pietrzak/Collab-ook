import React from 'react';
import { Users, Sparkles, MessageSquareShare } from 'lucide-react';

const features = [
  {
    icon: <Users className="h-6 w-6 text-purple-600" />,
    title: "Écriture collaborative",
    description: "Créez des histoires avec vos amis ou rencontrez de nouveaux co-auteurs passionnés."
  },
  {
    icon: <Sparkles className="h-6 w-6 text-purple-600" />,
    title: "Liberté créative",
    description: "Écrivez à votre rythme, explorez différents genres et styles d'écriture."
  },
  {
    icon: <MessageSquareShare className="h-6 w-6 text-purple-600" />,
    title: "Outils de communication",
    description: "Discutez avec vos co-auteurs, partagez des idées et construisez des univers ensemble."
  }
];

export default function Features() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Une nouvelle façon d'écrire
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les outils qui rendront votre expérience d'écriture collaborative unique.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}