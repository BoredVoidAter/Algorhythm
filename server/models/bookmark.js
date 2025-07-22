const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Snippet = require('./snippet');

const Bookmark = sequelize.define('Bookmark', {});

User.hasMany(Bookmark, { foreignKey: 'userId' });
Bookmark.belongsTo(User, { foreignKey: 'userId' });

Snippet.hasMany(Bookmark, { foreignKey: 'snippetId' });
Bookmark.belongsTo(Snippet, { foreignKey: 'snippetId' });

module.exports = Bookmark;