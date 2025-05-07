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
        <aside className="w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"> {/* Ajout d'effets de transition et de transformation */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h2>
            <nav className="space-y-2">
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'general' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-300 ease-in-out`}
                onClick={() => setSelectedSection('general')}
              >
                Paramètres Généraux
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'account' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-300 ease-in-out`}
                onClick={() => setSelectedSection('account')}
              >
                Paramètres du Compte
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'notifications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-300 ease-in-out`}
                onClick={() => setSelectedSection('notifications')}
              >
                Paramètres de Notification
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg ${selectedSection === 'privacy' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors duration-300 ease-in-out`}
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
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Une plateforme pour écrire des livres en collaboration.</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Logo</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <img src="/path/to/logo.png" alt="Logo de l'application" className="h-12 w-12"/>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Langue</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Français</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Fuseau Horaire</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Europe/Paris</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email de Support</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">support@example.com</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Numéro de Téléphone</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">+33 1 23 45 67 89</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Adresse</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">123 Rue de l'Exemple, 75001 Paris, France</dd>
          </div>
        </dl>
      </div>
    </div>
  );

const AccountSettings: React.FC = () => {
  const [email, setEmail] = useState('user@example.com');
  const [username, setUsername] = useState('username123');
  const [password, setPassword] = useState('********');
  const [phone, setPhone] = useState('+33 1 23 45 67 89');
  const [address, setAddress] = useState("123 Rue de l'Exemple, 75001 Paris, France");
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [isEditing, setIsEditing] = useState({
    email: false,
    username: false,
    password: false,
    phone: false,
    photo: false,
    address: false,
  });
  
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const handleSave = () => {
    console.log('Settings saved');
    setIsEditing({
      email: false,
      username: false,
      password: false,
      phone: false,
      photo: false,
      address: false,
    });
  };

  const renderField = (field: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => (
    <div
      className="flex items-center"
      onMouseEnter={() => setHoveredField(field)}
      onMouseLeave={() => setHoveredField(null)}
    >
      {isEditing[field as keyof typeof isEditing] ? (
        <input
          type={field === 'password' ? 'password' : 'text'}
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      ) : (
        <span>{value}</span>
      )}
      {hoveredField === field && (
        <button
          onClick={() => setIsEditing({ ...isEditing, [field]: !isEditing[field as keyof typeof isEditing] })}
          className="ml-4 text-blue-600 hover:text-blue-900"
        >
          {isEditing[field as keyof typeof isEditing] ? 'Annuler' : 'Modifier'}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres du Compte</h3>
        <button
          onClick={handleSave}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Enregistrer
        </button>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {renderField('email', email, setEmail)}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Nom d'utilisateur</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {renderField('username', username, setUsername)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Mot de passe</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {renderField('password', password, setPassword)}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Numéro de Téléphone</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {renderField('phone', phone, setPhone)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Adresse</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {renderField('address', address, setAddress)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

  const NotificationSettings: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [frequency, setFrequency] = useState('daily');
  
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres de Notification</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notifications par Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Activées</span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notifications Push</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Activées</span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notifications par SMS</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Activées</span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Fréquence des Notifications</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="immediately">Immédiatement</option>
                  <option value="daily">Quotidiennement</option>
                  <option value="weekly">Hebdomadairement</option>
                </select>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Préférences de Notification</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5">
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2">Recevoir des notifications par email</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2">Recevoir des notifications push</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2">Recevoir des notifications par SMS</span>
                    </label>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };

  const PrivacySettings: React.FC = () => {
    const [dataSharing, setDataSharing] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState('public');
    const [thirdPartyApps, setThirdPartyApps] = useState(true);
    const [adPreferences, setAdPreferences] = useState(true);
  
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Paramètres de Confidentialité</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Partage de Données</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => setDataSharing(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{dataSharing ? 'Activé' : 'Désactivé'}</span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Visibilité du Profil</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="public">Public</option>
                  <option value="private">Privé</option>
                  <option value="friends">Amis seulement</option>
                </select>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Applications Tierces</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={thirdPartyApps}
                  onChange={(e) => setThirdPartyApps(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{thirdPartyApps ? 'Autorisé' : 'Non Autorisé'}</span>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Préférences de Publicité</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={adPreferences}
                  onChange={(e) => setAdPreferences(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">{adPreferences ? 'Personnalisées' : 'Non Personnalisées'}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };

export default Settings;