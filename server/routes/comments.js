const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Snippet = require('../models/snippet');
const User = require('../models/user');
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
    res.json(newComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;