
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const LiveSession = sequelize.define('LiveSession', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  streamUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recordingUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING, // e.g., 'scheduled', 'live', 'ended'
    allowNull: false,
    defaultValue: 'scheduled'
  },
  snippetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Snippets',
      key: 'id'
    }
  }
});

User.hasMany(LiveSession, { foreignKey: 'hostId' });
LiveSession.belongsTo(User, { foreignKey: 'hostId' });

module.exports = LiveSession;
