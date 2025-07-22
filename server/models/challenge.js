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
  }
});

module.exports = Challenge;
