
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Team = require('./team');

const Snippet = sequelize.define('Snippet', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.STRING, // Storing tags as a comma-separated string
    allowNull: true
  },
  forkedFrom: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Snippets',
      key: 'id'
    }
  },
  audioWalkthroughUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  videoWalkthroughUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Teams',
      key: 'id'
    }
  },
  coAuthors: {
    type: DataTypes.STRING, // Storing co-author user IDs as a comma-separated string
    allowNull: true
  },
  reviewStatus: {
    type: DataTypes.ENUM('None', 'Review Requested', 'Changes Needed', 'Approved'),
    defaultValue: 'None'
  }
});

User.hasMany(Snippet, { foreignKey: 'userId' });
Snippet.belongsTo(User, { foreignKey: 'userId' });

Team.hasMany(Snippet, { foreignKey: 'teamId' });
Snippet.belongsTo(Team, { foreignKey: 'teamId' });

module.exports = Snippet;
