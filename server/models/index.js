
const sequelize = require('../config/database');
const Badge = require('./badge');
const Assessment = require('./assessment');
const Submission = require('./submission');
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
const JobListing = require('./jobListing');
const PremiumSnippet = require('./premiumSnippet');
const ChallengeSubmission = require('./challengeSubmission');

// Define associations here if they are not already defined within the model files
User.hasMany(Submission, { foreignKey: 'userId' });
Submission.belongsTo(User, { foreignKey: 'userId' });

Assessment.hasMany(Submission, { foreignKey: 'assessmentId' });
Submission.belongsTo(Assessment, { foreignKey: 'assessmentId' });

Badge.hasMany(Assessment, { foreignKey: 'badgeId' });
Assessment.belongsTo(Badge, { foreignKey: 'badgeId' });

// User earned badges (many-to-many relationship)
const UserBadge = sequelize.define('UserBadge', {}, { timestamps: false });
User.belongsToMany(Badge, { through: UserBadge, foreignKey: 'userId' });
Badge.belongsToMany(User, { through: UserBadge, foreignKey: 'badgeId' });


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
  UserLearningPathProgress,
  Assessment,
  Submission,
  JobListing,
  PremiumSnippet,
  ChallengeSubmission
};
