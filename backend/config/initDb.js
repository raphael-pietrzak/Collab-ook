const sequelize = require('./database');


const initDb = async () => {
    try {
      // Synchronisation des modèles avec la DB
      await sequelize.sync({ alter: true }); // Utilisez `{ force: true }` pour recréer les tables
      console.log('Les tables ont été synchronisées avec succès.');
    } catch (error) {
      console.error('Erreur lors de la synchronisation des tables :', error);
    }
};
  

module.exports = initDb;