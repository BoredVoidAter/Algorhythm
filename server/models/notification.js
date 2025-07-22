const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Notification = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., 'like', 'comment', 'follow', 'fork'
  },
  sourceId: {
    type: DataTypes.INTEGER,
    allowNull: true, // ID of the liked snippet, commented snippet, followed user, forked snippet
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = Notification;
