const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Assessment = require('./assessment');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  passed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' },
    allowNull: false,
  },
  assessmentId: {
    type: DataTypes.INTEGER,
    references: { model: 'Assessments', key: 'id' },
    allowNull: false,
  },
});

Submission.belongsTo(User, { foreignKey: 'userId' });
Submission.belongsTo(Assessment, { foreignKey: 'assessmentId' });

module.exports = Submission;