
const sequelize = require('../config/database');
const Badge = require('./badge');
const Bookmark = require('./bookmark');
const Challenge = require('./challenge');
const Collection = require('./collection');
const CollectionSnippet = require('./collectionSnippet');
const Comment = require('./comment');
const Follow = require('./follow');
const LearningPath = require('./learningPath');
const LearningPathSnippet = require('./learningPathSnippet');
const LiveSession = require('./liveSession');
const Message = require('./message');
const Notification = require('./notification');
const Review = require('./review');
const ReviewComment = require('./reviewComment');
const Snippet = require('./snippet');
const Team = require('./team');
const TeamMember = require('./teamMember');
const Tip = require('./tip');
const User = require('./user');
const UserInteraction = require('./userInteraction');
const UserLearningPathProgress = require('./userLearningPathProgress');

// Define associations here if they are not already defined within the model files
// For example:
// User.hasMany(Snippet, { foreignKey: 'userId' });
// Snippet.belongsTo(User, { foreignKey: 'userId' });

// Sync all models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = {
  Badge,
  Bookmark,
  Challenge,
  Collection,
  CollectionSnippet,
  Comment,
  Follow,
  LearningPath,
  LearningPathSnippet,
  LiveSession,
  Message,
  Notification,
  Review,
  ReviewComment,
  Snippet,
  Team,
  TeamMember,
  Tip,
  User,
  UserInteraction,
  UserLearningPathProgress
};
