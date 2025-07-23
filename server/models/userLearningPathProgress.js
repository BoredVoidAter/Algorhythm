
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const LearningPath = require('./learningPath');
const Snippet = require('./snippet');

const UserLearningPathProgress = sequelize.define('UserLearningPathProgress', {
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Foreign key for the user
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // Foreign key for the learning path
  learningPathId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'LearningPaths',
      key: 'id'
    }
  },
  // Foreign key for the last completed snippet in the path
  lastCompletedSnippetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Snippets',
      key: 'id'
    }
  }
});

UserLearningPathProgress.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserLearningPathProgress, { foreignKey: 'userId' });

UserLearningPathProgress.belongsTo(LearningPath, { foreignKey: 'learningPathId' });
LearningPath.hasMany(UserLearningPathProgress, { foreignKey: 'learningPathId' });

UserLearningPathProgress.belongsTo(Snippet, { foreignKey: 'lastCompletedSnippetId' });
Snippet.hasMany(UserLearningPathProgress, { foreignKey: 'lastCompletedSnippetId' });

module.exports = UserLearningPathProgress;
