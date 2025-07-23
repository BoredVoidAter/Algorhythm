
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

User.hasMany(Team, { foreignKey: 'ownerId' });
Team.belongsTo(User, { foreignKey: 'ownerId' });

module.exports = Team;
