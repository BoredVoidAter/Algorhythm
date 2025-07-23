
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const LearningPath = sequelize.define('LearningPath', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    allowNull: true
  },
  // Foreign key for the creator of the learning path
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

LearningPath.belongsTo(User, { foreignKey: 'creatorId' });
User.hasMany(LearningPath, { foreignKey: 'creatorId' });

module.exports = LearningPath;
