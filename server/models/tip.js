
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Snippet = require('./snippet');

const Tip = sequelize.define('Tip', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

User.hasMany(Tip, { foreignKey: 'tipperId', as: 'SentTips' });
Tip.belongsTo(User, { foreignKey: 'tipperId', as: 'Tipper' });

User.hasMany(Tip, { foreignKey: 'creatorId', as: 'ReceivedTips' });
Tip.belongsTo(User, { foreignKey: 'creatorId', as: 'Creator' });

Snippet.hasMany(Tip, { foreignKey: 'snippetId' });
Tip.belongsTo(Snippet, { foreignKey: 'snippetId' });

module.exports = Tip;
