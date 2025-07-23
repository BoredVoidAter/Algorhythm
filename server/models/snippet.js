
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

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
  }
});

User.hasMany(Snippet, { foreignKey: 'userId' });
Snippet.belongsTo(User, { foreignKey: 'userId' });

module.exports = Snippet;
