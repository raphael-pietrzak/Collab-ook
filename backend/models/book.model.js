const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assure-toi d’avoir un fichier de config pour la DB

const Book = sequelize.define('books', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  timestamps: false
});


module.exports = Book;