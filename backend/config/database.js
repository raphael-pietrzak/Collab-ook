// config/database.js:

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './local.db'
});

module.exports = sequelize;