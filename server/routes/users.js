const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet');
const authenticateToken = require('../middleware/auth');

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Snippet,
        as: 'Snippets'
      }]
    });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['bio', 'githubLink', 'personalWebsiteLink', 'pinnedSnippetId'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
