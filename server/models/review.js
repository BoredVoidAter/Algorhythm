
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Snippet = require('./snippet');
const User = require('./user');

const Review = sequelize.define('Review', {
  status: {
    type: DataTypes.ENUM('Review Requested', 'Changes Needed', 'Approved'),
    allowNull: false,
    defaultValue: 'Review Requested'
  },
  // Foreign key for the snippet being reviewed
  snippetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Snippets',
      key: 'id'
    }
  },
  // Foreign key for the user who requested the review
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Can be null if no specific reviewer is assigned yet
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // Foreign key for the user who created the snippet
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

Review.belongsTo(Snippet, { foreignKey: 'snippetId' });
Snippet.hasMany(Review, { foreignKey: 'snippetId' });

Review.belongsTo(User, { as: 'Reviewer', foreignKey: 'reviewerId' });
User.hasMany(Review, { as: 'ReviewsGiven', foreignKey: 'reviewerId' });

Review.belongsTo(User, { as: 'Creator', foreignKey: 'creatorId' });
User.hasMany(Review, { as: 'ReviewsReceived', foreignKey: 'creatorId' });

module.exports = Review;
