const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmark');
const Snippet = require('../models/snippet');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Get all bookmarks for a user
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId: req.user.id },
      include: [{ model: Snippet, include: [{ model: User, attributes: ['username'] }] }]
    });
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a bookmark
router.post('/:snippetId', auth, async (req, res) => {
  try {
    const existingBookmark = await Bookmark.findOne({
      where: { userId: req.user.id, snippetId: req.params.snippetId }
    });

    if (existingBookmark) {
      return res.status(400).json({ msg: 'Snippet already bookmarked' });
    }

    const newBookmark = await Bookmark.create({
      userId: req.user.id,
      snippetId: req.params.snippetId
    });
    res.json(newBookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Remove a bookmark
router.delete('/:snippetId', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      where: { userId: req.user.id, snippetId: req.params.snippetId }
    });

    if (!bookmark) {
      return res.status(404).json({ msg: 'Bookmark not found' });
    }

    await bookmark.destroy();
    res.json({ msg: 'Bookmark removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;