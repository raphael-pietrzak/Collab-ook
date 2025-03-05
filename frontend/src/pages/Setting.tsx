import React, { useState } from 'react';
import Footer from '../components/home/Footer';

const Settings: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('general');

  const renderSection = () => {
    switch (selectedSection) {
      case 'general':
        return <GeneralSettings />;
      case 'account':
        return <AccountSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'privacy':
        return <PrivacySettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">

      <div className="flex flex-1 h-[1000px]">
        <aside className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h2>
            <nav className="space-y-2">
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'general' ? 'bg-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSelectedSection('general')}
              >
                Paramètres Généraux
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'account' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSelectedSection('account')}
              >
                Paramètres du Compte
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'notifications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSelectedSection('notifications')}
              >
                Paramètres de Notification
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'privacy' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSelectedSection('privacy')}
              >
                Paramètres de Confidentialité
              </button>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-6">
          {renderSection()}
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

const GeneralSettings: React.FC = () => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres Généraux</h3>
    </div>
    <div className="border-t border-gray-200">
      <dl>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Nom de l'application</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Collaborative Writing App</dd>
        </div>
        {/* Ajoutez d'autres paramètres généraux ici */}
      </dl>
    </div>
  </div>
);

const AccountSettings: React.FC = () => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres du Compte</h3>
    </div>
    <div className="border-t border-gray-200">
      <dl>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">user@example.com</dd>
        </div>
        {/* Ajoutez d'autres paramètres de compte ici */}
      </dl>
    </div>
  </div>
);

const NotificationSettings: React.FC = () => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres de Notification</h3>
    </div>
    <div className="border-t border-gray-200">
      <dl>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Notifications par Email</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Activées</dd>
        </div>
        {/* Ajoutez d'autres paramètres de notification ici */}
      </dl>
    </div>
  </div>
);

const PrivacySettings: React.FC = () => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres de Confidentialité</h3>
    </div>
    <div className="border-t border-gray-200">
      <dl>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Partage de Données</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Désactivé</dd>
        </div>
        {/* Ajoutez d'autres paramètres de confidentialité ici */}
      </dl>
    </div>
  </div>
);

export default Settings;