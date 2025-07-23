
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippets');
const commentRoutes = require('./routes/comments');
const bookmarkRoutes = require('./routes/bookmarks');
const jobListingRoutes = require('./routes/jobListings');
const premiumSnippetRoutes = require('./routes/premiumSnippets');
const challengeSubmissionRoutes = require('./routes/challengeSubmissions');
// const followRoutes = require('./routes/follows');
// const challengeRoutes = require('./routes/challenges');
// const collectionRoutes = require('./routes/collections');
// const notificationRoutes = require('./routes/notifications');
// const userRoutes = require('./routes/users');
// const messageRoutes = require('./routes/messages');
// const teamRoutes = require('./routes/teams');
// const analyticsRoutes = require('./routes/analytics');
// const liveSessionRoutes = require('./routes/liveSessions');
// const reviewRoutes = require('./routes/reviews');
// const learningPathRoutes = require('./routes/learningPaths');
// const UserInteraction = require('./models/userInteraction');
// const Team = require('./models/team');
// const TeamMember = require('./models/teamMember');
// const LiveSession = require('./models/liveSession');
// const Tip = require('./models/tip');
// const Review = require('./models/review');
// const ReviewComment = require('./models/reviewComment');
// const LearningPath = require('./models/learningPath');
// const LearningPathSnippet = require('./models/learningPathSnippet');
// const UserLearningPathProgress = require('./models/userLearningPathProgress');
// const Badge = require('./models/badge');
// const assessmentRoutes = require('./routes/assessments');
const sequelize = require('./config/database');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-snippet', (snippetId) => {
    socket.join(snippetId);
    console.log(`User joined snippet: ${snippetId}`);
  });

  socket.on('code-change', (snippetId, newCode) => {
    socket.to(snippetId).emit('code-update', newCode);
  });

  socket.on('cursor-change', (snippetId, cursorPosition) => {
    socket.to(snippetId).emit('cursor-update', cursorPosition);
  });

  socket.on('chat-message', (snippetId, message) => {
    socket.to(snippetId).emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/job-listings', jobListingRoutes);
app.use('/api/premium-snippets', premiumSnippetRoutes);
// app.use('/api/follows', followRoutes);
// app.use('/api/challenges', challengeRoutes);
// app.use('/api/collections', collectionRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/teams', teamRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/live-sessions', liveSessionRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/learning-paths', learningPathRoutes);
// app.use('/api/assessments', assessmentRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database synchronization error:', err);
});
