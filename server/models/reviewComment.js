
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Review = require('./review');
const User = require('./user');

const ReviewComment = sequelize.define('ReviewComment', {
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  lineNumber: {
    type: DataTypes.INTEGER,
    allowNull: true // Null for general comments, specific for line-by-line
  },
  // Foreign key for the review this comment belongs to
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Reviews',
      key: 'id'
    }
  },
  // Foreign key for the user who made the comment
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

ReviewComment.belongsTo(Review, { foreignKey: 'reviewId' });
Review.hasMany(ReviewComment, { foreignKey: 'reviewId' });

ReviewComment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ReviewComment, { foreignKey: 'userId' });

module.exports = ReviewComment;
