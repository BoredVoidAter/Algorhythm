const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Snippet = require('./snippet');

const UserInteraction = sequelize.define('UserInteraction', {
  type: {
    type: DataTypes.STRING, // 'like', 'bookmark', 'view'
    allowNull: false
  },
  tags: {
    type: DataTypes.STRING, // Comma-separated tags of the interacted snippet
    allowNull: true
  }
});

User.hasMany(UserInteraction, { foreignKey: 'userId' });
UserInteraction.belongsTo(User, { foreignKey: 'userId' });

Snippet.hasMany(UserInteraction, { foreignKey: 'snippetId' });
UserInteraction.belongsTo(Snippet, { foreignKey: 'snippetId' });

module.exports = UserInteraction;
