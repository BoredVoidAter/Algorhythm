
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  githubLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  personalWebsiteLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pinnedSnippetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Snippets',
      key: 'id'
    }
  }
});

module.exports = User;
