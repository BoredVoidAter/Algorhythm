
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const LearningPath = require('./learningPath');
const Snippet = require('./snippet');

const LearningPathSnippet = sequelize.define('LearningPathSnippet', {
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  // Foreign key for the snippet
  snippetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Snippets',
      key: 'id'
    }
  }
});

LearningPathSnippet.belongsTo(LearningPath, { foreignKey: 'learningPathId' });
LearningPath.hasMany(LearningPathSnippet, { foreignKey: 'learningPathId' });

LearningPathSnippet.belongsTo(Snippet, { foreignKey: 'snippetId' });
Snippet.hasMany(LearningPathSnippet, { foreignKey: 'snippetId' });

module.exports = LearningPathSnippet;
