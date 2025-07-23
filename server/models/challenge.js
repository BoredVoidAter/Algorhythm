const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Challenge = sequelize.define('Challenge', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tag: {
    type: DataTypes.STRING, // Unique tag for the challenge
    allowNull: false,
    unique: true
  },
  isAIGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: true
  },
  testCases: {
    type: DataTypes.JSON,
    allowNull: true
  },
  solutionSnippetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Snippets',
      key: 'id'
    }
  }
});

module.exports = Challenge;
