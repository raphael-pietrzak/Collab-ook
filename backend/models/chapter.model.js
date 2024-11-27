// chapter.model.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chapter = sequelize.define('chapters', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_index: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Chapter;