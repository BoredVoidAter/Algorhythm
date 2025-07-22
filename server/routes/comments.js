const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Snippet = require('../models/snippet');
const User = require('../models/user');
const Notification = require('../models/notification');
const auth = require('../middleware/auth');

// Get comments for a snippet
router.get('/:snippetId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { snippetId: req.params.snippetId },
      include: [{ model: User, attributes: ['username'] }]
    });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a comment to a snippet
router.post('/:snippetId', auth, async (req, res) => {
  const { content } = req.body;
  try {
    const newComment = await Comment.create({
      content,
      userId: req.user.id,
      snippetId: req.params.snippetId
    });

    // Create notification for the snippet owner
    const snippet = await Snippet.findByPk(req.params.snippetId);
    if (snippet && snippet.userId !== req.user.id) { // Don't notify if user comments on their own snippet
      await Notification.create({
        userId: snippet.userId,
        type: 'comment',
        sourceId: snippet.id,
        message: `Your snippet "${snippet.title}" received a new comment from ${req.user.email}.`,
      });
    }

    res.json(newComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;