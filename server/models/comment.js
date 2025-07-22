const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Snippet = require('./snippet');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Snippet.hasMany(Comment, { foreignKey: 'snippetId' });
Comment.belongsTo(Snippet, { foreignKey: 'snippetId' });

module.exports = Comment;