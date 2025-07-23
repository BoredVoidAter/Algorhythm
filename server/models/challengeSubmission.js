const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChallengeSubmission = sequelize.define('ChallengeSubmission', {
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  challengeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Challenges',
      key: 'id'
    }
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  performanceMetrics: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = ChallengeSubmission;