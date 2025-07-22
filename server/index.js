
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippets');
const commentRoutes = require('./routes/comments');
const bookmarkRoutes = require('./routes/bookmarks');
const followRoutes = require('./routes/follows');
const challengeRoutes = require('./routes/challenges');
const UserInteraction = require('./models/userInteraction');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/challenges', challengeRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database synchronization error:', err);
});
