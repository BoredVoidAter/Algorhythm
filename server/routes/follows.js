const express = require('express');
const auth = require('../middleware/auth');
const Follow = require('../models/follow');
const User = require('../models/user');
const Snippet = require('../models/snippet');

const router = express.Router();

// Follow a user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user.userId;

    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({
      where: { followerId, followingId }
    });

    if (existingFollow) {
      return res.status(400).json({ msg: 'Already following this user' });
    }

    await Follow.create({ followerId, followingId });
    res.status(200).json({ msg: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow a user
router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user.userId;

    const result = await Follow.destroy({
      where: { followerId, followingId }
    });

    if (result === 0) {
      return res.status(404).json({ msg: 'Not following this user' });
    }

    res.status(200).json({ msg: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get snippets from followed users
router.get('/following/snippets', auth, async (req, res) => {
  try {
    const followerId = req.user.userId;

    const followedUsers = await Follow.findAll({
      where: { followerId },
      attributes: ['followingId']
    });

    const followingIds = followedUsers.map(follow => follow.followingId);

    if (followingIds.length === 0) {
      return res.status(200).json([]); // No followed users, return empty array
    }

    const snippets = await Snippet.findAll({
      where: { userId: followingIds },
      include: [{
        model: User,
        attributes: ['id', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if current user is following a specific user
router.get('/is-following/:userId', auth, async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    const existingFollow = await Follow.findOne({
      where: { followerId, followingId }
    });

    res.json({ isFollowing: !!existingFollow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
