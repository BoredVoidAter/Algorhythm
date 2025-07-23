
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Team = require('./team');
const User = require('./user');

const TeamMember = sequelize.define('TeamMember', {
  role: {
    type: DataTypes.STRING, // e.g., 'admin', 'member'
    allowNull: false,
    defaultValue: 'member'
  }
});

Team.belongsToMany(User, { through: TeamMember, foreignKey: 'teamId' });
User.belongsToMany(Team, { through: TeamMember, foreignKey: 'userId' });

module.exports = TeamMember;
