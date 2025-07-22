const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Collection = require('./collection');
const Snippet = require('./snippet');

const CollectionSnippet = sequelize.define('CollectionSnippet', {
  collectionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Collection,
      key: 'id',
    },
  },
  snippetId: {
    type: DataTypes.INTEGER,
    references: {
      model: Snippet,
      key: 'id',
    },
  },
});

Collection.belongsToMany(Snippet, { through: CollectionSnippet, foreignKey: 'collectionId' });
Snippet.belongsToMany(Collection, { through: CollectionSnippet, foreignKey: 'snippetId' });

module.exports = CollectionSnippet;
