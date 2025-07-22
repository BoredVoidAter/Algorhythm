const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Follow = sequelize.define('Follow', {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(Follow, { foreignKey: 'followerId', as: 'Followers' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'Following' });
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'Follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'Following' });

module.exports = Follow;
